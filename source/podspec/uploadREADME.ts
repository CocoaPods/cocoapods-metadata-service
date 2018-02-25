import * as Octokit from "@octokit/rest"
import * as AWS from "aws-sdk"

import { AWS_BUCKET } from "../globals"
import { GitHubDetailsForPodspec } from "./getGitHubMetadata"
import { PodspecJSON } from "./types"

export const grabREADME = async (pod: PodspecJSON, api: Octokit, repo: GitHubDetailsForPodspec) => {
  const headers = {
    accept: "application/vnd.github.VERSION.html"
  }

  const READMEResponse = await api.repos.getReadme({
    ref: pod.version,
    repo: repo.name,
    owner: repo.owner,
    headers
  } as any)

  return READMEResponse.data
}

export const uploadREADME = async (pod: PodspecJSON, api: Octokit, repo: GitHubDetailsForPodspec) => {
  const README = await grabREADME(pod, api, repo)

  // e.g: upload to http://cocoadocs.org/docsets/LlamaKit/0.6.0/README.html
  const s3 = new AWS.S3()
  const filePath = `docsets/${pod.name}/${pod.version}/README.html`
  try {
    return await s3.upload({ Body: README, Bucket: AWS_BUCKET, Key: filePath }).promise()
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error("Got an error uploading to s3", error)
  }
}
