import { Router } from 'express'
import {
  getAll,
  createOne,
  updateOne,
  getMyRatings
} from './rating.controllers'

const router = Router()

router.route('/myRatings').get(getMyRatings)

router
  .route('/')
  .get(getAll)
  .post(createOne)

router.route('/:id').put(updateOne)

export default router
