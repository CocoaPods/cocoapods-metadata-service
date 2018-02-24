import { TrunkWebhook, trunkWebhook } from "../webhook"

const dummyData: TrunkWebhook = {
  type: "pod",
  action: "create",
  timestamp: "2001-01-01 00:00:00 UTC",
  pod: "pod_name",
  version: "version_name",
  commit: "commit_sha",
  data_url: "some_url"
}
const next = jest.fn()

it("handles incorrect data", () => {
  const req: any = {
    body: {}
  }
  const res: any = {
    status: jest.fn(() => res),
    send: jest.fn(() => res)
  }

  trunkWebhook(req, res, next)

  expect(res.status).toBeCalledWith(404)
  expect(res.send).toBeCalledWith({ error: "No data_url provided" })
})
