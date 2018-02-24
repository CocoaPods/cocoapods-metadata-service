import * as Octokit from "@octokit/rest"

export const createGHAPI = () => {
  const api = new Octokit()
  api.authenticate({ token: "e622517d9f1136ea890007c6373666312cdfaa69", type: "token" })
  return api
}
