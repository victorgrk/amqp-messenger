import { FileImporter } from './core/file-importer'

export * from './decorators'
export * from './event'
export * from './types'

export const impoter = FileImporter.import
