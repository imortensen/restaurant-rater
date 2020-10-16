import { Review } from '../review.model'
import mongoose from 'mongoose'

describe('review model', () => {
  describe('schema', () => {
    test('comment', () => {
      const comment = Review.schema.obj.comment
      expect(comment).toEqual(String)
    })

    test('createdBy', () => {
      const createdBy = Review.schema.obj.createdBy
      expect(createdBy).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: true
      })
    })

    test('restaurant', () => {
      const restaurant = Review.schema.obj.restaurant
      expect(restaurant).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'restaurant',
        required: true
      })
    })

    test('stars', () => {
      const stars = Review.schema.obj.stars
      expect(stars).toEqual({
        type: Number,
        min: 1,
        max: 5,
        required: true,
        validate: {
          validator: Number.isInteger,
          message: '{VALUE} is not an integer value'
        }
      })
    })
  })
})
