import { Router } from 'express'
import { getAll, createOne } from './restaurant.controllers'

const router = Router()

router.get('/', getAll)
router.post('/', createOne)

export default router
