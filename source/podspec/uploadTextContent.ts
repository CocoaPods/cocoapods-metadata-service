import * as Octokit from "@octokit/rest"
import * as AWS from "aws-sdk"
import fetch from "node-fetch"

import { AWS_BUCKET } from "../globals"
import { GitHubDetailsForPodspec } from "./getGitHubMetadata"
import { PodspecJSON } from "./types"

export const grabREADME = async (pod: PodspecJSON, api: Octokit, repo: GitHubDetailsForPodspec | undefined) => {
  if (pod.readme) {
    const readmeReq = await fetch(pod.readme)
    return await readmeReq.text()
  } else if (!repo) {
    return null
  }

  const headers = {
    accept: "application/vnd.github.VERSION.html",
  }

  const READMEResponse = await api.repos.getReadme({
    ref: pod.source.tag,
    repo: repo.name,
    owner: repo.owner,
    headers,
  } as any)

  return (READMEResponse && READMEResponse.data) || null
}

export const grabCHANGELOG = async (pod: PodspecJSON, api: Octokit, repo: GitHubDetailsForPodspec | undefined) => {
  if (pod.changelog) {
    const changlogReq = await fetch(pod.changelog)
    return await changlogReq.text()
  } else if (!repo) {
    return null
  }

  const headers = {
    accept: "application/vnd.github.VERSION.html",
  }

  try {
    const READMEResponse = await api.repos.getContent({
      ref: pod.version,
      repo: repo.name,
      owner: repo.owner,
      path: "CHANGELOG.md",
      headers,
    } as any)
    return READMEResponse.data
  } catch (error) {
    return undefined
  }
}

export const uploadREADME = async (pod: PodspecJSON, api: Octokit, repo: GitHubDetailsForPodspec | undefined) => {
  const README = await grabREADME(pod, api, repo)
  if (!README) {
    return null
  }

  // e.g: upload to http://cocoadocs.org/docsets/LlamaKit/0.6.0/README.html
  const s3 = new AWS.S3()
  const filePath = `docsets/${pod.name}/${pod.version}/README.html`
  try {
    await s3.upload({ Body: README, Bucket: AWS_BUCKET, Key: filePath }).promise()
    return `http://${AWS_BUCKET}.s3.amazonaws.com/${filePath}`
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error("Got an error uploading to s3", error)
  }
}

export const uploadCHANGELOG = async (pod: PodspecJSON, api: Octokit, repo: GitHubDetailsForPodspec | undefined) => {
  const CHANGELOG = await grabCHANGELOG(pod, api, repo)
  if (!CHANGELOG) {
    return null
  }

  const s3 = new AWS.S3()
  const filePath = `docsets/${pod.name}/${pod.version}/CHANGELOG.html`
  try {
    await s3.upload({ Body: CHANGELOG, Bucket: AWS_BUCKET, Key: filePath }).promise()
    return `http://${AWS_BUCKET}.s3.amazonaws.com/${filePath}`
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error("Got an error uploading to s3", error)
    return null
  }
}
