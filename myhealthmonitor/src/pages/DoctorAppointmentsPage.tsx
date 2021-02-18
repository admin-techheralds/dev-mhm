import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { Redirect, useParams } from 'react-router';
import './DoctorAppointmentsPage.css';
import { useAuth } from './../auth'
import { 

  arrowBackOutline,
  arrowBackSharp,
  addOutline,
  addSharp

} from 'ionicons/icons';


const DoctorAppointmentsPage: React.FC = () => {

  const { name } = useParams<{ name: string; }>();

  const { loggedIn, userId } = useAuth();
  
  const goBack = () => {
    return <Redirect to="/my/landing" />
  }

  if(! loggedIn) {
    return <Redirect to="/login" />
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton routerLink="/my/landing">
                <IonIcon slot="start" icon={arrowBackSharp} />
              </IonButton>
            </IonButtons>
          <IonTitle>My Doctor Appointments </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent class="ion-padding">
        <IonLabel>My Doctor Appointments Page </IonLabel>
        <IonFab vertical="bottom" horizontal="end">
          <IonFabButton color="tertiary" routerLink="/my/doctorappointments/add">
            <IonIcon icon={addSharp}></IonIcon>
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default DoctorAppointmentsPage;
