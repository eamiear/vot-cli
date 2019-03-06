#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')

// turn text to ascii
const figlet = require('figlet');
figlet('vot cli', {
  horizontalLayout: 'full',
}, function(err: any, data: any) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});

program
  .version(require('../package').version)
  .usage('<command> [options]')

program
  .command('init <template-name> <project-name>')
  .description('generate a project from a template')
  .option('-c, --clone', 'use git clone when fetching remote template')
  .option('-o, --offline', 'use cached template')
  .option('-r, --repo [path]', 'use a custom repo, default: "ura-admin-templates/"')
  .action(() => {
    require('./vot-init')
  })

program
  .command('list')
  .description('list available online templates')
  .option('-r, --repo [url]', 'use a custom online repo, default: "https://api.github.com/users/ura-admin-templates/repos"')
  .action(() => {
    require('./vot-list')
  })

// Get system info
program
  .command('info')
  .description('print debugging information about your environment')
  .action(() => {
    require('./vot-info')
  })

// output help information on unknown commands
program
  .arguments('<command>')
  .action((cmd: any) => {
    program.outputHelp()
    console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
    console.log()
  })

// add some useful info on help
program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`vot <command> --help`)} for detailed usage of given command.`)
  console.log()
})

// Parse input arguments
program.parse(process.argv)

// output help message without input arguments
if (!process.argv.slice(2).length) {
  program.outputHelp()
}
