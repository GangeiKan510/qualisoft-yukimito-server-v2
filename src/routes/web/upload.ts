import express, { Router } from 'express';
import { initializeApp } from 'firebase/app';
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from 'firebase/storage';
import multer from 'multer';
import firebaseConfig from '../../config/firebase.config';

const router: Router = express.Router();

// Initialize a Firebase application
initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

// Configure multer to use memory storage
const upload = multer({ storage: multer.memoryStorage() });

// POST route to handle file uploads
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const dateTime = giveCurrentDateTime();
    const storageRef = ref(
      storage,
      `files/${req.file.originalname}_${dateTime}`
    );

    // Create file metadata including the content type
    const metadata = {
      contentType: req.file.mimetype,
    };

    // Upload the file to Firebase Storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );

    // Get the file's public URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log('File successfully uploaded.');
    return res.send({
      message: 'File uploaded to Firebase Storage',
      name: req.file.originalname,
      type: req.file.mimetype,
      downloadURL: downloadURL,
    });
  } catch (error: any) {
    console.error('Error during file upload:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const time =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  return date + ' ' + time;
};

export default router;
