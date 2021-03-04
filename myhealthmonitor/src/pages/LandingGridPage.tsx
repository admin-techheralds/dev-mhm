import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import React, { useEffect, useState } from 'react';
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
import { APP_VERSION, APP_NAME } from '../env';
import { db } from './../firebase'


const LandingGridPage: React.FC = () => {

  const { loggedIn, userId, userData } = useAuth();
  const [ ownerMissing, setOwnerMissing ] = useState(false);

  useEffect(() => {
    if(loggedIn) {
      if(userData == undefined) {
        setOwnerMissing(true);
      } 
    } else {
      setOwnerMissing(false)
    }
  }, [ loggedIn ])

  const handleLogout = () => {
    console.log("Logging out...")
    firebaseAuth.signOut();
  }
  
  if(ownerMissing) {
    return <Redirect to={`/my/ownerprofile/${userId}`} />
  }

  if(! loggedIn) {
    return <Redirect to="/login" />
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
        <IonContent class="ion-padding" color="light">
          <IonGrid>
            <IonRow>
              <IonCol sizeLg="6" sizeMd="6" sizeSm="12" sizeXs="12">
                <IonCard color="success" routerLink="/my/records/list">
                  <IonCardHeader>
                    <IonCardSubtitle><IonIcon icon={documentTextSharp}></IonIcon>  Data</IonCardSubtitle>
                    <IonCardTitle>My Records</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent class="ion-padding">
                    The medical records will be viewed here....
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol sizeLg="6" sizeMd="6" sizeSm="12" sizeXs="12">
                <IonCard color="medium" routerLink="/my/devices/list">
                  <IonCardHeader >
                    <IonCardSubtitle><IonIcon icon={thermometerSharp}></IonIcon> Devices</IonCardSubtitle>
                    <IonCardTitle>My Devices</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent class="ion-padding">
                    List of medical devices configured to read the data...
                  </IonCardContent>
                </IonCard>         
              </IonCol>
              <IonCol sizeLg="6" sizeMd="6" sizeSm="12" sizeXs="12">
                <IonCard color="secondary" routerLink="/my/family/list">
                  <IonCardHeader>
                    <IonCardSubtitle><IonIcon icon={peopleSharp}></IonIcon> Family</IonCardSubtitle>
                    <IonCardTitle>My Family</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent class="ion-padding">
                    My family members. The members can be managed by clicking here...
                  </IonCardContent>
                </IonCard>         
              </IonCol>
              <IonCol sizeLg="6" sizeMd="6" sizeSm="12" sizeXs="12">
                <IonCard   color="tertiary" routerLink="/my/doctorappointments/list">
                  <IonCardHeader>
                    <IonCardSubtitle><IonIcon icon={calendarSharp}></IonIcon> Appointments</IonCardSubtitle>
                    <IonCardTitle>My Doctor Appointments</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent  class="ion-padding">
                    List of doctor appointments that have been booked
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>   
          </IonGrid>    
      </IonContent>
    </IonPage>
  );
};

export default LandingGridPage;
