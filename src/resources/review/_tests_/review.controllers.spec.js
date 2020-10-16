import reviewControllers, { removeOne } from '../review.controllers'
import { isFunction } from 'lodash'
import mongoose from 'mongoose'
import { Review } from '../review.model'

describe('review controllers', () => {
  test('has crud controlers', () => {
    const crudMethods = [
      'getMany',
      'createOne',
      'updateOne',
      'getMyreviews',
      'removeOne'
    ]

    crudMethods.forEach(name =>
      expect(isFunction(reviewControllers[name])).toBe(true)
    )
  })
})

describe('Remove One', () => {
  test('remove a review', async () => {
    expect.assertions(2)
    const user = mongoose.Types.ObjectId()
    const restaurant = mongoose.Types.ObjectId()
    const review = await Review.create({
      restaurant: restaurant,
      stars: 3,
      comment: 'not bad',
      createdBy: user
    })

    const req = {
      params: { id: review._id },
      user: { _id: user }
    }

    const res = {
      status(status) {
        expect(status).toBe(200)
        return this
      },
      json(results) {
        expect(`${results.data._id}`).toBe(`${review._id}`)
      }
    }

    await removeOne(req, res)
  })
})
