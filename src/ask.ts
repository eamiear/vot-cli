import async = require('async')
const inquirer = require('inquirer')
const evalute = require('./eval')

const promptMapping: any = {
  string: 'input',
  boolean: 'confirm'
}

module.exports = function ask (prompts: any, data: any, done: () => {}) {
  async.eachSeries(Object.keys(prompts), (key: string, next) => {
    prompts(data, key, prompts[key], next)
  }, done)
}

/**
 *
 * @param {Object} data metalsmith.metadata()
 * @param {String} key
 * @param {Object} prompt vot.meta.json
 * @param {Function} done
 */
function prompts (data: any, key: string, prompt: any, done: () => {}) {
  // skip prompts whose when condition is not met
  if (prompt.when && !evalute(prompt.when, data)) {
    return done()
  }

  // get inquirer question default value
  let promptDefault = prompt.default
  if (typeof prompt.default === 'function') {
    promptDefault = function () {
      return prompt.default.bind()(data)
    }
  }

  inquirer.prompt([{
    type: promptMapping[prompt.type] || prompt.type,
    name: key,
    message: prompt.message || prompt.label || key,
    default: promptDefault,
    choices: prompt.choices || [],
    validate: prompt.validate || (() => true)
  }]).then((answers: any) => {
    if (Array.isArray(answers[key])) {
      data[key] = {}
      answers[key].forEach((multiChoiceAnswer: any) => {
        data[key][multiChoiceAnswer] = true
      })
    } else if (typeof answers[key] === 'string') {
      data[key] = answers[key].replace(/"/g, '\\"')
    } else {
      data[key] = answers[key]
    }
    done()
  }).catch(done)

}
