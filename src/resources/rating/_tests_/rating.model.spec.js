import { Rating } from '../rating.model'
import mongoose from 'mongoose'

describe('Rating model', () => {
  describe('schema', () => {
    test('comment', () => {
      const comment = Rating.schema.obj.comment
      expect(comment).toEqual(String)
    })

    test('createdBy', () => {
      const createdBy = Rating.schema.obj.createdBy
      expect(createdBy).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: true
      })
    })

    test('restaurant', () => {
      const restaurant = Rating.schema.obj.restaurant
      expect(restaurant).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'restaurant',
        required: true
      })
    })

    test('stars', () => {
      const stars = Rating.schema.obj.stars
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
