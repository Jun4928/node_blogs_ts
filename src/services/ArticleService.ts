import prisma from '../prisma'
import { articles_status } from '@prisma/client'
import { Article } from '../utils'

const ARTICLES_DEFAULT_OFFSET = 0
const ARTICLES_DEFAULT_LIMIT = 5

export interface articleSearchInput {
  offset?: number
  limit?: number
  user_id?: string
  title?: string
  body?: string
  comments?: string
}

const findArticles = (query: articleSearchInput) => {
  const { offset, limit, ...fields } = query
  const where = Article.makeQueryOption(fields)

  return prisma.articles.findMany({
    where,
    skip: Number(offset) || ARTICLES_DEFAULT_OFFSET,
    take: Number(limit) || ARTICLES_DEFAULT_LIMIT,
    orderBy: {
      created_at: 'desc',
    },
  })
}

export interface articleUniqueSearchInput {
  id: number
}

const findArticle = (data: articleUniqueSearchInput)  => {
  const [uniqueKey] = Object.keys(data)

  return prisma.articles.findUnique({
    where: { [uniqueKey]: data[uniqueKey] },
    include: {
      users: {
        select: {
          id: true,
          email: true
        }
      },
      comments: {
        where: { deleted_at: null }
      }
    }
  })
}

export interface articleCreateInput {
  user_id: number,
  title: string,
  body: string,
}

const createArticle = (data: articleCreateInput) => {
  return prisma.articles.create({ data })
}

export interface articleUpdateInput {
  id: number,
  title?: string,
  body?: string,
  status?: articles_status
}

const updateArticle = (data: articleUpdateInput) => {
  const { id } = data

  return prisma.articles.update({
    where: { id },
    data: {
      ...data,
      updated_at: new Date()
    }
  })
}

const publishArticle = (id: number) => {
  return prisma.articles.update({
    where: { id },
    data: { status: 'PUBLISHED', updated_at: new Date() }
  })
}

const deleteArticle = (id: number) => {
  return prisma.articles.update({
    where: { id },
    data: { status: 'DELETED', deleted_at: new Date() }
  })
}

export default {
  findArticles,
  findArticle,
  createArticle,
  updateArticle,
  publishArticle,
  deleteArticle
}