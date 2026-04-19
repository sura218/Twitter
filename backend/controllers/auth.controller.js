import admin from '../config/firebase.js'

export const createSession = async (req, res) => {
  const { token } = req.body
  try {
    const expiresIn = 7 * 24 * 60 * 60 * 1000  // 7 days
    const sessionCookie = await admin.auth().createSessionCookie(token, { expiresIn })
    const isProd = process.env.NODE_ENV === 'production'

    res.cookie('session', sessionCookie, {
      httpOnly: true,
      sameSite:'none',
      secure: true,
      maxAge:   expiresIn,
    })
    res.json({ success: true })
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

export const deleteSession = async (req, res) => {
  res.clearCookie('session', {
    httpOnly: true,
    secure: true,
    sameSite: 'none' ,
  })

  res.json({ success: true })
}