module.exports = {
  indexPath: '../index.html',
  baseUrl: process.env.NODE_ENV === 'production'
    ? '/japanese-romaji-converter/dist/'
    : '/'
}