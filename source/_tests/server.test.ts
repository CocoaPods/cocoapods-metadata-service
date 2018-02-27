const mockPost = jest.fn()
const mockUse = jest.fn()
jest.mock("express", () => () => ({ set: jest.fn(), post: mockPost, use: mockUse }))

import { createApp } from "../server"

it("it sets up the json body parser", () => {
  createApp()
  expect(mockUse).toBeCalled()
})

it("sets up the trunk webhook to run on/webhook", () => {
  createApp()
  expect(mockPost).toBeCalledWith("/webhook/trunk_secret", expect.anything())
})
