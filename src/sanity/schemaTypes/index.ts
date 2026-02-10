import { type SchemaTypeDefinition } from 'sanity'
import { landingType } from './landing'
import { siteConfigType } from './siteConfig'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [landingType, siteConfigType],
}
