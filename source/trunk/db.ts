import { Client } from "pg"
import { TRUNK_DATABASE_URL } from "../globals"

export const trunk = new Client({ connectionString: TRUNK_DATABASE_URL, ssl: true })

trunk.on("error", (err) => {
  console.error(`Got a db error: ${err}`)
})

export const setup = async () => {
  console.log("Connecting to trunk db")
  await trunk.connect(err => {
    if (err) {
      console.error('Trunk connection error', err)
    } else {
      console.log('Connected to trunk')
    }
  })

}

export interface CocoaDocsRow {
  name: string
  created_at?: string
  updated_at?: string
  license_short_name?: string
  license_canonical_url?: string
  rendered_readme_url: string
  rendered_changelog_url?: string
  dominant_language?: string
  rendered_summary?: string
}

export const updateCocoaDocsRowForPod = async (row: CocoaDocsRow) => {
  // Check for existing cocoadocs row
  const podQuery = 'SELECT id FROM "pods" WHERE ("name" = $1)'
  const podValues = [row.name]
  const pod = await trunk.query(podQuery, podValues)
  if (!pod.rowCount) {
    // tslint:disable-next-line:no-console
    console.error(`Could not find a pod for ${row.name}`)
    return
  }

  const podID = pod.rows[0].id
  const existsQuery = 'SELECT id FROM "cocoadocs_pod_metrics" WHERE ("pod_id" = $1)'
  const existsValues = [podID]
  const existingRow = await trunk.query(existsQuery, existsValues)
  if (existingRow.rowCount) {
    // Update if it exists
    const insertQuery = `UPDATE cocoadocs_pod_metrics SET "rendered_readme_url"=$1, "rendered_changelog_url"=$2, "license_short_name"=$3, "license_canonical_url"=$4 "updated_at"=$5 WHERE "id"=$6`
    const insertValues = [
      row.rendered_readme_url,
      row.rendered_changelog_url,
      row.license_short_name,
      row.license_canonical_url,
      (new Date()).toISOString(),
      existingRow.rows[0].id
    ]
    await trunk.query(insertQuery, insertValues)
  } else {
    // Create if it doesn't exist
    const insertQuery =
      "INSERT INTO cocoadocs_pod_metrics(pod_id, rendered_readme_url, rendered_changelog_url, license_short_name, license_canonical_url, updated_at) VALUES($1::int, $2::text, $3::text, $4::text, $5::text, $6::text)"
    const insertValues = [
      podID,
      row.rendered_readme_url,
      row.rendered_changelog_url,
      row.license_short_name,
      row.license_canonical_url,
      (new Date()).toISOString(),
    ]
    await trunk.query(insertQuery, insertValues)
  }
}
