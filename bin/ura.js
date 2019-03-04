#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')

program
  .version(require('../package').version)
  .usage('<command> [options]')

program
  .command('init <template-name> <project-name>')
  .description('generate a project from a template')
  .option('-c, --clone', 'use git clone when fetching remote template')
  .option('--offline', 'use cached template')
  .option('--repo', 'use a custom repo, default: "ura-admin-templates/"')
  .action(() => {
    require('./ura-init')
  })

program
  .command('list')
  .description('list available online templates')
  .option('--repo', 'use a custom online repo, default: "https://api.github.com/users/ura-admin-templates/repos"')
  .action(() => {
    require('./ura-list')
  })

// Get system info
program
  .command('info')
  .description('print debugging information about your environment')
  .action(() => {
    require('./ura-info')
  })

// output help information on unknown commands
program
  .arguments('<command>')
  .action((cmd) => {
    program.outputHelp()
    console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
    console.log()
  })

// add some useful info on help
program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`ura <command> --help`)} for detailed usage of given command.`)
  console.log()
})

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
