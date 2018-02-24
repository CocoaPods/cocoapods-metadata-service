import * as dotenv from "dotenv"
const isJest = typeof jest !== "undefined"
const config = isJest ? { path: ".env.sample" } : {}
dotenv.config(config)

/**
 * Pulls out an env var from either the host ENV, or a config file
 *
 * @param {string} local ENV key
 * @param {string} configName Config key
 * @returns {string}
 */
function getEnv(configName: string): string {
  return process.env[configName]!
}

function validates(keys: string[]) {
  keys.forEach(element => {
    if (!getEnv(element)) {
      throw new Error(`Could not get Key: ${element}`)
    }
  })
}

/** The S3 access key for uploading READMES */
export const AWS_ACCESS_KEY_ID = getEnv("AWS_ACCESS_KEY_ID")

/** The S3 secret key for uploading READMES */
export const AWS_SECRET_ACCESS_KEY = getEnv("AWS_SECRET_ACCESS_KEY")

/** The S3 bucket for uploading READMES */
export const AWS_BUCKET = getEnv("AWS_BUCKET")

export const validateENV = () => {
  // Can't run without these
  validates(["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_BUCKET"])
}
