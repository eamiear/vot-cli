import path from'path'
import metadata from 'read-metadata'
import { existsSync as exists } from 'fs'
import getGisUser from './git-user'
import validateName from 'validate-npm-package-name'
import { MetaOptions } from './type'

/**
 * Read prompts metadata
 * @param {String} name project name
 * @param {String} dir template source directory
 */
export default function options (name: string, dir: string): MetaOptions {
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
 * @param {String} dir template directory
 */
function getMetadata (dir: string) {
  const json = path.join(dir, 'vot.meta.json')
  const js = path.join(dir, 'vot.meta.js')
  let opts = {}

  if (exists(json)) {
    // read meta.json file
    opts = metadata.sync(json)
  } else if (exists(js)) {
    // read meta.js file
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
 * @param {Object} opts meta.js config
 * @param {String} key
 * @param {String} val
 */
function setDefault (opts: any, key: string, val: string) {
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
function setValidateName (opts: any) {
  const name = opts.prompts.name
  const customValidate = name.validateName
  name.validate = (name: any): boolean | string => {
    const its = validateName(name)
    if (!its.validForNewPackages) {
      const errors = (its.errors || []).concat(its.warnings || [])
      return 'Sorry, ' + errors.join(' and ') + '.'
    }
    if (typeof customValidate === 'function') return customValidate(name)
    return true
  }
}
