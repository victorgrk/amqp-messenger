import { readdirSync, statSync } from 'fs'
import globParent from 'glob-parent'
import { resolve } from 'path'

export class FileImporter {
  static async import(path: string) {
    const current = resolve(globParent(path))
    const files = await this.treeResolver(current)
    if (!files) {
      throw 'No files found'
    }
    await Promise.all(files.map((e) => import(e)))
  }

  static async treeResolver(path: string) {
    const files = readdirSync(path)
    const result: string[] = []
    for (const file of files.filter(
      (e) =>
        !e.includes('node_modules')
        && (e.endsWith('js') || e.endsWith('ts') || e.endsWith('cjs') || e.endsWith('mjs'))
    )) {
      const filePath = resolve(path, file)
      const isDirectory = statSync(filePath).isDirectory()
      if (isDirectory) {
        const child = await this.treeResolver(filePath)
        result.push(...(child || []))
      } else {
        result.push(filePath)
      }
    }
    return result
  }
}
