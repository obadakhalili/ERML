module.exports = {
  testMatch: ["**/tests/**/*.+(ts)"],
  transform: {
    "\\.ts$": "ts-jest",
    "\\.js$": "babel-jest",
  },
}
