#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')

// turn text to ascii
const figlet = require('figlet');
figlet('vot cli', {
  horizontalLayout: 'full',
}, function(err, data) {
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

  // Get project structure
program
  .command('structure')
  .description('create project structure')
  .option('-r, --root', 'directory')
  .option('-o, --output', 'output file destination')
  .option('-p, --padding', 'padding')
  .option('-t, --padding-times', 'padding times')
  .option('-s, --symbol', 'char symbol')
  .option('-l, --level', 'level or directory to show')
  .option('-i, --ignore', 'ignore files to list')
  .action(() => {
    require('./vot-structure')
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
  console.log(`  Run ${chalk.cyan(`vot <command> --help`)} for detailed usage of given command.`)
  console.log()
})

// Parse input arguments
program.parse(process.argv)

// output help message without input arguments
if (!process.argv.slice(2).length) {
  program.outputHelp()
}
