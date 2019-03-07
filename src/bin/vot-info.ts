#!/usr/bin/env node

import chalk from 'chalk'
import ora from 'ora'
import envinfo from 'envinfo'

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
    npmGlobalPackages: ['vot']
  },
  {
    showNotFound: true,
    duplicates: true,
    fullTree: true
  }
).then((info: any) => {
  spinner.stop()
  console.log(info)
})

