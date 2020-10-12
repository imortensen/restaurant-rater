import mongoose from 'mongoose'

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  }
})

export const Restaurant = mongoose.model('restaurant', restaurantSchema)
