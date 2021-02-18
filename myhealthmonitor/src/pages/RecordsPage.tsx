import { 
  IonButton, 
  IonButtons, 
  IonContent, 
  IonFab, 
  IonFabButton, 
  IonHeader, 
  IonIcon, 
  IonLabel, 
  IonLoading, 
  IonMenuButton, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  useIonViewDidEnter,
  useIonViewDidLeave,
  useIonViewWillEnter,
  useIonViewWillLeave,

 } from '@ionic/react';
import React from 'react';
import { Redirect, useParams } from 'react-router';
import './RecordsPage.css';
import { useAuth, useAuthInit } from './../auth'
import { auth as firebaseAuth } from './../firebase';
import { 

  arrowBackOutline,
  arrowBackSharp,
  addOutline,
  addSharp

} from 'ionicons/icons';

import { DataHandler } from './../DataHandler'

interface Data {
  data:DataHandler;
}

const RecordsPage: React.FC<Data> = ( { data }) => {

  const { name } = useParams<{ name: string; }>();
  const { loggedIn, userId } = useAuth();
  const { loading, auth } = useAuthInit();

  console.log('Loading the data of reading page:', data)
  // useIonViewDidEnter(() => {
  //   console.log('HomePage::ionViewDidEnter event fired');
  // });

  // useIonViewDidLeave(() => {
  //   console.log('HomePage::ionViewDidLeave event fired');
  // });

  // useIonViewWillEnter(() => {
  //   console.log('HomePage::ionViewWillEnter event fired');
  // });

  // useIonViewWillLeave(() => {
  //   console.log('HomePage::ionViewWillLeave event fired');
  // });
  const goBack = () => {
    return <Redirect to="/my/landing" />
  }
  

  if(! loggedIn) {
    console.log('Me in ReadingPage. But flag is:', loggedIn)
    return <Redirect to="/login" />
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton  routerLink="/my/landing">
              <IonIcon slot="start" icon={arrowBackSharp} />
            </IonButton>
          </IonButtons>
          <IonTitle>My Medical Records</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent class="ion-padding">
        <IonLabel>My Records Page</IonLabel>
        <IonFab vertical="bottom" horizontal="end">
          <IonFabButton color="success" routerLink="/my/records/add">
            <IonIcon icon={addSharp}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default RecordsPage;
