import { validateENV } from "./globals"
import { createApp } from "./server"

// Ensure we have everything needed to run the server
validateENV()

const app = createApp()
app.listen(app.get("port"), () => {
  // tslint:disable-next-line:no-console
  console.info(`Started server at http://localhost:${app.get("port")}`)
})
