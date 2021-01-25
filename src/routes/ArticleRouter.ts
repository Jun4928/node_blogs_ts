import { Router } from 'express' 
import { ArticleController } from '../controllers'
import { validateToken } from '../middlewares'

const router = Router()

router.get('/', ArticleController.getArticles)
router.get('/:article_id', ArticleController.getArticle)
router.post('/', validateToken, ArticleController.postArticle)
router.put('/:article_id', validateToken, ArticleController.updateArticle)
router.put('/publish/:article_id', validateToken, ArticleController.publishArticle)
router.delete('/:article_id', validateToken, ArticleController.deleteArticle)

export default router