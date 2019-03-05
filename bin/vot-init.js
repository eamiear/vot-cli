#!/usr/bin/env node

const download = require('download-git-repo')
const program = require('commander')
const exists = require('fs').existsSync
const path = require('path')
const ora = require('ora')
const home = require('user-home')
const tildify = require('tildify')
const chalk = require('chalk')
const inquirer = require('inquirer')
const rm = require('rimraf').sync
const logger = require('../lib/logger')
const generate = require('../lib/generate')
const localPath = require('../lib/local-path')

const isLocalPath = localPath.isLocalPath
const getTemplatePath = localPath.getTemplatePath


/**
 * Usage
 */

program
  .usage('<template-name> [project-name]')
  .option('-c, --clone', 'use git clone')
  .option('-o, --offline', 'use cached template')
  .option('-r, --repo [path]', 'use a custom repo, default: "vot-admin-templates/"')

/**
 * Help
 */
program.on('--help', () => {
  console.log('  Example:')
  console.log()
  console.log(chalk.gray('   # create a new project with an official template'))
  console.log('     $ vue init vue-admin-nav my-app')
  console.log()
  console.log(chalk.gray('   # create a new project straight from a github template'))
  console.log('     $ vue init username/repo my-app')
  console.log()
})

/**
 * Help
 */
function help () {
  program.parse(process.argv)
  if (program.args.length < 1) return program.help()
}
help()

/**
 * Setting
 */

let template = program.args[0]
const hasSlash = template.indexOf('/') > -1
const projectName = program.args[1]
const inPlace = !projectName || projectName === '.'
const name = inPlace ? path.relative('../', process.cwd()) : projectName
const to = path.resolve(projectName || '.')
const clone = program.clone || false
// the template repo url
const repo = program.repo || 'ura-admin-templates/'

/**
 * Cached path | templates in local path
 */
const cachePath = path.join(home, '.vot-templates', template.replace(/[\/:]/g, '-'))
if (program.offline) {
  console.log(`> Use cached template at ${chalk.yellow(tildify(cachePath))}`)
  template = cachePath
}

/**
 * Padding
 */
console.log()
process.on('exit', () => {
  console.log()
})

/**
 * In current place or target directory exists
 */
if (inPlace || exists(to)) {
  inquirer.prompt([{
    type: 'confirm',
    message: inPlace
      ? 'Generate project in current directory?'
      : 'Target directory exists. Continue?',
    name: 'ok'
  }]).then(answer => {
    if (answer.ok) {
      run()
    }
  }).catch(logger.fatal)
} else {
  run()
}

/**
 * Check, download an generate the project
 */
function run () {
  // use local template
  if (isLocalPath(template)) {
    const templatePath = getTemplatePath(template)
    if (exists(templatePath)) {
      generate(name, templatePath, to, err => {
        if (err) logger.fatal(err)
        console.log()
        logger.success('Generated "%s".', name)
      })
    } else {
      logger.fatal('Local template "%s" not found.', template)
    }
  } else {
    // download and use online template
    if (!hasSlash) {
      const officialTemplate = repo + template
      downloadAndGenerate(officialTemplate)
    } else {
      downloadAndGenerate(template)
    }
  }
}

/**
 * Download a generate from a template repo
 */

function downloadAndGenerate (template) {
  const spinner = ora('downloading template')
  spinner.start()
  // Remove if local template exists
  if (exists(cachePath)) rm(cachePath)
  // download template online and save it to local path
  download(template, cachePath, { clone }, err => {
    spinner.stop()
    if (err) logger.fatal('Failed to download repo ' + template + ': ' + err.message.trim())
    // generate project named name with template in cachePath and save it to 'to' path
    generate(name, cachePath, to, err => {
      if (err) logger.fatal(err)
      console.log()
      logger.success('Generated "%s".', name)
    })
  })
}
