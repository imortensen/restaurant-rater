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
  })
})
