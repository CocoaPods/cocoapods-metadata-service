import { app } from "../server"
import { trunkWebhook } from "../webhook"

it.skip("sets up the trunk webhook to run on/webhook", () => {
  const testApp = app

  expect(app.routes).toEqual({})
})
