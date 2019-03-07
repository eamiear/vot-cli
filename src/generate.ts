import chalk from 'chalk'
import Metalsmith from 'metalsmith'
import Handlebars from 'handlebars'
import async from 'async'
import { handlebars } from 'consolidate'
import path from 'path'
import multimatch from 'multimatch'

import getOptions from './options'
import logger from './logger'
import ask from './ask'
import filter from './filter'

const render = handlebars.render

 // register handlebars helper
Handlebars.registerHelper('if_eq', function (a: any, b: any, opts: any) {
  return a === b
    ? opts.fn(this)
    : opts.inverse(this)
})

Handlebars.registerHelper('unless_eq', function (a: any, b: any, opts: any) {
  return a === b
    ? opts.inverse(this)
    : opts.fn(this)
})

/**
 * @param {String} name project name
 * @param {String} src template source directory
 * @param {String} dest project destination
 * @param {Function} done
 */
export default function generate (name: string, src: string, dest: string, done: (...arg: any) => {}) {
  const opts = getOptions(name, src)
  // template directory for metalsmith source entry
  const metalsmith = Metalsmith(path.join(src, 'template'))
  const data = Object.assign(metalsmith.metadata(), {
    destDirName: name,
    inPlace: dest === process.cwd(),
    noEscape: true
  })
  // dynamic register handlebars helper
  opts.helper && Object.keys(opts.helper).map(key => {
    Handlebars.registerHelper(key, opts.helper[key])
  })

  const helpers = { chalk, logger }

  // do something before metalsmith rendering template
  if (opts.metalsmith && typeof opts.metalsmith.before === 'function') {
    opts.metalsmith.before(metalsmith, opts, helpers)
  }

  metalsmith.use(askQuestions(opts.prompts))
    .use(filterFiles(opts.filters))
    .use(renderTemplateFiles(opts.skipInterpolation))

  if (opts.metalsmith && typeof opts.metalsmith.after === 'function') {
    opts.metalsmith.after(metalsmith, opts, helpers)
  }

  metalsmith.clean(false)
    .source('.')
    .destination(dest)
    .build((err: any, files: any) => {
      done(err)
      if (typeof opts.complete === 'function') {
        const helpers = { chalk, logger, files }
        opts.complete(data, helpers)
      } else {
        logMessage(opts.completeMessage, data)
      }
    })
}

/**
 * Create a middleware for asking questions
 * @param {Object} prompts
 */
function askQuestions (prompts: any) {
  return (files: any, metalsmith: any, done: (...args: any) => {}) => {
    ask(prompts, metalsmith.metadata(), done)
  }
}

/**
 * Create a middleware for filtering files.
 *
 * @param {Object} filters
 * @return {Function}
 */
function filterFiles (filters: any) {
  return (files: any, metalsmith: any, done: any) => {
    filter(files, filters, metalsmith.metadata(), done)
  }
}

function renderTemplateFiles (skipInterpolation: any) {
  skipInterpolation = typeof skipInterpolation === 'string'
    ? [skipInterpolation]
    : skipInterpolation
  return (files: any, metalsmith: any, done: any) => {
    const keys = Object.keys(files)
    const metalsmithMetadata = metalsmith.metadata()
    async.each(keys, (file, next) => {
      // skipping files with skipInterpolation option
      if (skipInterpolation && multimatch([file], skipInterpolation, { dot: true}).length) {
        return next()
      }
      const str = files[file].contents.toString()
       // do not attempt to render files that do not have mustaches
       // files without {{}} will skip
      if (!/{{([^{}]+)}}/g.test(str)) {
        return next()
      }
      // render template string with metadata by handlebars template engine
      render(str, metalsmithMetadata, (err: any, res: any) => {
        if (err) {
          err.message = `[${file}] ${err.message}`
          return next(err)
        }
        files[file].contents = Buffer.from(res)
        next()
      })
    }, done)
  }
}

/**
 * Display template complete message
 * @param {String} message
 * @param {Object} data
 */
function logMessage (message: string, data: any) {
  if (!message) return
  render(message, data, (err: any, res: any) => {
    if (err) {
      console.error('\n   Error when rendering template complete message: ' + err.message.trim())
    } else {
      console.log('\n' + res.split(/\r?\n/g).map((line: any) => '   ' + line).join('\n'))
    }
  })
}
