import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonLabel, IonList, IonLoading, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router';
import './FamilyPage.css';
import { useAuth } from './../auth'
import { db } from  './../firebase'
import { 

  arrowBackOutline,
  arrowBackSharp,
  addOutline,
  addSharp
} from 'ionicons/icons';

import FamilyMemberCard from '../components/FamilyMemberCard';
import { FamilyMemberDetails } from '../models';
import NoFamilyMemberCard from '../components/NoFamilyMemberCard';
import FamilyMemberItem from '../components/FamilyMemberItem'


const FamilyPage: React.FC = ( ) => {

  // const { name } = useParams<{ name: string; }>();
  const { loggedIn, userId } = useAuth();
  const [ loading, setLoading] = useState<boolean>(true)
  const [ familyMembers, setFamilyMembers] = useState<FamilyMemberDetails[]>();
  useEffect( () => {
    if(loggedIn) {
      const user_ref = db.ref(`Users/${userId}`);
      user_ref.get().then((docs)=> {
        setLoading(false)
        const user_details = docs.val();
        var family_members = user_details['family_members'];
        if(family_members != undefined) {
          setFamilyMembers(family_members as FamilyMemberDetails[])
        }
      });
    }
  }, [loggedIn, userId]);

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
          <IonTitle>My Family</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light">
        {/* <IonList color="dark"> */}

        {
          familyMembers?.map((member) => {
            return <FamilyMemberCard key={member.name} member={member} />
            // return <FamilyMemberItem key={member.name} member={member} />

          })
        }

        {/* </IonList> */}
        {
          (! loading) && (! familyMembers) ? <NoFamilyMemberCard /> : ""
        }
        <IonFab vertical="bottom" horizontal="end">
          <IonFabButton color="secondary" routerLink="/my/family/add">
            <IonIcon icon={addSharp}></IonIcon>
          </IonFabButton>
        </IonFab>
        {
          loading ? <IonLoading  isOpen /> : ""
        }
      </IonContent>
    </IonPage>
  );
};

export default FamilyPage;
