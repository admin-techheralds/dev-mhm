import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Redirect, Route } from 'react-router-dom';
import './LandingPage.css';
import { useAuth } from '../auth';
import { 

  logOutOutline,
  logOutSharp,
  thermometerOutline,
  thermometerSharp,
  homeOutline,
  homeSharp,
  peopleOutline,
  peopleSharp,
  calendarOutline,
  calendarSharp,
  documentTextOutline,
  documentTextSharp

} from 'ionicons/icons';
import { auth as firebaseAuth } from './../firebase';
import { APP_VERSION, APP_NAME, APP_FOLDERS_FILES_CONFIG } from '../env';



const LandingPage: React.FC = () => {

  const { loggedIn, userId } = useAuth();

  if(! loggedIn) {
    return <Redirect to="/login" />
  }

  const handleLogout = () => {
    console.log("Logging out...")
    firebaseAuth.signOut();
  }
  
  console.log('Loading the landing page with userid:', userId);

  return (
    <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{APP_NAME}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={handleLogout}>
                <IonIcon slot="end" icon={logOutSharp} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent class="ion-padding">
        <IonList>
          <IonItem lines="none" routerLink="/my/reading/list"  routerDirection="none"  >
            <IonCard color="success">
              <IonCardHeader>
                <IonCardSubtitle><IonIcon icon={documentTextSharp}></IonIcon>  Data</IonCardSubtitle>
                <IonCardTitle>My Readings</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                The medical records will be viewed here....
              </IonCardContent>
            </IonCard>         
          </IonItem>
          <IonItem lines="none" routerLink="/my/devices/list" routerDirection="none" >
            <IonCard color="medium">
              <IonCardHeader >
                <IonCardSubtitle><IonIcon icon={thermometerSharp}></IonIcon> Devices</IonCardSubtitle>
                <IonCardTitle>My Devices</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                List of medical devices configured to read the data...
              </IonCardContent>
            </IonCard>         
          </IonItem>
          <IonItem lines="none" routerLink="/my/family/list" routerDirection="none" >
            <IonCard color="secondary">
              <IonCardHeader>
                <IonCardSubtitle><IonIcon icon={peopleSharp}></IonIcon> Family</IonCardSubtitle>
                <IonCardTitle>My Family</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                My family members. The members can be managed by clicking here...
              </IonCardContent>
            </IonCard>         
          </IonItem>
          <IonItem lines="none" routerLink="/my/doctorappointments/list" routerDirection="none" >
            <IonCard   color="tertiary">
              <IonCardHeader>
                <IonCardSubtitle><IonIcon icon={calendarSharp}></IonIcon> Appointments</IonCardSubtitle>
                <IonCardTitle>My Doctor Appointments</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                List of doctor appointments that have been booked
              </IonCardContent>
            </IonCard>         
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default LandingPage;
