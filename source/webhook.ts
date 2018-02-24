import * as express from "express"

interface TrunkWebhook {
  type: string
  action: string
  timestamp: string
  pod: string
  version: string
  commit: string
  data_url: string
}

export const trunkWebhook = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // tslint:disable-next-line:no-console
  console.log("Hi!")
}
