const path = require('path')

exports.rootDir = (paths) => {
  return path.join(__dirname, '..', ...paths)
}