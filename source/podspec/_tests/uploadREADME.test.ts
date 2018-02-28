import { readFileSync } from "fs"
import { join } from "path"
import { grabCHANGELOG, grabREADME } from "../uploadTextContent"

jest.mock("../../globals", () => ({
  AWS_BUCKET: "test_bucket"
}))

class mockAWS3 {
  public upload = jest.fn()
}

jest.mock("aws-sdk", () => ({ S3: mockAWS3 }))

describe("grabbing the README", () => {
  it("uses the GH API to grab the README", () => {
    const fixtures = join(__dirname, "fixtures", "ARTiledImageView.json")
    const podspec = JSON.parse(readFileSync(fixtures, "utf8"))

    const api = { repos: { getReadme: jest.fn() } }
    const repo = {
      owner: "dblock",
      name: "ARTiledImageView",
      repo: "dblock/ARTiledImageView",
      href: "https://github.com/dblock/ARTiledImage.git"
    }

    grabREADME(podspec, api as any, repo)

    expect(api.repos.getReadme).toBeCalledWith({
      headers: { accept: "application/vnd.github.VERSION.html" },
      owner: "dblock",
      ref: "1.1.1",
      repo: "ARTiledImageView"
    })
  })
})

describe("grabbing the CHANGELOG", () => {
  it("uses the GH API to grab the README", () => {
    const fixtures = join(__dirname, "fixtures", "ARTiledImageView.json")
    const podspec = JSON.parse(readFileSync(fixtures, "utf8"))

    const api = { repos: { getContent: jest.fn() } }
    const repo = {
      owner: "dblock",
      name: "ARTiledImageView",
      repo: "dblock/ARTiledImageView",
      href: "https://github.com/dblock/ARTiledImage.git"
    }

    grabCHANGELOG(podspec, api as any, repo)

    expect(api.repos.getContent).toBeCalledWith({
      headers: { accept: "application/vnd.github.VERSION.html" },
      owner: "dblock",
      ref: "1.1.1",
      repo: "ARTiledImageView",
      path: "CHANGELOG.md"
    })
  })
})
