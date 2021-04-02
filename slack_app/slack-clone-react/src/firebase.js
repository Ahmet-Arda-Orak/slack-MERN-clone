import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyAwuhF2pAqLmQAVnCf8OyOQphTrNHubo8k",
  authDomain: "slack-clone-live-f5e6e.firebaseapp.com",
  projectId: "slack-clone-live-f5e6e",
  storageBucket: "slack-clone-live-f5e6e.appspot.com",
  messagingSenderId: "704421088430",
  appId: "1:704421088430:web:b6b2b00cf4c06ed2f2713f"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)

const db = firebaseApp.firestore()
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export { auth, provider }
export default db