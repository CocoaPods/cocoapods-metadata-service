import { getGitHubMetadata } from "../getGitHubMetadata"

it("checks the URL correctly", () => {
  const podspec: any = {
    source: {
      git: "https://github.com/apollographql/apollo-ios.git"
    }
  }
  const ghDetails = getGitHubMetadata(podspec)

  expect(ghDetails).toMatchObject({
    href: "https://github.com/apollographql/apollo-ios.git",
    name: "apollo-ios",
    owner: "apollographql",
    repo: "apollographql/apollo-ios"
  })
})

it("returns undefeined for gitlab", () => {
  const podspec: any = {
    source: {
      git: "https://gitlab.com/danger-systems/danger.systems"
    }
  }
  const ghDetails = getGitHubMetadata(podspec)

  expect(ghDetails).toBeUndefined()
})

it("returns undefined for http URLs", () => {
  const podspec: any = {
    source: {
      http: "https://kit-downloads.fabric.io/cocoapods/fabric/1.7.3/fabric.zip"
    }
  }
  const ghDetails = getGitHubMetadata(podspec)

  expect(ghDetails).toBeUndefined()
})
