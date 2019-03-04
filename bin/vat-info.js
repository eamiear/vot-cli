#!/usr/bin/env node

const envinfo = require('envinfo')
const chalk = require('chalk')
const ora = require('ora')

/**
 * Padding
 */

console.log()
process.on('exit', () => {
  console.log()
})

console.log(chalk.bold('\nEnvironment Info:'))
const spinner = ora('...')
spinner.start()
envinfo.run(
  {
    System: ['OS', 'CPU'],
    Binaries: ['Node', 'Yarn', 'npm'],
    Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
    npmGlobalPackages: ['vat-cli']
  },
  {
    showNotFound: true,
    duplicates: true,
    fullTree: true
  }
).then(info => {
  spinner.stop()
  console.log(info)
})

