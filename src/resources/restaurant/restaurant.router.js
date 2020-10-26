import { Router } from 'express'
import {
  getAll,
  getOne,
  createOne,
  getAllDetailed
} from './restaurant.controllers'

const router = Router()

router.route('/reviews').get(getAllDetailed)

router
  .route('/')
  .get(getAll)
  .post(createOne)

router.route('/:id').get(getOne)

export default router
