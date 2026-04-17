import express from 'express'
import { createSession, deleteSession } from '../controllers/auth.controller.js'

const authRoutes = express.Router()

authRoutes.post('/session',  createSession)   // login  → create cookie
authRoutes.delete('/session', deleteSession)  // logout → clear cookie

export default authRoutes