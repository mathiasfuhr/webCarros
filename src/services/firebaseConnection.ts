
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA64nq0D8f5i6pnBigtdA2bj0_qeUq1rN4",
  authDomain: "webcarros-fc866.firebaseapp.com",
  projectId: "webcarros-fc866",
  storageBucket: "webcarros-fc866.appspot.com",
  messagingSenderId: "189490070747",
  appId: "1:189490070747:web:c9e721ed513d3f87b1b8fe"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {db, auth, storage};
