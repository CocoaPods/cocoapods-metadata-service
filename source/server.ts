import * as express from "express"
import { trunkWebhook } from "./webhook"

export const app = express()
  .set("port", process.env.PORT || 5000)
  .post("/webhook", trunkWebhook)
