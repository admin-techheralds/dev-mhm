import { 
  IonAlert,
  IonButton, 
  IonButtons, 
  IonCol, 
  IonContent, 
  IonDatetime, 
  IonGrid, 
  IonHeader, 
  IonIcon, 
  IonInput, 
  IonItem, 
  IonLabel, 
  IonList, 
  IonListHeader, 
  IonLoading, 
  IonMenuButton, 
  IonPage, 
  IonRadio, 
  IonRadioGroup, 
  IonRow, 
  IonSegment, 
  IonSegmentButton, 
  IonTitle, 
  IonToast, 
  IonToolbar,
  useIonViewDidEnter,
  useIonViewDidLeave,
  useIonViewWillEnter,
  useIonViewWillLeave,

 } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import {  Redirect, useParams } from 'react-router';
import './SetOwnerProfile.css';
import { useAuth, useAuthInit } from './../auth'
import { auth as firebaseAuth, storage } from './../firebase';
import { 

  arrowBackOutline,
  arrowBackSharp,
  addOutline,
  addSharp

} from 'ionicons/icons';
import { useHistory } from "react-router-dom";
import { APP_NAME } from './../env'

import { ALERT_SHOW_DURATION_MS } from './../env'
import { db } from './../firebase'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'

interface RouteParams {
  id : string;
}

interface SetProfileInterfaceProps {
  setProfileData: Function;
}

const SetOwnerProfile: React.FC<SetProfileInterfaceProps> = ( { setProfileData } ) => {


  const { id } = useParams<RouteParams>();
  const history = useHistory();

  // const { name } = useParams<{ name: string; }>();
  const { loggedIn, userId } = useAuth();
  const { loading, auth } = useAuthInit();

  const [ showConfirmation, setShowConfirmation] = useState(false);
  const [ error, setError ] = useState<string>('');
  const [ status, setStatus ] = useState<string>('');
  const [ name, setName] = useState<string>('');
  const [ dob, setDOB] = useState<string>('');
  const [ gender, setGender] = useState<string>("F");
  const [ profile, setProfile] = useState<string>("/assets/placeholder_profile.png");
  const [ dataHandling, setDataLoading] = useState<boolean>(false);

  const inputImageFileElementRef = useRef<HTMLInputElement>(null);
  const inputNameElementRef = useRef<HTMLIonInputElement>(null);


  useIonViewDidEnter(() => {
    console.log('SetOwnerProfile::ionViewDidEnter event fired');
    inputNameElementRef.current!.focus();
  });

  
  useIonViewWillEnter(() => {
    console.log('SetOwnerProfile::ionViewWillEnter event fired');
    inputNameElementRef.current!.focus();
  });

  useEffect(() =>  {
    
    
    return () => {
      if(profile.startsWith("blob")) {
        URL.revokeObjectURL(profile)
      }
    }
  }, [ profile ])

  if(auth?.userData != undefined) {
    console.log('User data is defined.. Redirect to landing page');
    return <Redirect to="/my/landing" />
  }
  

  const saveProfilePicture = async function(userid:string, id:string, pictURL:string) {
    const picRef = storage.ref(`Users/${userid}/profile_pic/${id}`);
    const picResponse = await fetch(pictURL);
    const picBlob = await picResponse.blob();
    const snapshot = await picRef.put(picBlob);
    const url = await snapshot.ref.getDownloadURL();
    console.log('Uploaded image url:', url);
    return url;
  }

  const handleFileSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {

    if(event.target.files!.length > 0) {
      const userSelectedFile = event.target.files?.item(0);
      var picURLTmp = URL.createObjectURL(userSelectedFile);
      console.log('Profile pic url:' + picURLTmp);
      setProfile(picURLTmp);
    }
  }

  const saveProfile = async () => {
    setError('')
    console.log("saving the profile owner...");
    if(name.trim().length <= 0) {
      setError('Name cannot be empty');
      return;
    }
    if(dob.trim().length <= 0) {
      setError('Date of Birth cannot be empty');
      return;
    }
    const now = dayjs();
    const selectedDOB = dayjs(dob);
    if(! selectedDOB.isBefore(now, "days")) {
      setError('Date Of Birth has to be in past');
      return;
    }

    if(! profile.trim().startsWith('blob')) {
      setError('Profile picture found to be empty');
      return;
    }
    setDataLoading(true);
    const profile_pic_url = await saveProfilePicture(userId!, id, profile);

    db.ref('Users/' + id).set({
      name : name,
      dob : dob,
      gender: gender,
      profile_pic: profile_pic_url
    }).then(() => {
      setDataLoading(false);
      setStatus("Successfully stored the profile data...");
      //setting the profile data so that whn we redirect to other pages, it shall redirect this page
      setProfileData({
        name : name,
        dob : dob,
        gender: gender,
        profile_pic: profile_pic_url
      })
      setTimeout(function() {
        history.push('/my/family');
      }, ALERT_SHOW_DURATION_MS + 500) //allow the success status msg to be displayed  
    }).catch((ex) => {
      setDataLoading(false);

      setError('Failed to save your profile. Contact System Administrator');
      return;
    });
  }

  if(! loggedIn) {
    console.log('Me in Owner Profile Page. But login flag is:', loggedIn)
    return <Redirect to="/login" />
  }
  console.log('Loading the Owner profile:', id)
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{APP_NAME}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent class="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol className="ion-text-center">
              <IonLabel className="page-sub-heading">
                  Set Your Profile
              </IonLabel>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonList lines="inset">
          <IonItem lines="inset">
            <IonLabel position="stacked">Name</IonLabel>
            <IonInput value={name} type="text" 
              autofocus
              onIonChange={(event) => {
                  setName(event.detail.value as string); 
                }
              }  />
          </IonItem>   
          <IonItem lines="inset">
            <IonLabel position="stacked">Date of Birth</IonLabel>
            <IonDatetime displayFormat="DD/MMM/YYYY" 
              value = {dob}
              onIonChange={ (event) => { 
                setDOB(dayjs(event.detail.value as string).format('DD/MMM/YYYY'))
              }}
            ></IonDatetime>
          </IonItem>
          <IonLabel className="genderLabel">Gender</IonLabel>
          <IonItem lines="inset">
            <IonSegment value={gender} onIonChange={e => setGender(e.detail.value as string)}>
              <IonSegmentButton value="M">
                <IonLabel>Male</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="F">
                <IonLabel>Female</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">Profile</IonLabel>
              <input type="file" accept="image/*"  hidden={true} ref={inputImageFileElementRef}  onChange={handleFileSelection}  />
                <img className="profile" src={profile} alt="" style={{ cursor: "pointer" }} onClick={() => {
                  inputImageFileElementRef.current!.click();
                }} />
          </IonItem>   
        </IonList>
        <div className="page-buttonbar ion-text-center">
          <IonButton color="success" onClick={saveProfile}>Save</IonButton>
        </div>
        <IonToast
          isOpen={error.length > 0}
          onDidDismiss={() => setError("")}
          message={error}
          duration={ALERT_SHOW_DURATION_MS}
        />
        <IonToast
          isOpen={status.length > 0}
          onDidDismiss={() => {
            setStatus("")
            
          }}
          message={status}
          duration={ALERT_SHOW_DURATION_MS}
        />
        {
          dataHandling ? <IonLoading  isOpen /> : ""
        }
      </IonContent>
    </IonPage>
  );
};

export default SetOwnerProfile;
