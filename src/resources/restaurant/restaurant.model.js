import mongoose from 'mongoose'

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  place_id: {
    type: String,
    unique: true
  },
  vicinity: String
})

export const Restaurant = mongoose.model('restaurant', restaurantSchema)
