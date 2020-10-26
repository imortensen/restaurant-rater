import { Review } from './review.model'

export const getMany = async (req, res) => {
  try {
    const restaurant = req.query.restaurant
    let reviews = {}
    if (!restaurant) {
      reviews = await Review.find()
        .populate('restaurant', 'name')
        .populate('createdBy', 'username')
        .lean()
        .exec()
    } else {
      reviews = await Review.find({ restaurant: restaurant })
        .populate('restaurant', 'name')
        .populate('createdBy', 'username')
        .lean()
        .exec()
    }

    res.status(200).json(reviews)
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const createOne = async (req, res) => {
  console.log('create review controller test')
  const createdBy = req.user._id
  try {
    const review = await Review.create({ ...req.body, createdBy })
    res.status(201).json({ data: review })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const updateOne = async (req, res) => {
  try {
    const updatedreview = await Review.findOneAndUpdate(
      {
        createdBy: req.user._id,
        _id: req.params.id
      },
      req.body,
      { new: true }
    )
      .lean()
      .exec()

    if (!updatedreview) {
      return res.status(400).end()
    }

    res.status(201).json({ data: updatedreview })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

// Get All reviews for Current User
export const getMyreviews = async (req, res) => {
  try {
    const restaurant = req.query.restaurant
    let reviews = {}
    if (!restaurant) {
      reviews = await Review.find({ createdBy: req.user._id })
        .populate('restaurant', 'name')
        .populate('createdBy', 'username')
        .lean()
        .exec()
    } else {
      reviews = await Review.find({
        restaurant: restaurant,
        createdBy: req.user._id
      })
        .populate('restaurant', 'name')
        .populate('createdBy', 'username')
        .lean()
        .exec()
    }

    res.status(200).json(reviews)
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

// Delete review
export const removeOne = async (req, res) => {
  try {
    const removed = await Review.findOneAndRemove({
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

export const reviewControllers = {
  getMany,
  createOne,
  updateOne,
  getMyreviews,
  removeOne
}
