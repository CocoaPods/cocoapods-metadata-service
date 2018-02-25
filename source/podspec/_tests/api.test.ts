// tslint:disable-next-line:class-name
class mockOctoFake {
  public authenticate = jest.fn()
}

jest.mock("@octokit/rest", () => mockOctoFake)
jest.mock("../../globals", () => ({
  GITHUB_ACCESS_TOKEN: "123456"
}))

import { createGHAPI } from "../api"
it("creates an API with the ENV token", () => {
  const api = createGHAPI()
  expect(api.authenticate).toBeCalledWith({ token: "123456", type: "token" })
})
