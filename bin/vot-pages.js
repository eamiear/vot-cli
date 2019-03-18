const { cd, exec, echo, touch } = require('shelljs')
const readFileSync = require('fs').readFileSync
const url = require('url')

let repoUrl
let pkg = JSON.parse(readFileSync('package.json'))
if (typeof pkg.repository === 'object') {
  if (!pkg.repository.hasOwnProperty('url')) {
    throw new Error('do not exist url in repository')
  }
  repoUrl = pkg.repository.url
} else {
  repoUrl = pkg.repository
}

repoUrl = url.parse(repoUrl)

