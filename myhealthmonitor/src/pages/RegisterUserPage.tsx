import { IonAvatar, IonButton, IonButtons, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonImg, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonLoading, IonMenuButton, IonNote, IonPage, IonRow, IonText, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useParams } from 'react-router';
import './RegisterUserPage.css';
import { useAuth } from '../auth';

import { APP_VERSION } from '../env';

import { auth } from '../firebase';

 

const RegisterUserPage: React.FC = () => {

  const { loggedIn } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');

  const [status, setStatus] = useState( { loading: false, error : false } )
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    setStatus({ loading : true, error: false} );
    try {
      // var confirmationResult = await auth.signInWithPhoneNumber(phoneNumber)
      var credential = await auth.createUserWithEmailAndPassword(email, password);
      console.log('Credential', credential);
    } catch(err) {
      setStatus( { loading : false, error : true});
      console.log('auth error', err);
    }
  }
  if(loggedIn) {
    return <Redirect to="/home" />;
  }
  // const [phoneNumber, setPhoneNumber] = useState<string>();

  return (
    <IonPage>
      <IonContent class="ion-padding">
        <IonGrid class="app">
          <IonRow class="ion-justify-content-center">
            <IonCol size="auto">
              {/* <IonImg  src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"> */}
              <IonAvatar>
                <IonImg  src="./assets/icon/appicon.png">
                </IonImg>
              </IonAvatar>
            </IonCol>
          </IonRow>
          <IonRow class="ion-justify-content-center">
            <IonCol size="auto">
              <IonLabel color="primary" className="appname">My Health Monitor</IonLabel>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonList>
        
          {/* <IonItem>
              <IonLabel position="floating">Phone Number...</IonLabel>
              <IonInput value={phoneNumber} type="tel" 
                onIonChange={(event) => setPhoneNumber(event.detail.value) }  />
          </IonItem>   
           */}
          <IonItem className="ion-text-center">
            <IonLabel className="heading">Register</IonLabel>
          </IonItem> 

          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput value={email} type="email" 
              onIonChange={(event) => setEmail(event.detail.value as string) }  />
          </IonItem>   
          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput value={password} type="password" 
              onIonChange={(event) => setPassword(event.detail.value as string)  }  />
          </IonItem>
          {
            status.error && <IonText className="ion-text-center" color="danger">Registration Failed</IonText>
          }
        </IonList>

        <IonButton  expand="block" onClick={ handleSignIn }>
          Create Account
        </IonButton>
        <IonButton  expand="block" fill="clear" routerLink="/login" >
          Already have an account ?
        </IonButton>
        <IonLoading isOpen={status.loading}></IonLoading>
        <IonGrid class="footer">
          <IonRow class="ion-justify-content-center">
            <IonCol className="ion-text-center" size="auto">
              <IonNote class="footerText">
                v {APP_VERSION} <br/>
                Copyright @2021<br/>
                Powered by TechHeralds Ltd.
              </IonNote>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default RegisterUserPage;
