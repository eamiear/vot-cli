const chalk = require('chalk')
const format = require('util').format

/**
 * Prefix
 */

const prefix = '   ura-cli'
const sep = chalk.gray('.')

exports.log = function (...args) {
  const msg = format.apply(format, args)
  console.log(chalk.white(prefix), sep, msg)
}

exports.fatal = function (...args) {
  if (args[0] instanceof Error) args[0] = args[0].message.trim()
  const msg = format.apply(format, args)
  console.log(chalk.red(prefix), sep, msg)
  process.exit(1)
}

exports.success = function (...args) {
  const msg = format.apply(format, args)
  console.log(chalk.white(prefix), sep, msg)
}
