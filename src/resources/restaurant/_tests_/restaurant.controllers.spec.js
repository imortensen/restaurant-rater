import { restaurantControllers } from '../restaurant.controllers'
import { isFunction } from 'lodash'

describe('restaurant controllers', () => {
  test('has crud controllers', () => {
    const crudMethods = ['getAll', 'createOne', 'getAllDetailed', 'getOne']

    crudMethods.forEach(name =>
      expect(isFunction(restaurantControllers[name])).toBe(true)
    )
  })
})
