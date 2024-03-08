import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDJoNjQP328QMNTNREXs4O2H5XGcF-Ln7M",
  authDomain: "accelerometer-c758f.firebaseapp.com",
  databaseURL: "https://accelerometer-c758f-default-rtdb.firebaseio.com",
  projectId: "accelerometer-c758f",
  storageBucket: "accelerometer-c758f.appspot.com",
  messagingSenderId: "219815381267",
  appId: "1:219815381267:web:013809425beaa4115d32e6",
  measurementId: "G-362H2Z6Y6P",
};

export const app = initializeApp(firebaseConfig);
