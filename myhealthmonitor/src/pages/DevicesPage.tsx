import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { Redirect, useParams } from 'react-router';
import './DevicesPage.css';
import { useAuth } from './../auth'
import { 

  arrowBackOutline,
  arrowBackSharp,
  addOutline,
  addSharp

} from 'ionicons/icons';


const DevicesPage: React.FC = () => {

  // const { name } = useParams<{ name: string; }>();

  const { loggedIn, userId } = useAuth();


  const goBack = () => {
    console.log('Going back to landing paghe...')
    return <Redirect to="/page/landing" />
  }

  if(! loggedIn) {
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
          <IonTitle>My Devices</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent class="ion-padding">
        <IonLabel>My Devices Page </IonLabel>
        <IonFab vertical="bottom" horizontal="end">
          <IonFabButton color="medium" routerLink="/my/devices/add">
            <IonIcon icon={addSharp}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default DevicesPage;
