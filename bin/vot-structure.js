#!/usr/bin/env node

const program = require('commander')
const Structure = require('../lib/structure')

program
  .option('-r, --root [cwd]', 'directory')
  .option('-o, --output [filePath]', 'output file destination')
  .option('-p, --padding [number]', 'padding')
  .option('-t, --padding-times [number]', 'padding times')
  .option('-s, --symbol [symbol string]', 'char symbol')
  .option('-l, --level [level number]', 'level or directory to show')
  .option('-i, --ignore [ignore list]', 'ignore files to list')
  .parse(process.argv)

/**
 * Help
 */
// program.on('--help', () => {
//   console.log('  Example:')
//   console.log()
//   console.log(chalk.gray('   # structure a new project with an official template'))
//   console.log('     $ structure -r . -o "struct.md" -p 1 -t 2 -s "+---" -l 2')
//   console.log()
// })
/**
 * Get templates reop url
 */
const root = program.root
const output = program.output
const padding = program.padding
const paddingTimes = program.paddingTimes
const symbol = program.symbol
const level = program.level
const ignore = program.ignore

/**
 * Padding
 */

console.log()
process.on('exit', () => {
  console.log()
})

new Structure({
  root: root || '.',  // 根目录路径
  output: output || 'structure.md', // 输出文件
  ignore: ignore || '.git,.log,.error,node_modules,dist', // 忽略文件
  padding: +padding || 0, // 字符间距
  paddingTimes: +paddingTimes || 2,  // 子目录|文件 间距倍数
  symbol: symbol || '+---', // 字符标识
  level: +level || 2,  // 显示目录级别
})
