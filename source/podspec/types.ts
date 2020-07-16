// This is not a complete map, but is enough to be useful

export interface PodspecJSON {
  name: string
  version: string
  authors: string
  homepage: string
  license: License
  summary: string
  readme?: string
  changelog?: string
  source: Source
  requires_arc: boolean
  default_subspecs: string
  pushed_with_swift_version: string
  dependencies?: any
}

export interface Source {
  git: string
  tag: string
}

export interface License {
  type: string
  file: string
}
