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

  if (!webhookJSON.data_url.includes("https://github.com/CocoaPods/Specs/raw")) {
    return res.status(401).send({ error: "data_url should be for the CocoaPods specs repo" })
  }

  res.status(200).send({ ok: true })

  const podspecResponse = await fetch(webhookJSON.data_url)
  const podspecJSON: PodspecJSON = await podspecResponse.json()
  const ghDetails = getGitHubMetadata(podspecJSON)

  if (!ghDetails) {
    // tslint:disable-next-line:no-console
    console.error(`[${webhookJSON.pod} - ${webhookJSON.version}] is not a GitHub project, skipping.`)
    return
  }

  const api = createGHAPI()
  const newREADMEURL = await uploadREADME(podspecJSON, api, ghDetails)
  const newCHANGELOG = await uploadCHANGELOG(podspecJSON, api, ghDetails)
  const communityProfile = await grabCommunityProfile(podspecJSON, api, ghDetails)

  if (newREADMEURL) {
    const row: CocoaDocsRow = {
      name: webhookJSON.pod,
      rendered_readme_url: newREADMEURL,
      license_canonical_url: communityProfile.files.license.url,
      license_short_name: communityProfile.files.license.spdx_id
    }

    if (newCHANGELOG) {
      row.rendered_changelog_url = newCHANGELOG
    }

    await updateCocoaDocsRowForPod(row)
    // tslint:disable-next-line:no-console
    console.log(`Updated ${podspecJSON.name} - ${podspecJSON.version}`)
  }
}
