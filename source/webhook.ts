import * as express from "express"
import fetch from "node-fetch"
import { createGHAPI } from "./podspec/api"
import { grabCommunityProfile } from "./podspec/getCommunityProfile"
import { getGitHubMetadata } from "./podspec/getGitHubMetadata"
import { PodspecJSON } from "./podspec/types"
import { uploadCHANGELOG, uploadREADME } from "./podspec/uploadTextContent"
import { CocoaDocsRow, updateCocoaDocsRowForPod } from "./trunk/db"

export interface TrunkWebhook {
  type: string
  action: string
  timestamp: string
  pod: string
  version: string
  commit: string
  data_url: string
}

export const trunkWebhook = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const webhookJSON = req.body as TrunkWebhook

  // Ensure it validates
  if (!webhookJSON.data_url) {
    return res.status(404).send({ error: "No data_url provided" })
  }

  const specsRepoSuffix = "https://raw.githubusercontent.com/CocoaPods/Specs"
  if (!webhookJSON.data_url.startsWith(specsRepoSuffix)) {
    // tslint:disable-next-line:no-console
    console.error(`Webhook (${webhookJSON.data_url}) did not start with ${specsRepoSuffix}.`)
    return res.status(401).send({ error: "data_url should be for the CocoaPods specs repo" })
  }

  res.status(200).send({ ok: true })

  const podspecResponse = await fetch(webhookJSON.data_url)
  const podspecJSON: PodspecJSON = await podspecResponse.json()
  const ghDetails = getGitHubMetadata(podspecJSON)

  if (!ghDetails && !podspecJSON.readme) {
    // tslint:disable-next-line:no-console
    console.error(`[${webhookJSON.pod} - ${webhookJSON.version}] is not a GitHub project and has no README, skipping.`)
    return
  }

  const prefix = `[${podspecJSON.name} - ${podspecJSON.version}]`
  console.log(`${prefix} Getting info on README, CHANGELOG and community metrics.`)
  try {
    const api = createGHAPI()
    const newREADMEURL = await uploadREADME(podspecJSON, api, ghDetails)
    const newCHANGELOG = await uploadCHANGELOG(podspecJSON, api, ghDetails)
    const communityProfile = (ghDetails && (await grabCommunityProfile(podspecJSON, api, ghDetails))) || null

    if (newREADMEURL) {
      const row: CocoaDocsRow = {
        name: webhookJSON.pod,
        rendered_readme_url: newREADMEURL,
      }

      if (newCHANGELOG) {
        row.rendered_changelog_url = newCHANGELOG
      }

      if (communityProfile) {
        row.license_short_name = (communityProfile.files.license && communityProfile.files.license.spdx_id) || "Unknown"
        row.license_canonical_url =
          (communityProfile.files.license && communityProfile.files.license.url) || (ghDetails && ghDetails.href)
      }

      await updateCocoaDocsRowForPod(row)

      const has = (x: any) => x ? "✔" : "✗"
      console.log(`${" ".repeat(prefix.length)} Updated: ${has(newREADMEURL)} README, ${has(newCHANGELOG)} CHANGELOG & ${has(communityProfile)} Profile.`)
    } else {
      console.log(`${" ".repeat(prefix.length)} - Skipped due to no README`)
    }
  } catch (error) {
    console.error(`Uncaught error: ${error}`)
  }
}
