const match = require('minimatch')
const evaluate = require('./eval')

/**
 * Filter unnecessary files
 * when the file match the filters key, evaluate the filter value whether it is available in data
 * @param files  files to render by metalsmith
 * @param filters
 * @param data metalsmith.metadata()
 * @param done
 */
module.exports = (files, filters, data, done) => {
  if (!filters) {
    return done()
  }
  const fileNames = Object.keys(files)
  Object.keys(filters).forEach(glob => {
    fileNames.forEach(file => {
      if (match(file, glob, { dot: true })) {
        const condition = filters[glob]
        if (!evaluate(condition, data)) {
          delete files[file]
        }
      }
    })
  })
  done()
}
