import { validateENV } from "./globals"
import { createApp } from "./server"
import { setup as setupTrunkConnection } from "./trunk/db"

// Ensure we have everything needed to run the server
validateENV()

const app = createApp()
app.listen(app.get("port"), () => {
  setupTrunkConnection()
  // tslint:disable-next-line:no-console
  console.info(`Started server at http://localhost:${app.get("port")}`)
})
