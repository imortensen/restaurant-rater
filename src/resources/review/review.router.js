import { Router } from 'express'
import { reviewControllers } from './review.controllers'

const router = Router()

router.route('/myreviews').get(reviewControllers.getMyreviews)

router
  .route('/')
  .get(reviewControllers.getMany)
  .post(reviewControllers.createOne)

router
  .route('/:id')
  .put(reviewControllers.updateOne)
  .delete(reviewControllers.removeOne)

export default router
