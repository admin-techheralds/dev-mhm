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
import './EditFamilyMember.css';
import { useAuth, useAuthInit } from './../auth'
import { auth as firebaseAuth } from './../firebase';
import { 

  arrowBackOutline,
  arrowBackSharp,
  addOutline,
  addSharp

} from 'ionicons/icons';
import { useHistory } from "react-router-dom";

import dayjs from 'dayjs'
import { db, storage } from './../firebase'
import { ALERT_SHOW_DURATION_MS } from './../env'
import { FamilyMemberDetails } from './../models'

interface RouteParams {
  id : string;
}

const EditFamilyMember: React.FC = ( ) => {


  const { id } = useParams<RouteParams>();
  const history = useHistory();

  // const { name } = useParams<{ name: string; }>();
  const { loggedIn, userId } = useAuth();
  const { loading, auth } = useAuthInit();

  const [ showConfirmation, setShowConfirmation] = useState(false);
  const [ error, setError ] = useState<string>('');
  const [ status, setStatus ] = useState<string>('');
  const inputFileElementRef = useRef<HTMLInputElement>(null);

  const [ dataLoading, setDataLoading] = useState<boolean>(true)
  const [ familyMember, setFamilyMember] = useState<FamilyMemberDetails>();

  const [ name, setName] = useState<string>('');
  const [ dob, setDOB] = useState<string>('');
  const [ gender, setGender] = useState<string>('');
  const [ profile, setProfile] = useState<string>('');
  const [ profileModified, setProfileModified] = useState<boolean>(false);

  const [ familyMembersList, setFamilyMembersList] = useState<FamilyMemberDetails[]>();

  const getFamilyMemberDetailsByName = function(members:any) : FamilyMemberDetails {
    var details = undefined;
    for(var i = 0; i < members.length; i++) {
      if(members[i].id == id) {
        details = members[i] as FamilyMemberDetails;
        break;
      }
    }
    return details!;
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

  const deleteProfilePicture = async function(userid:string, id:string) {
    try {
      const picRef = storage.ref(`Users/${userid}/profile_pic/${id}`);
      const result = await picRef.delete();
      console.log('Delete Response is', result);
      return true;
    } catch(ex) {
      console.log('Error while deleting the profile pic of user:' + name, ex)
    }
    return false;
  }

  useEffect(() =>  {
    if(loggedIn) {
      const user_ref = db.ref(`Users/${userId}`);
      user_ref.get().then((docs)=> {
        setDataLoading(false)
        const user_details = docs.val();
        var family_members = user_details['family_members'];
        if(family_members != undefined) {
          setFamilyMembersList(family_members as FamilyMemberDetails[]);
          const selected_family_member_details:FamilyMemberDetails = getFamilyMemberDetailsByName(family_members); 
          console.log("Selected family member", selected_family_member_details)
          
          setName(selected_family_member_details.name);
          setDOB(selected_family_member_details.dob);
          setGender(selected_family_member_details.gender);
          setProfile(selected_family_member_details.profile_pic);

        }
      });
    }
  }, [loggedIn, userId])
  

  // useIonViewDidEnter(() => {
  //   console.log('HomePage::ionViewDidEnter event fired');
  // });

  // useIonViewDidLeave(() => {
  //   console.log('HomePage::ionViewDidLeave event fired');
  // });

  // useIonViewWillEnter(() => {
  //   console.log('HomePage::ionViewWillEnter event fired');
  // });

  // useIonViewWillLeave(() => {
  //   console.log('HomePage::ionViewWillLeave event fired');
  // });
  const goBack = () => {
    return <Redirect to="/my/family/list" />
  }
  
  const deleteFamilyConfirm = () => {
    setShowConfirmation(true)
  }

  const deleteFamily = async () => {
    var index = -1;
    for(var i = 0; i < familyMembersList!.length; i++ ) {
      var member = familyMembersList![i];
      if(member.id == id) {
        index = i;
        break;
      }
    }
    console.log('Item to be deletd is:' + index)
    if(index != -1) {
      familyMembersList?.splice(index, 1);
    }

    setDataLoading(true)
    const result = await deleteProfilePicture(userId!, id);

    console.log('After rmeoving the member, remaining items', familyMembersList);
    db.ref(`Users/${userId}/family_members`).set(familyMembersList).then(() => {
      console.log('Successfully updated the family member details');
      setDataLoading(false);
      setStatus("Successfully deleted the family member");
      setTimeout(function() {
        history.push('/my/family/list');
      }, ALERT_SHOW_DURATION_MS + 500) //allow the success status msg to be displayed
    }).catch((ex) => {
      console.log('Failed while deleting the family member', ex);
      setDataLoading(false);
      setError("Failed while deleting the family member details");
      return;
    })
    
  }

  const getNameCount = function() {
    var count = 0;
    for(var i = 0; i < familyMembersList!.length; i++ ) {
      var member = familyMembersList![i];
      console.log('Comparing:' + member.name + ' with' + name)
      if(member.id != id && member.name == name) {
        count = count + 1;
      }
    }
    console.log("Name count", count);
    return count;
  }

  // const checkNameAlreadyExists = function() {
  //   var exists = false;
  //   for(var i = 0; i < familyMembersList!.length; i++ ) {
  //     var member = familyMembersList![i];
  //     if(member.name == name && name != selected_name) {
  //       exists = true;
  //       break;
  //     }
  //   }
  //   return exists;
  // }

  const handleFileSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {

    
    if(event.target.files!.length > 0) {
      const userSelectedFile = event.target.files?.item(0);
      var picURLTmp = URL.createObjectURL(userSelectedFile);
      console.log('Profile pic url:' + picURLTmp);
      setProfileModified(true);
      setProfile(picURLTmp);
    }
  }




  const editFamily = async () => {
    setError('')
    console.log("editing family member...");
    if(name.trim().length <= 0) {
      setError('Name cannot be empty');
      return;
    }
    if(dob.trim().length <= 0) {
      setError('Date of Birth cannot be empty');
      return;
    }

    if(getNameCount() >= 1) {
      setError("Family member with the given name already exists");
      return;
    }

    setDataLoading(true);
    for(var i = 0; i < familyMembersList!.length; i++ ) {
      var member:FamilyMemberDetails = familyMembersList![i];
      if( member!.id == id) {
    
        member = {
          id : id,
          name : name,
          dob : dob,
          gender : gender,
          profile_pic : profile
        }
        if(profileModified) {
          const result = await deleteProfilePicture(userId!, id);
          const profile_pic_url = await saveProfilePicture(userId!, id, profile);
          member['profile_pic'] = profile_pic_url
        }
        familyMembersList![i] = member as FamilyMemberDetails
        break;
      }
    }
    db.ref(`Users/${userId}/family_members`).set(familyMembersList).then(() => {
      console.log('Successfully updated the family member details');
      setStatus("Successfully updated the family member details...");
      setDataLoading(false);
      setTimeout(function() {
        history.push('/my/family/list');
      }, ALERT_SHOW_DURATION_MS + 500) //allow the success status msg to be displayed
      }).catch((ex) => {
        setError("Failed while saving the family member details");
        setDataLoading(false);
        return;
      });
  }

  if(! loggedIn) {
    console.log('Me in Edit Family Member. But flag is:', loggedIn)
    return <Redirect to="/login" />
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton  routerLink="/my/family">
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
              <IonLabel className="page-sub-heading">
                Edit Family Member
              </IonLabel>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonList lines="inset">
          <IonItem lines="inset">
            <IonLabel position="stacked">Name</IonLabel>
            <IonInput value={name} type="text" 
              onIonChange={(event) => {
                  setName(event.detail.value as string) 
                }
              }  />
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
            <IonSegment value={gender} onIonChange={ e => {
                  setGender(e.detail.value as string)
              }
            }>
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
          <IonButton color="success" onClick={editFamily}>Save</IonButton>
          <IonButton color="light" routerLink="/my/family/list">Cancel</IonButton>
          { 
            <IonButton color="danger" onClick={deleteFamilyConfirm}>Delete</IonButton>
          }
        </div>
        <IonAlert
          isOpen={showConfirmation}
          onDidDismiss={() => setShowConfirmation(false)}
          header={'Confirm ?'}
          message={`Do you want to delete this user ?</strong>!!!`}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel: Cancelled the Family member deletion');
              }
            },
            {
              text: 'Yes',
              cssClass: 'danger',
              handler: () => {
                deleteFamily()
              }
            }
          ]}
        />
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
          dataLoading ? <IonLoading  isOpen /> : ""
        }
        </IonContent>
    </IonPage>
  );
};

export default EditFamilyMember;
