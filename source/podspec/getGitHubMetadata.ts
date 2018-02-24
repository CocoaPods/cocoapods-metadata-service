import * as parseGithubURL from "parse-github-url"
import { PodspecJSON } from "./types"

interface GitHubDetailsForPodspec {
  owner: string
  name: string
  repo: string
  href: string
  branch?: string
}

export const getGitHubMetadata = (podspec: PodspecJSON): GitHubDetailsForPodspec | undefined => {
  if (!podspec.source.git) {
    return undefined
  }

  if (!podspec.source.git.includes("github")) {
    return undefined
  }

  return parseGithubURL(podspec.source.git) as GitHubDetailsForPodspec
}
