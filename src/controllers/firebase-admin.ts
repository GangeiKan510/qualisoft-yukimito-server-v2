import admin from 'firebase-admin';

if (admin.apps.length === 0) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log('Firebase Admin SDK initialized successfully.');
  } else {
    console.error('Firebase service account credentials are missing.');
    throw new Error('Failed to initialize Firebase Admin SDK.');
  }
}

export default admin;
