const path = require('path')
const metadata = require('read-metadata')
const exists = require('fs').existsSync
const getGisUser = require('./git-user')
const validateName = require('validate-npm-package-name')

/**
 * Read prompts metadata
 */
module.exports = function options (name, dir) {
  const opts = getMetadata(dir)

  setDefault(opts, 'name', name)
  setValidateName(opts)

  const author = getGisUser()
  if (author) {
    setDefault(opts, 'author', author)
  }

  return opts
}

/**
 * Gets the metadata from either a vot.meta.json or vot.meta.js file in given directory
 * @param {String} dir
 */
function getMetadata (dir) {
  const json = path.join(dir, 'vot.meta.json')
  const js = path.join(dir, 'vot.meta.js')
  let opts = {}

  if (exists(json)) {
    opts = metadata.sync(json)
  } else if (exists(js)) {
    const req = require(path.resolve(js))
    if (req !== Object(req)) {
      throw new Error('vot.meta.js needs to expose an object')
    }
    opts = req
  }
  return opts
}

/**
 * Set the default value for a prompt question
 * @param {Object} opts
 * @param {String} key
 * @param {String} val
 */
function setDefault (opts, key, val) {
  const prompts = opts.prompts || (opts.prompts = {})
  if (!prompts[key] || typeof prompts[key] !== 'object') {
    prompts[key] = {
      'type': 'string',
      'default': val
    }
  } else {
    prompts[key]['default'] = val
  }
}

/**
 * Validate project name
 * @param {Object} opts
 */
function setValidateName (opts) {
  const name = opts.prompts.name
  const customValidate = name.validateName
  name.validate = name => {
    const its = validateName(name)
    if (!its.validForNewPackages) {
      const errors = (its.errors || []).concat(its.warnings || [])
      return 'Sorry, ' + errors.join(' and ') + '.'
    }
    if (typeof customValidate === 'function') return customValidate(name)
    return true
  }
}
