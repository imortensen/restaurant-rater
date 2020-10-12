import mongoose from 'mongoose'

const ratingSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'restaurant',
      required: true
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true
    },
    comment: String,
    stars: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value'
      }
    }
  },
  { timestamps: true }
)

ratingSchema.index({ user: 1, restaurant: 1 }, { unique: true })

export const Rating = mongoose.model('rating', ratingSchema)
