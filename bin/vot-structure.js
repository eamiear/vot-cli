#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const os = require("os")

class Structure {

  get defaultOptions () {
    return {
      root: '.',
      output: 'structure.md',
      ignore: '.git,.log,.error,node_modules',
      padding: 0,
      paddingTimes: 2,
      symbol: '+----',
      level: 3
    }
  }

  constructor (options = {}) {
    this.options = Object.assign({}, this.defaultOptions, options)
    this.create(this.options)
    return this
  }
  setOptions (options) {
    this.options = Object.assign(this.options, options)
  }
  create (options) {
    const {
      root,
      output,
      ignore,
      padding = 0,
    } = options

    const rootPath = path.resolve(root)
    const outputPath = path.resolve(output)
    const treeArray = []
    let ignorePattern = ignore.constructor === Array ? ignore.join('|').trim() : ignore.split(',').join('|').trim()
    ignorePattern = new RegExp(`${ignorePattern}`)
    this.setOptions({ignorePattern})
    this._createStructure(rootPath, outputPath, treeArray, padding)
    fs.writeFileSync(outputPath, treeArray.join(''), 'utf8')
  }
  _createStructure (filePath, outputPath, treeArray, padding) {
    const {
      paddingTimes,
      ignorePattern,
      symbol
    } = this.options

    const dirs = fs.readdirSync(filePath)
    dirs.forEach(file => {
      let targetFilePath = `${filePath}/${file}`
      let stats = fs.statSync(targetFilePath)
      let matched = file.trim().match(ignorePattern)
      if (matched && matched[0]) return

      if (stats.isFile()) {
        treeArray.push(`|${this._usePadding(padding)}${file}${os.EOL}`)
      } else if (stats.isDirectory()) {
        treeArray.push(`|${os.EOL}`)
        treeArray.push(`|${this._usePadding(padding)}${symbol}${file}${os.EOL}`)
        this._createStructure(targetFilePath, outputPath, treeArray, !padding ? 2 : padding * paddingTimes)
      }
    })
  }
  _usePadding (index) {
    let space = '', i = 0
    for(; i < index; i++) {
      space += ' '
    }
    return space
  }
}
new Structure()
