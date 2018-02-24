import { createApp } from "./server"

const app = createApp()
app.listen(app.get("port"), () => {
  // tslint:disable-next-line:no-console
  console.info(`Started server at http://localhost:${app.get("port")}`)
})
