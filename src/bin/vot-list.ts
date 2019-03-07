#!/usr/bin/env node

import chalk from'chalk'
import program from 'commander'
import request from 'request'
import ora from 'ora'
import logger from '../logger'

program
  .option('-r, --repo [url]', 'use a custom online repo, default: "https://api.github.com/users/ura-admin-templates/repos"')
  .parse(process.argv)

/**
 * Get templates reop url
 */
const repo = program.repo || 'https://api.github.com/users/ura-admin-templates/repos'

/**
 * Padding
 */

console.log()
process.on('exit', () => {
  console.log()
})

/**
 * List repos
 */
const spinner = ora('request repos...')
spinner.start()
request({
  url: repo,
  headers: {
    'User-Agent': 'vot-cli'
  }
}, (err: any, res: any, body: any) => {
  spinner.stop()
  if (err) logger.fatal(err)
  const requestBody = JSON.parse(body)
  if (Array.isArray(requestBody)) {
    console.log('   Available online templates:')
    console.log()
    requestBody.forEach(repo => {
      console.log(
        '   ' + chalk.yellow('✧') +
        '   ' + chalk.blue(repo.name) +
        '   ' + repo.description
      )
    })
  } else {
    console.error(requestBody.message)
  }
})
