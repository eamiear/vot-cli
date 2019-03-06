import path from 'path'

module.exports = {
  isLocalPath (templatePath: string): boolean {
    // ./ or file: etc
    return /^[./]|(^[a-zA-Z]:)/.test(templatePath)
  },

  getTemplatePath (templatePath: string): string {
    return path.isAbsolute(templatePath)
      ? templatePath
      : path.normalize(path.join(process.cwd(), templatePath))
  }
}
