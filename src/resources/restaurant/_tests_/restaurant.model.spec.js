import { Restaurant } from '../restaurant.model'

describe('Restaurant model', () => {
  describe('schema', () => {
    test('name', () => {
      const name = Restaurant.schema.obj.name
      expect(name).toEqual({
        type: String,
        unique: true,
        required: true
      })
    })

    test('place_id', () => {
      const placeId = Restaurant.schema.obj.place_id
      expect(placeId).toEqual({
        type: String,
        unique: true
      })
    })

    test('vicinity', () => {
      const vicinity = Restaurant.schema.obj.vicinity
      expect(vicinity).toEqual(String)
    })
  })
})
