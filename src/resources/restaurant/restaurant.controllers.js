import { Review } from '../review/review.model'
import { Restaurant } from './restaurant.model'
import mongoose from 'mongoose'
import { _ } from 'lodash'

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
      },
      {
        $project: {
          stars: 1,
          reviews: 1
        }
      }
    ])

    await Restaurant.populate(restaurants, {
      path: '_id.restaurant',
      model: Restaurant
    })

    let allRestaurantsNew = []
    let allRestaurants = await Restaurant.find()
    allRestaurants.forEach(r => {
      let restaurantNew = {
        _id: r._id,
        name: r.name,
        stars: null,
        reviews: null
      }
      allRestaurantsNew.push(restaurantNew)
    })

    let restaurantsNew = []

    restaurants.forEach(r => {
      let restaurantNew = {
        _id: r._id.restaurant._id,
        name: r._id.restaurant.name,
        stars: r.stars.toFixed(1),
        reviews: r.reviews
      }
      restaurantsNew.push(restaurantNew)
    })

    restaurantsNew = _.map(allRestaurantsNew, function(item) {
      return _.merge(item, _.find(restaurantsNew, { _id: item._id }))
    })

    res.status(200).json(restaurantsNew)
    // }
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

// Get Count of reviews and Average Star for a Restaurant
export const getOne = async (req, res) => {
  console.log('get restaurant by id')
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
          // _id: 0,
          stars: 1,
          reviews: 1
        }
      }
    ])
    if (restaurants.length < 1) {
      let restaurantNoReviews = await Restaurant.findById(req.params.id)
      res.status(200).json(restaurantNoReviews)
    } else {
      await Restaurant.populate(restaurants, {
        path: '_id.restaurant',
        model: Restaurant
      })

      const restaurantNew = {
        _id: restaurants[0]._id.restaurant._id,
        name: restaurants[0]._id.restaurant.name,
        stars: restaurants[0].stars.toFixed(1),
        reviews: restaurants[0].reviews
      }

      res.status(200).json(restaurantNew)
    }
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
