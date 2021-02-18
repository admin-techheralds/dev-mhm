// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase';
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyAgVl_QtoEr_UlGSfZ2Fjav_JeFdF4K_Hw",
    authDomain: "dev-myhealthmonitor.firebaseapp.com",
    projectId: "dev-myhealthmonitor",
    storageBucket: "dev-myhealthmonitor.appspot.com",
    messagingSenderId: "472719194756",
    appId: "1:472719194756:web:cbf07f09361db8e30260d1",
    measurementId: "G-8FBKCTKZSH"
  };

const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
export const db = app.database();
export const storage = app.storage();

export const recaptchaVerifier = function(element:any, options:any) {
  return new firebase.auth.RecaptchaVerifier(element, options);
}

