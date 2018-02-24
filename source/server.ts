import * as bodyParser from "body-parser"
import * as express from "express"
import { trunkWebhook } from "./webhook"

export const createApp = () => {
  const app = express()
  app.set("port", process.env.PORT || 5000)
  app.use(bodyParser.json())

  app.post("/webhook", trunkWebhook)
  return app
}
