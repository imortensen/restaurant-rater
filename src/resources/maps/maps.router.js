import { Router } from 'express'
import { getElevation, getRestaurants } from './maps.controllers'

const router = Router()

router.route('/elevation').get(getElevation)
router.route('/restaurants').get(getRestaurants)

export default router
