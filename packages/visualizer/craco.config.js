// TODO: Migrate to Vite
// TODO: Removed shared modules from root package.json

module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
}
