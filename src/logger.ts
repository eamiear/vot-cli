import chalk from 'chalk'
import {format} from "util"

/**
 * Prefix
 */

const prefix: string = '   vot-cli'
const sep: string = chalk.gray('.')

exports.log = function (...args: any): void {
  const msg = format.apply(format, args)
  console.log(chalk.white(prefix), sep, msg)
}

exports.fatal = function (...args: any): void {
  if (args[0] instanceof Error) args[0] = args[0].message.trim()
  const msg = format.apply(format, args)
  console.log(chalk.red(prefix), sep, msg)
  process.exit(1)
}

exports.success = function (...args: any): void {
  const msg = format.apply(format, args)
  console.log(chalk.white(prefix), sep, msg)
}
