import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDpmdHGisD1xATYo829DFGjITwe8MXhXeE",
  authDomain: "test01multimedia-64a4d.firebaseapp.com",
  databaseURL:
    "https://test01multimedia-64a4d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "test01multimedia-64a4d",
  storageBucket: "test01multimedia-64a4d.appspot.com",
  messagingSenderId: "51382057878",
  appId: "1:51382057878:web:64223b45b01bf17e9dbbb7",
  measurementId: "G-SPT0TV20JL",
};

const app = initializeApp(firebaseConfig);

// Obtener la instancia de autenticación
const database = getDatabase(app);

export { database };
