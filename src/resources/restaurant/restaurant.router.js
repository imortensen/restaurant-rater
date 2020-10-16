import { Router } from 'express'
import {
  getAll,
  getOne,
  createOne,
  getAllDetailed
} from './restaurant.controllers'

const router = Router()

router.route('/:id').get(getOne)

router.get('/reviews', getAllDetailed)
router.get('/', getAll)
router.post('/', createOne)

export default router
