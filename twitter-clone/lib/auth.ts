import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from './firebase'
import newRequest from '@/utils/newRequests'

// create session on backend
async function createSession(user:any) {
  const token = await user.getIdToken()
  await newRequest.post("/auth/session", {
    token,
  })
}

export async function register(email:string, password: string) {
  try{
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await createSession(result.user)   // ← create cookie
    return result.user
  }catch(error: any){
        if (error.code === 'auth/email-already-in-use') {
          throw new Error('Account already exists. Please log in.')
        }
    
        if (error.code === 'auth/invalid-email') {
          throw new Error('Invalid email address.')
        }
    
        if (error.code === 'auth/weak-password') {
          throw new Error('Password must be at least 6 characters.')
        }
    
        throw new Error('Something went wrong. Try again.')
      }
}

export async function login(email:string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password)
  await createSession(result.user)   // ← create cookie
  return result.user
}

export async function logout() {
  await signOut(auth)
  // tell backend to clear the cookie
  await newRequest.delete('/auth/session')
}

export const deleteAccount = async () => {
  const res = await newRequest.delete("/user")
  return res.data
}