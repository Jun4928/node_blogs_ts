import { articleSearchInput } from '../services/ArticleService'
import { articles_status } from '@prisma/client'

const DEFAULT_QUERY_OPTION: { deleted_at: null, status: articles_status } = {
  deleted_at: null,
  status: 'PUBLISHED'
}

const getQueryOption = <T>(key: string, value: T): object => {
  const mapper = {
    user_id: { [key]: Number(value) },
    comments: { [key]: { some: { body: { contains: value } } } },
  }

  const matched = mapper[key]
  if (matched) return matched

  return { [key]: { contains: value } }
}

const makeQueryOption = (fields: articleSearchInput) => {
  if (!fields) return DEFAULT_QUERY_OPTION

  const defaultQueryOptions = Object.entries(DEFAULT_QUERY_OPTION).map(([key, value]) => ({ [key]: value }))
  const queryOptins = Object.entries(fields).map(([key, value]) => getQueryOption(key, value))
  const where = { AND: [...defaultQueryOptions, ...queryOptins] }
  return where
}

const validFields = (requested: string[], allowed: string[]) => requested.every((field) => allowed.includes(field))

export default {
  makeQueryOption,
  validFields
}