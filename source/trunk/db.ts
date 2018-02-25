import { Client } from "pg"
import { TRUNK_DATABASE_URL } from "../globals"

export const trunk: Client = null as any

export const setup = async () => {
  const client = new Client(TRUNK_DATABASE_URL)
  await client.connect()
}

interface CocoaDocsRow {
  pod_id: number
  created_at: string
  updated_at: string
  license_short_name: string
  license_canonical_url: string
  rendered_readme_url: string
  rendered_changelog_url: string
  dominant_language: string
  rendered_summary: string
}

const updatePod = (row: CocoaDocsRow) => {
  // Get pod
  ;`SELECT id FROM "pods"  WHERE ("name" = 'ARTiledImageView') ORDER BY "id" ASC  LIMIT 1`
  // Search for row via pod_id
  // Check for existing
  // Create or Update
}
