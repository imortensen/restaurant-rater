import { isFunction } from 'lodash'
import { me, updateMe } from '../user.controllers'

var controllers = { me, updateMe }

describe('User Controller', () => {
  test('has controllers', () => {
    const crudMethods = ['me', 'updateMe']

    crudMethods.forEach(name =>
      expect(isFunction(controllers[name])).toBe(true)
    )
  })
})
