import express from 'express'
import multer from 'multer'
import cloudinary from '../config/cloudinary.js'
import fs from 'fs'

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'tweets',
    })

    fs.unlinkSync(req.file.path)

    res.json({ url: result.secure_url })
  } catch (err) {
    console.error('UPLOAD ERROR:', err)
    res.status(500).json({ error: err.message })
  }
})

export default router