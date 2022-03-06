module.exports = {
  reactStrictMode: true,
  async Headers() {
    return [
      {
        source: '/api/:path*',
      },
    ]
  },
}
