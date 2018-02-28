import { readFileSync } from "fs"
import { join } from "path"

import { grabCommunityProfile } from "../getCommunityProfile"

describe("grabbing the README", () => {
  it("uses the GH API to grab the community metadata", () => {
    const fixtures = join(__dirname, "fixtures", "ARTiledImageView.json")
    const podspec = JSON.parse(readFileSync(fixtures, "utf8"))

    const api = { repos: { getCommunityProfileMetrics: jest.fn() } }
    const repo = {
      owner: "dblock",
      name: "ARTiledImageView",
      repo: "dblock/ARTiledImageView",
      href: "https://github.com/dblock/ARTiledImage.git"
    }

    grabCommunityProfile(podspec, api as any, repo)

    expect(api.repos.getCommunityProfileMetrics).toBeCalledWith({
      headers: { accept: "application/vnd.github.black-panther-preview+json" },
      owner: "dblock",
      name: "ARTiledImageView"
    })
  })
})
