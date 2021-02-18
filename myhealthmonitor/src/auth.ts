import React, { useContext, useEffect, useState } from 'react';
import { auth as firebaseAuth } from './firebase';
import  firebase from 'firebase';
import { db } from './firebase'

interface Auth {
    loggedIn: boolean;
    userId?: string;
    userData? : any;
}

interface AuthInit {
    loading: boolean;
    auth?: Auth;
}

export const AuthContext = React.createContext <Auth>( { loggedIn : false })

export function useAuth(): Auth {
    return useContext(AuthContext);
}

export function useAuthInit(): AuthInit {
  const [authInit, setAuthInit] = useState<AuthInit>({ loading: true });
  console.log(`the logged In status is:`, authInit)

  useEffect(() => {
    const unsubscriber:firebase.Unsubscribe = firebaseAuth.onAuthStateChanged((firebaseUser) => {
        const auth:Auth = {
          loggedIn : false
        }
        if(firebaseUser) {
          console.log('User is logged in.  ')
          auth.loggedIn = true
          auth.userId = firebaseUser.uid;
          db.ref('Users/' + firebaseUser.uid).once('value')
          .then((snapshot:any) => {
            console.log('User Ref', snapshot.val())
            if(snapshot.val() == undefined) {
              console.error("Failed as no Owner data for the logged in user. Prompt now..!")
              auth.userData = undefined;
            } else {
              auth.userData = snapshot.val();
            }
            setAuthInit({ loading: false, auth });
          }).catch((err:any) =>{
            console.error("Failed as no data for the user.", err);
            auth.userData = undefined
            setAuthInit({ loading: false, auth });
          });
        } else {
          console.log('User is logged out / object found to be null');
          setAuthInit({ loading: false, auth });
        }
    })
  }, []);
  return authInit;
}