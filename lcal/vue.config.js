module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
      ? ''   //任意
      : '/'
      ,
    pages: {
        index: {
            entry: "src/main.js",
            title: "LunaCalculator",
        },
    },
  }
