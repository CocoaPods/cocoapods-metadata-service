module.exports = function(wallaby) {
  return {
    files: [
      "tsconfig.json",
      "source/**/*.ts?(x)",
      "source/**/*.snap",
      "source/**/*.json",
      "source/**/*.diff",
      "!source/**/*.test.ts?(x)"
    ],
    tests: ["source/**/*.test.ts?(x)"],

    env: {
      type: "node",
      runner: "node"
    },

    testFramework: "jest",
    debug: true
  }
}
