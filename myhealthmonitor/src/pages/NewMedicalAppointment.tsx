import { 
  IonButton, 
  IonButtons, 
  IonContent, 
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
import './NewMedicalAppointment.css';
import { useAuth, useAuthInit } from './../auth'
import { auth as firebaseAuth } from './../firebase';
import { 

  arrowBackOutline,
  arrowBackSharp,
  addOutline,
  addSharp

} from 'ionicons/icons';


const NewMedicalAppointment : React.FC = ( ) => {

  const { name } = useParams<{ name: string; }>();
  const { loggedIn, userId } = useAuth();
  const { loading, auth } = useAuthInit();

  const goBack = () => {
    return <Redirect to="/my/doctorappointments/list" />
  }
  

  if(! loggedIn) {
    console.log('Me in New Device. But flag is:', loggedIn)
    return <Redirect to="/login" />
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton  routerLink="/my/doctorappointments/list">
              <IonIcon slot="start" icon={arrowBackSharp} />
            </IonButton>
          </IonButtons>
          <IonTitle>My Doctor Appointments</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent class="ion-padding">
        <IonLabel>Book Doctor Appointment</IonLabel>
      </IonContent>
    </IonPage>
  );
};

export default NewMedicalAppointment;
