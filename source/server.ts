import * as bodyParser from "body-parser"
import * as express from "express"
import { TRUNK_WEBHOOK_SECRET } from "./globals"
import { trunkWebhook } from "./webhook"

export const createApp = () => {
  const app = express()
  app.set("port", process.env.PORT || 5000)
  app.use(bodyParser.json())

  app.post(`/webhook/${TRUNK_WEBHOOK_SECRET}`, trunkWebhook)
  return app
}
