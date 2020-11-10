import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Todo: enforce uniqueness
const userSchema = new mongoose.Schema(
  {
    authMethod: {
      type: String,
      enum: ['local', 'google'],
      required: true
    },
    local: {
      username: {
        type: String,
        unique: true,
        trim: true,
        minlength: 5
      },
      email: {
        type: String,
        unique: true,
        trim: true
      },
      password: {
        type: String,
        minlength: 5
      }
    },
    google: {
      id: String,
      name: String
    }
  },
  { timestamps: true }
)

userSchema.pre('save', function(next) {
  if (this.authMethod !== 'local') {
    next()
  }

  if (!this.isModified('local.password')) {
    return next()
  }

  bcrypt.hash(this.local.password, 8, (err, hash) => {
    if (err) {
      return next(err)
    }
    this.local.password = hash
    next()
  })
})

userSchema.methods.checkPassword = function(password) {
  const passwordHash = this.local.password
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err)
      }
      resolve(same)
    })
  })
}

export const User = mongoose.model('user', userSchema)
