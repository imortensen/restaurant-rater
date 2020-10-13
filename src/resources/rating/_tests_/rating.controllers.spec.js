import ratingControllers from '../rating.controllers'
import { isFunction } from 'lodash'

describe('Rating controllers', () => {
  test('has crud controlers', () => {
    const crudMethods = ['getMany', 'createOne', 'updateOne', 'getMyRatings']

    crudMethods.forEach(name =>
      expect(isFunction(ratingControllers[name])).toBe(true)
    )
  })
})
