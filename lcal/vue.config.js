module.exports = {
  parallel: false,
  publicPath: process.env.NODE_ENV === 'production'
    ? '/lcal/'
    : '/',
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'LunaCalculator',
    },
  },
}
