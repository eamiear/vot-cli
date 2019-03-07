import metalsmith = require("metalsmith");

type Prompts = {
  [key: string]: PromptsItem
}

interface PromptsItem {
  type: string,
  required?: boolean,
  message?: string,
  default?: string,
  choices?: any[]
}
export interface MetaOptions {
  metalsmith?: any,
  helpers?: any,
  prompts?: Prompts,
  filters?: any,
  skipInterpolation?: any,
  completeMessage?: any,
  complete?: any
}
// export namespace MetaOptions {
//   let metalsmith: any
//   let helpers: any
//   let prompts: Prompts
//   let complete: any
// }
