import { User } from '../user.model'

describe('User model', () => {
  describe('schema', () => {
    test('username', () => {
      const username = User.schema.obj.username
      expect(username).toEqual({
        type: String,
        unique: true,
        trim: true,
        minlength: 5,
        required: true
      })
    })

    test('email', () => {
      const email = User.schema.obj.email
      expect(email).toEqual({
        type: String,
        unique: true,
        trim: true,
        required: true
      })
    })

    test('password', () => {
      const password = User.schema.obj.password
      expect(password).toEqual({
        type: String,
        minlength: 5,
        required: true
      })
    })
  })
})
