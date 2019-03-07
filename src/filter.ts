import match from 'minimatch'
import evaluate from './eval'

/**
 * Filter unnecessary files
 * when the file match the filters key, evaluate the filter value whether it is available in data
 * @param files  files to render by metalsmith
 * @param filters
 * @param data metalsmith.metadata()
 * @param done
 */
export default (files: any, filters: any, data: any, done: () => {}) => {
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
