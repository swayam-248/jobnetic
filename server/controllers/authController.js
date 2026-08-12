const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const supabase = require('../config/supabase.js') // Added Supabase client import

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  onboarding_complete: user.onboarding_complete,
})

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })
    const token = signToken(user._id)

    res.status(201).json({
      token,
      user: formatUser(user),
    })
  } catch (error) {
    next(error)
  }
}

// Updated login function to fetch user profile from Supabase and include onboarding_complete in the response
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Find user in MongoDB
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Fetch profile from Supabase to get onboarding_complete
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('onboarding_complete')
      .eq('user_id', user._id.toString())
      .single()

    console.log('=== LOGIN DEBUG ===')
    console.log('MongoDB user._id:', user._id.toString())
    console.log('Supabase profile data:', profile)
    console.log('Supabase profile error:', profileError)
    console.log('onboarding_complete value:', profile?.onboarding_complete)
    console.log('==================')

    // Generate token
    const token = signToken(user._id)

    // Return token + user + onboarding status
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        onboarding_complete: profile?.onboarding_complete ?? false,
      },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getMe = async (req, res) => {
  res.json({ user: req.user })
}

module.exports = {
  register,
  login,
  getMe,
}

