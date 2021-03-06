import { IonAvatar, IonButton, IonButtons, IonChip, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonImg, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonLoading, IonMenuButton, IonNote, IonPage, IonRow, IonText, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useParams } from 'react-router';
import './LoginPage.css';
import { useAuth } from '../auth';

import { APP_VERSION, APP_NAME } from '../env';

import firebase from 'firebase';
import { auth, recaptchaVerifier } from '../firebase';

 

const LoginWithPhonePage: React.FC = () => {

  const { loggedIn } = useAuth();


  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOTP] = useState('');

  const [ errorMsg, setErrorMsg] = useState('');

  const [status, setStatus] = useState( { loading: false, phoneNumberSend: false, error : false } )
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [confirmationResult, setConfirmationResult] = useState<firebase.auth.ConfirmationResult>();

  if(loggedIn) {
    return <Redirect to="/my/landing" />;
  }
  const handlePhoneLogin = async () => {
    setErrorMsg('')

    var appVerifier = recaptchaVerifier('recaptcha-container', {
      'size': 'normal',
      'callback': (response: any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // ...
        console.log('Captcha verification is complete now');
        setStatus({ loading : true, phoneNumberSend: false, error: false} );
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        // ...
        console.log('Captcha verification is expired. Login again  now')
        setStatus({ loading : false, phoneNumberSend: false, error: false} );
      }
    });

    try {
      
      // var confirmationResult = await auth.signInWithPhoneNumber(phoneNumber)
      var cResult = await auth.signInWithPhoneNumber(phoneNumber, appVerifier);
      setConfirmationResult(cResult);
      console.log('confirmationResult', cResult);
      setStatus( { loading : false, phoneNumberSend: true, error : false});
    } catch(err) {
      setStatus( { loading : false, phoneNumberSend: false, error : true});
      console.log('auth error', err);
      setErrorMsg(err.code)
    }
  }

  const submitOTP = async () => {
    console.log('Submitting the OTP...now...');
    setStatus({ loading : true, phoneNumberSend: true, error: false} );
    setErrorMsg('')

    try {
      var result = await confirmationResult!.confirm(otp);
      console.log('otp result', result);
      setStatus({ loading : false, phoneNumberSend: true, error: false} );

    } catch(err) {
      console.log('otp send error:', err);
      setStatus({ loading : false, phoneNumberSend: true, error: true} );
      setErrorMsg(err.code)
    }
  } 

  const handleLogin = async () => {
    setStatus({ loading : true, phoneNumberSend: false, error: false} );
    try {
      // var confirmationResult = await auth.signInWithPhoneNumber(phoneNumber)
      var credential = await auth.signInWithEmailAndPassword(email, password);
      console.log('Credential', credential);
    } catch(err) {
      setStatus( { loading : false, phoneNumberSend: false, error : true});
      console.log('auth error', err);
    }
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
              <IonLabel color="primary" className="appname">{APP_NAME}</IonLabel>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonList>
        
          
          <IonItem className="ion-text-center" lines="none">
            <IonLabel className="heading">Login</IonLabel>
          </IonItem> 

          {
            (! status.phoneNumberSend) && 
            <IonItem>
              <IonLabel position="floating">Phone Number...</IonLabel>
              <IonInput value={phoneNumber} type="tel" 
                onIonChange={(event) => setPhoneNumber(event.detail.value as string) }  />
          </IonItem>
          }
          
          
          {/* <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput value={email} type="email" 
              onIonChange={(event) => setEmail(event.detail.value as string) }  />
          </IonItem>   
          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput value={password} type="password" 
              onIonChange={(event) => setPassword(event.detail.value as string)  }  />
          </IonItem> */}

          {
            status.phoneNumberSend && 
            <IonItem>
                <IonLabel position="floating">OTP</IonLabel>
                <IonInput value={otp} type="number" 
                
                onIonChange={(event) => setOTP(event.detail.value as string) } 
                
                />
            </IonItem>   
          }
          {
            status.error && <IonText className="ion-text-center" color="danger">{errorMsg}</IonText>
          }
          {
          (! status.phoneNumberSend) && 
            <div id="recaptcha-container"></div> 
          }

        </IonList>
        {
            (! status.phoneNumberSend) && 
          <IonButton  expand="block" onClick={ handlePhoneLogin }>
            Send OTP
          </IonButton>
        }
        {
          status.phoneNumberSend && 
          <IonButton  expand="block" onClick={ submitOTP }>
            Submit OTP
          </IonButton>
        }

        {/*         
        <IonButton  expand="block" fill="clear" routerLink="/register" >
          Dont have an account ?
        </IonButton>
         */}
        
        <IonLoading isOpen={status.loading}></IonLoading>
{/* 
        <IonFooter>
          <IonNote class="footerText">
                v {APP_VERSION} <br/>
                Copyright @2021<br/>
                Powered by TechHeralds Ltd.
            </IonNote>
        </IonFooter> */}
        
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

export default LoginWithPhonePage;
