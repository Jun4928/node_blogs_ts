import { ArticleService } from '../services'
import { errorWrapper, errorGenerator } from '../errors'
import { Request, Response } from 'express'
import { articleCreateInput } from '../services/ArticleService'
import { Article } from '../utils'

const getArticles = errorWrapper(async (req: Request, res: Response) => {
  const articles = await ArticleService.findArticles(req.query)
  res.status(200).json({ articles })
})

const getArticle = errorWrapper(async (req: Request, res: Response) => {
  const { article_id } = req.params
  const article = await ArticleService.findArticle({ id: Number(article_id) })

  if (article.deleted_at) return res.status(200).json({ message: 'deleted' })

  res.status(200).json({ article })
})

const postArticle = errorWrapper(async (req: Request, res: Response) => {
  const { id: user_id } = req.foundUser
  const { title, body }: articleCreateInput = req.body

  if (!title || !body) errorGenerator({ statusCode: 400 })

  const createdArticle = await ArticleService.createArticle({
    user_id,
    title,
    body
  })

  res.status(201).json({ createdArticle })
})

const updateArticle = errorWrapper(async (req: Request, res: Response) => {
  const { id: userIdFromToken } = req.foundUser
  const { article_id } = req.params

  const isValidFields = Article.validFields(Object.keys(req.body), ['title', 'body', 'status'])
  if (!isValidFields) errorGenerator({ statusCode: 400 })

  const foundArticle = await ArticleService.findArticle({ id: Number(article_id) })
  const { user_id: userIdFromArticle } = foundArticle

  if (userIdFromToken !== userIdFromArticle) errorGenerator({ statusCode: 403 })

  const updatedArticle = await ArticleService.updateArticle({ id: Number(article_id), ...req.body })

  res.status(201).json({ updatedArticle })
})

const publishArticle = errorWrapper(async (req: Request, res: Response) => {
  const { id: userIdFromToken } = req.foundUser
  const { article_id } = req.params

  const foundArticle = await ArticleService.findArticle({ id: Number(article_id) })
  const { user_id: userIdFromArticle } = foundArticle

  if (userIdFromToken !== userIdFromArticle) errorGenerator({ statusCode: 403 })

  const publishedArticle = await ArticleService.publishArticle(Number(article_id))

  res.status(201).json({ publishedArticle })
})

const deleteArticle = errorWrapper(async (req: Request, res: Response) => {
  const { id: userIdFromToken } = req.foundUser
  const { article_id } = req.params

  const foundArticle = await ArticleService.findArticle({ id: Number(article_id) })
  const { user_id: userIdFromArticle } = foundArticle

  if (userIdFromToken !== userIdFromArticle) errorGenerator({ statusCode: 403 })

  const deletedArticle = await ArticleService.deleteArticle(Number(article_id))

  res.status(201).json({ deletedArticle })
})

export default {
  getArticles,
  getArticle,
  postArticle,
  updateArticle,
  publishArticle,
  deleteArticle,
}