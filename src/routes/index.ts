import { Router } from 'express'
import UserRouter from './UserRouter'
import ArticleRouter from './ArticleRouter'

const router = Router()

router.use('/users', UserRouter)
router.use('/articles', ArticleRouter)

export default router


