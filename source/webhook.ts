import * as express from "express"
import fetch from "node-fetch"
import { PodspecJSON } from "./podspec/types"
import { getGitHubMetadata } from "./podspec/getGitHubMetadata"

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

  res.status(200).send({ ok: true })

  const podspecResponse = await fetch(webhookJSON.data_url)
  const podspecJSON: PodspecJSON = await podspecResponse.json()
  const ghDetails = getGitHubMetadata(podspecJSON)

  if (!ghDetails) {
    // tslint:disable-next-line:no-console
    console.error(`[${webhookJSON.pod} - ${webhookJSON.version}] is not a GitHub project, skipping.`)
    return
  }
}
