import { db } from "../config/firebase.js";
import admin from "firebase-admin"

export const createUser = async (req, res) => {
  try {
    const { uid, name, handle, email } = req.body
    console.log("user", name)

    const docRef = await db.collection("users").doc(uid).set({
      name,
      handle,
      email,
      avatar: null,
      verified: false,
    })

    res.status(201).send({ id: uid, message: "User Created" })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

export const login = async (req, res) => {
  try{
    const {username, password} = req.body

    const docRef = await db.collection("users").doc(username).get

    if(!username.exists)
      return res.status(201).json({message: "Wrong User Name"})
    if(!password.exists)
      return res.status(201).json({message: "Wrong password"})


  }catch(err){
    res.status(500).send({error: err.message})
  }
}

export const getMe = async (req, res) => {
  try {
    const userId = req.userId
    //console.log("USER ID:", req.userId)

    const doc = await db.collection("users").doc(userId).get()

    if (!doc.exists) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({ id: doc.id, ...doc.data() })
  } catch (err) {
    console.log("err ",err)
    res.status(500).send({ error: err.message })
  }
}

export const updateUser = async (req, res) => {
  try {
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    await db.collection("users").doc(userId).update(req.body)

    res.status(200).json({ message: "User updated" })
  } catch (err) {
    console.log("UPDATE USER ERROR:", err)
    res.status(500).json({ error: err.message })
  }
}



export const deleteAccount = async (req, res) => {
  try {
    const userId = req.userId

    // 1. delete auth user
    await admin.auth().deleteUser(userId)

    // 2. delete user document
    await db.collection("users").doc(userId).delete()

    // 3. delete user's tweets
    const tweets = await db.collection("tweets")
      .where("userId", "==", userId)
      .get()

    const batch = db.batch()

    tweets.forEach(doc => {
      batch.delete(doc.ref)
    })

    await batch.commit()

    res.status(200).json({ message: "Account deleted" })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}