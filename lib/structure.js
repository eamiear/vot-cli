const fs = require("fs")
const path = require("path")
const os = require("os")

class Structure {

  get defaultOptions () {
    return {
      root: '.',  // 根目录路径
      output: 'structure.md', // 输出文件
      ignore: '.git,.log,.error,node_modules,dist,.lock', // 忽略文件
      padding: 0, // 字符间距
      paddingTimes: 2,  // 子目录|文件 间距倍数
      symbol: '+---', // 字符标识
      level: 3,  // 显示目录级别
    }
  }

  constructor (options = {}) {
    this.options = Object.assign({}, this.defaultOptions, options)
    this.levelIndex = 0
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
      symbol,
      level
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
        if (this.levelIndex >= level) {
          this.levelIndex = 0
          return
        }
        this.levelIndex += 1
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

module.exports = Structure
