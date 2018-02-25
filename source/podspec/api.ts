import * as Octokit from "@octokit/rest"
import { GITHUB_ACCESS_TOKEN } from "../globals"

export const createGHAPI = () => {
  const api = new Octokit()
  api.authenticate({ token: GITHUB_ACCESS_TOKEN, type: "token" })
  return api
}
