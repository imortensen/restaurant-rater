import { Review } from '../review/review.model'
import { Restaurant } from './restaurant.model'
import mongoose from 'mongoose'

export const getAll = async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .lean()
      .exec()

    // res.status(200).json({ data: restaurants })
    res.status(200).json(restaurants)
    // res.status(200).json(restaurants)
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

// Get Count of reviews and Average Star for Restaurants
export const getAllDetailed = async (req, res) => {
  try {
    let restaurants = await Review.aggregate([
      {
        $group: {
          _id: { restaurant: '$restaurant' },
          stars: { $avg: '$stars' },
          reviews: { $sum: 1 }
        }
      }
    ])

    await Restaurant.populate(restaurants, {
      path: '_id.restaurant',
      model: Restaurant
    })
    // would like to take out the _id wrapper but can't figure out how to get it working
    // restaurants._id = restaurants._id.map(s => Object.values(s)[0])

    res.status(200).json({ data: restaurants })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

// Get Count of reviews and Average Star for a Restaurant
export const getOne = async (req, res) => {
  try {
    const restaurant = mongoose.Types.ObjectId(req.params.id)
    let restaurants = await Review.aggregate([
      {
        $match: { restaurant: restaurant }
      },
      {
        $group: {
          _id: { restaurant: '$restaurant' },
          stars: { $avg: '$stars' },
          reviews: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          stars: 1,
          reviews: 1
        }
      }
    ])

    // await Restaurant.populate(restaurants, {
    //   path: '_id.restaurant',
    //   model: Restaurant
    // })
    // would like to take out the _id wrapper but can't figure out how to get it working
    // restaurants._id = restaurants._id.map(s => Object.values(s)[0])

    res.status(200).json(restaurants)
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
