import { User } from './user.model'

export const me = (req, res) => {
  // Todo: Fix so that is doesn't return the hashed password

  res.status(200).json({ data: req.user })
}

export const updateMe = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true
    })
      .select('-password')
      .lean()
      .exec()

    res.status(200).json({ data: user })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}
