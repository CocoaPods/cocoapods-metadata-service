import { readFileSync } from "fs"
import { join } from "path"
import { grabCHANGELOG, grabREADME } from "../uploadTextContent"
import fetch from "node-fetch"

jest.mock("../../globals", () => ({
  AWS_BUCKET: "test_bucket"
}))

class mockAWS3 {
  public upload = jest.fn()
}

jest.mock("aws-sdk", () => ({ S3: mockAWS3 }))

jest.mock("node-fetch")

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

describe("grabbing the README with http", () => {
  it("uses http to grab the README", () => {
    const fixtures = join(__dirname, "fixtures", "ARTiledImageViewExplicitMetadata.json")
    const podspec = JSON.parse(readFileSync(fixtures, "utf8"))
    const api = { repos: { getContent: jest.fn() } }
    const repo = {
      owner: "dblock",
      name: "ARTiledImageView",
      repo: "dblock/ARTiledImageView",
      href: "https://github.com/dblock/ARTiledImage.git"
    }

    fetch.mockClear()
    fetch.mockResolvedValue("Best SDK ever.")

    grabREADME(podspec, api as any, repo).then(readme => {
      expect(readme).toBe("Best SDK ever.")
      expect(fetch).toBeCalledWith("https://example.com/README1")
      expect(api.repos.getContent).toHaveBeenCalledTimes(0)
    })
  })
})

describe("grabbing the CHANGELOG with http", () => {
  it("uses http to grab the README", () => {
    const fixtures = join(__dirname, "fixtures", "ARTiledImageViewExplicitMetadata.json")
    const podspec = JSON.parse(readFileSync(fixtures, "utf8"))
    const api = { repos: { getContent: jest.fn() } }
    const repo = {
      owner: "dblock",
      name: "ARTiledImageView",
      repo: "dblock/ARTiledImageView",
      href: "https://github.com/dblock/ARTiledImage.git"
    }

    fetch.mockClear()
    fetch.mockResolvedValue("Fixed everything.")

    grabCHANGELOG(podspec, api as any, repo).then(changelog => {
      expect(changelog).toBe("Fixed everything.")
      expect(fetch).toBeCalledWith("https://example.com/CHANGELOG1")
      expect(api.repos.getContent).toHaveBeenCalledTimes(0)
    })
  })
})

describe("grabbing the README returns null", () => {
  it("fails to grab the README when none provided", () => {
    const fixtures = join(__dirname, "fixtures", "ARTiledImageViewNoMetadata.json")
    const podspec = JSON.parse(readFileSync(fixtures, "utf8"))
    const api = { repos: { getContent: jest.fn() } }

    fetch.mockClear()

    grabREADME(podspec, api as any, undefined).then(readme => {
      expect(readme).toBeNull()
      expect(fetch).toHaveBeenCalledTimes(0)
      expect(api.repos.getContent).toHaveBeenCalledTimes(0)
    })
  })
})

describe("grabbing the CHANGELOG returns null", () => {
  it("fails to grab the README when none provided", () => {
    const fixtures = join(__dirname, "fixtures", "ARTiledImageViewNoMetadata.json")
    const podspec = JSON.parse(readFileSync(fixtures, "utf8"))
    const api = { repos: { getContent: jest.fn() } }

    fetch.mockClear()

    grabCHANGELOG(podspec, api as any, undefined).then(changelog => {
      expect(changelog).toBeNull()
      expect(fetch).toHaveBeenCalledTimes(0)
      expect(api.repos.getContent).toHaveBeenCalledTimes(0)
    })
  })
})
