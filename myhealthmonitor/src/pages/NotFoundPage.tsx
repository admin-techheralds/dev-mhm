import { IonButtons, IonContent, IonHeader, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router';
import { Redirect, Route } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  return (
    <IonPage>
      <IonLabel>Not Found</IonLabel>
    </IonPage>
  );
};

export default NotFoundPage;
