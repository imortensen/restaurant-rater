import { User } from '../user.model'

describe('User model', () => {
  describe('schema', () => {
    test('authMethod', () => {
      const authMethod = User.schema.obj.authMethod
      expect(authMethod).toEqual({
        type: String,
        enum: ['local', 'google'],
        required: true
      })
    })

    test('username', () => {
      const username = User.schema.obj.local.username
      expect(username).toEqual({
        type: String,
        unique: true,
        trim: true,
        minlength: 5
      })
    })

    test('email', () => {
      const email = User.schema.obj.local.email
      expect(email).toEqual({
        type: String,
        unique: true,
        trim: true
      })
    })

    test('password', () => {
      const password = User.schema.obj.local.password
      expect(password).toEqual({
        type: String,
        minlength: 5
      })
    })

    test('google_id', () => {
      const id = User.schema.obj.google.id
      expect(id).toEqual(String)
    })

    test('google_name', () => {
      const name = User.schema.obj.google.name
      expect(name).toEqual(String)
    })
  })
})
