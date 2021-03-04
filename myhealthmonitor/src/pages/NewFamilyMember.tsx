import { 
  IonAvatar,
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
  IonThumbnail, 
  IonTitle, 
  IonToast, 
  IonToolbar,
  useIonViewDidEnter,
  useIonViewDidLeave,
  useIonViewWillEnter,
  useIonViewWillLeave,

 } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { Redirect, useParams } from 'react-router';
import './NewFamilyMember.css';
import { useAuth, useAuthInit } from './../auth'
import { auth as firebaseAuth, storage } from './../firebase';
import { 

  arrowBackOutline,
  arrowBackSharp,
  addOutline,
  addSharp

} from 'ionicons/icons';
import { useHistory } from "react-router-dom";

import { ALERT_SHOW_DURATION_MS } from './../env'
import { db } from './../firebase'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'


const NewFamilyMember: React.FC = ( ) => {


  const history = useHistory();

  // const { name } = useParams<{ name: string; }>();
  const { loggedIn, userId } = useAuth();
  const { loading, auth } = useAuthInit();

  const [ error, setError ] = useState<string>('');
  const [ status, setStatus ] = useState<string>('');
  const [ name, setName] = useState<string>('');
  const [ dob, setDOB] = useState<string>('');
  const [ gender, setGender] = useState<string>("F");
  const [ profile, setProfile] = useState<string>("/assets/placeholder_profile.png");
  const [ dataHandling, setDataLoading] = useState<boolean>(false);
  const inputFileElementRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if(profile.startsWith('blob')) {
        URL.revokeObjectURL(profile);
      }
    } 
  }, [ profile ])

  const goBack = () => {
    return <Redirect to="/my/family" />
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
      
      if(name.trim().length <= 0) {
        setError("Select the name before setting the profile name");
        return;
      }

      console.log('Saving the profile data for:' + name);
      const userSelectedFile = event.target.files?.item(0);

      var picURLTmp = URL.createObjectURL(userSelectedFile);
      console.log('Profile pic url:' + picURLTmp);
      setProfile(picURLTmp);      
    }
  }

  const checkNameExists = function(members:any) {
    var exists = false;
    for(var i = 0; i < members.length; i++) {
      if(members[i].name == name) {
        exists = true;
        break;
      }
    }
    return exists;
  }
  
  const addFamily = async () => {
    setError('')
    console.log("Adding family member...");
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
    const user_ref = db.ref(`Users/${userId}`);
    user_ref.get().then(async(docs)=>  {
      const user_details = docs.val();
      var family_members = user_details['family_members'];
      if(family_members == undefined) {
        family_members = [];
      } else {
        if(checkNameExists(family_members)) {
          setDataLoading(false);
          setError("Already family member with this name exists");
          return;
        }
      }
      const id =  uuidv4();
      const profile_pic_url = await saveProfilePicture(userId!, id, profile);
      family_members.push({
        id: id,
        name : name,
        dob : dob,
        gender : gender,
        profile_pic : profile_pic_url
      });
      user_details['family_members'] = family_members;
      user_ref.set(user_details).then(() => {
        setDataLoading(false);
        setStatus("Successfully added the family member...");
        setTimeout(function() {
            history.push('/my/family/list');
        }, ALERT_SHOW_DURATION_MS + 500) //allow the success status msg to be displayed  
      }).catch((ex) => {
        setDataLoading(false);
        console.log('Error while saving the user details', ex)
        setError('Error occurred while saving the family member details');
      })
    }).catch((ex) =>  {        
      setDataLoading(false);
      console.log('Error while reading the user details', ex)
      setError('Error occurred while reading the family member details');
    });

  }

  if(! loggedIn) {
    console.log('Me in New Family Member. But flag is:', loggedIn)
    return <Redirect to="/login" />
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton  routerLink="/my/family/list">
              <IonIcon slot="start" icon={arrowBackSharp} />
            </IonButton>
          </IonButtons>
          <IonTitle>My Family</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent class="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol className="ion-text-center">
              <IonLabel className="page-sub-heading">Add Family Member</IonLabel>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonList lines="inset">
          <IonItem lines="inset">
            <IonLabel position="stacked">Name</IonLabel>
            <IonInput value={name} type="text" 
              onIonChange={(event) => setName(event.detail.value as string) }  />
          </IonItem>   
          <IonItem lines="inset">
            <IonLabel position="stacked">Date of Birth:</IonLabel>
            <IonDatetime displayFormat="DD/MMM/YYYY" 
              value = {dob}
              onIonChange={ (event) => { 
                setDOB(dayjs(event.detail.value as string).format('DD/MMM/YYYY'))
              }}
            ></IonDatetime>
          </IonItem>
          <IonLabel class="gender_label">Gender</IonLabel>
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
              <input type="file" accept="image/*"  hidden={true} ref={inputFileElementRef}  onChange={handleFileSelection}  />
                <img className="profile" src={profile} alt="" style={{ cursor: "pointer" }} onClick={() => {
                  inputFileElementRef.current!.click();
                }} />
          </IonItem>   
        </IonList>
        <div className="page-buttonbar ion-text-center">
          <IonButton color="success" onClick={addFamily}>Save</IonButton>
          <IonButton color="light" routerLink="/my/family/list">Cancel</IonButton>
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

export default NewFamilyMember;
