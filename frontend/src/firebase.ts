import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDhsTCXBOS2SmBZhOMFRZgedwZXSd20fv0",
  authDomain: "omnilink-557e1.firebaseapp.com",
  projectId: "omnilink-557e1",
  storageBucket: "omnilink-557e1.firebasestorage.app",
  messagingSenderId: "1097129067483",
  appId: "1:1097129067483:web:d222bd833a7eb72b0a9dfe"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)