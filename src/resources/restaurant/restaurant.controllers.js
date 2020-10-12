import { Restaurant } from './restaurant.model'

export const getAll = async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .lean()
      .exec()

    res.status(200).json({ data: restaurants })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const createOne = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body)
    res.status(201).json({ data: restaurant })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const restaurantControllers = { getAll, createOne }
