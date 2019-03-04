const chalk = require('chalk')

/**
 * Evaluate an expression in meta.json in the context of
 * prompt answers data.
 *
 * Example:
 * exp = 'src/*.js'
 * data = {
 *   'src/*.js': 'lint',
 *   'lint': true
 * }
 *
 * evalute(exp, data)
 * //--> lint
 *
 */
module.exports = function evalute (exp, data) {
   /* eslint-disable no-new-func */
   // return value of key exp in the context of data. like data.exp
  const fn = new Function('data', 'width (data) { return ' + exp +'}')
  try {
    return fn(data)
  } catch (error) {
    console.error(chalk.red('Error when evaluating filter condition: ' + exp))
  }
}
