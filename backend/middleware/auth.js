
import admin from '../config/firebase.js'

export const protect = async (req, res, next) => {
  const sessionCookie = req.cookies.session

  if (!sessionCookie) {
    return res.status(401).json({ message: 'No session' })
  }

  try {
    const decoded = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true)

    req.userId = decoded.uid
    next()
  } catch {
    res.status(401).json({ message: 'Invalid session' })
  }
}

