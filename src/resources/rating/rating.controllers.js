import { Rating } from './rating.model'

export const getMany = async (req, res) => {
  try {
    const restaurant = req.query.restaurant
    console.log('restaurant: ' + restaurant)
    let ratings = {}
    if (!restaurant) {
      ratings = await Rating.find()
        .populate('restaurant', 'name')
        .populate('createdBy', 'username')
        .lean()
        .exec()
    } else {
      ratings = await Rating.find({ restaurant: restaurant })
        .populate('restaurant', 'name')
        .populate('createdBy', 'username')
        .lean()
        .exec()
    }

    res.status(200).json({ data: ratings })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const createOne = async (req, res) => {
  console.log('create rating controller test')
  const createdBy = req.user._id
  try {
    const rating = await Rating.create({ ...req.body, createdBy })
    res.status(201).json({ data: rating })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const updateOne = async (req, res) => {
  try {
    const updatedRating = await Rating.findOneAndUpdate(
      {
        createdBy: req.user._id,
        _id: req.params.id
      },
      req.body,
      { new: true }
    )
      .lean()
      .exec()

    if (!updatedRating) {
      return res.status(400).end()
    }

    res.status(201).json({ data: updatedRating })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

// Get All Ratings for Current User
export const getMyRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ createdBy: req.user._id })
      .populate('restaurant', 'name')
      .populate('createdBy', 'username')
      .lean()
      .exec()

    res.status(200).json({ data: ratings })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

// Delete Rating
export const removeOne = async (req, res) => {
  try {
    const removed = await Rating.findOneAndRemove({
      createdBy: req.user._id,
      _id: req.params.id
    })

    if (!removed) {
      return res.status(400).end()
    }

    res.status(200).json({ data: removed })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

// Would like to export a functions of functions to simplify the controller input,
// but for some reason it isn't working

export const ratingControllers = {
  getMany,
  createOne,
  updateOne,
  getMyRatings,
  removeOne
}
