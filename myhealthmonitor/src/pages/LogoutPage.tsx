import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router';
import { Redirect, Route } from 'react-router-dom';
import './LogoutPage.css';
import { useAuth } from '../auth';
import { auth } from '../firebase'
import { IonReactRouter } from '@ionic/react-router';

import { auth as firebaseAuth } from './../firebase';



const LogoutPage: React.FC = () => {

  const { loggedIn, userId } = useAuth();

  if(! loggedIn) {
    return <Redirect to="/login" />
  }

  const gotoHome = () => {
    console.log("Going home...")
    return <Redirect to="/my/landing" />
  }

  const handleLogout = ()=> {
    firebaseAuth.signOut();
  }


  return (
    <IonPage>
      <IonContent class="icontent ">
      <IonList >
        <IonItem lines="none"  class="ion-text-center">
            <IonLabel>Do you really want to logout ?</IonLabel>
        </IonItem>
        <IonItem lines="none" class="ion-text-center">
          <IonButton color="primary" onClick={handleLogout}>Yes</IonButton>
          <IonButton color="danger"  routerLink="/my/landing">No</IonButton>
        </IonItem>
      </IonList>
      </IonContent>
    </IonPage>
  );
};

export default LogoutPage;
