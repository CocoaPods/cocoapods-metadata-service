import * as Octokit from "@octokit/rest"

import { GitHubDetailsForPodspec } from "./getGitHubMetadata"
import { PodspecJSON } from "./types"

export interface CodeOfConduct {
  name: string
  key: string
  url: string
  html_url: string
}

export interface Contributing {
  url: string
  html_url: string
}

export interface IssueTemplate {
  url: string
  html_url: string
}

export interface PullRequestTemplate {
  url: string
  html_url: string
}

export interface License {
  name: string
  key: string
  spdx_id: string
  url: string
  html_url: string
}

export interface Readme {
  url: string
  html_url: string
}

export interface Files {
  code_of_conduct: CodeOfConduct
  contributing: Contributing
  issue_template: IssueTemplate
  pull_request_template: PullRequestTemplate
  license: License
  readme: Readme
}

export interface CommunityProfile {
  health_percentage: number
  description: string
  documentation: boolean
  files: Files
  updated_at: Date
}

export const grabCommunityProfile = async (pod: PodspecJSON, api: Octokit, repo: GitHubDetailsForPodspec) => {
  const headers = {
    accept: "application/vnd.github.black-panther-preview+json"
  }

  const READMEResponse = await api.repos.getCommunityProfileMetrics({
    name: repo.name,
    owner: repo.owner,
    headers
  } as any)

  return (READMEResponse && READMEResponse.data as CommunityProfile) || null
}
