import { Router } from 'express'
import { ratingControllers } from './rating.controllers'

const router = Router()

router.route('/myRatings').get(ratingControllers.getMyRatings)

router
  .route('/')
  .get(ratingControllers.getMany)
  .post(ratingControllers.createOne)

router.route('/:id').put(ratingControllers.updateOne)

export default router
