import React, { useEffect, useState } from 'react';
import './FamilyMemberCard.css';

import { IonAvatar, IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonRow } from '@ionic/react';
import dayjs from 'dayjs'

import {
    female,
    male,
    manOutline,
    manSharp,
    womanOutline,
    womanSharp
} from 'ionicons/icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FamilyMemberDetails } from '../models'


interface FamilyCardProps {
    member: FamilyMemberDetails
}

const FamilyMemberCard: React.FC<FamilyCardProps> = ({ member }) => {
  
    const [ error, setError] = useState<string>('')
    const [ age, setAge] = useState<number>();

    useEffect( () => {
        const dob_days = dayjs(member.dob).startOf('day')
        const today = dayjs(new Date()).startOf('day')
        setAge(today.diff(dob_days, 'years'));
    }, [])


    
    console.log('Loading family details:', member)

    return (
        <IonItem routerLink={`/my/family/edit/${member.name}`} button>
            <IonAvatar>
                <img src={member.profile_pic} alt={member.name} />
            </IonAvatar>
            <IonLabel className="name">{member.name}</IonLabel>
            <FontAwesomeIcon icon={ member.gender == "F" ? "female" : "male" } size="2x" />
            <IonBadge  className="age">{age}</IonBadge >

        </IonItem>

        // <IonCard >
        //     <IonCardContent>
        //         <IonGrid>
        //             <IonRow>
        //                 <IonCol sizeLg="6" sizeMd="6" sizeSm="6" sizeXs="6">
        //                     <IonAvatar>
        //                         <img src={member.profile_pic} alt={member.name} />
        //                     </IonAvatar>
        //                 </IonCol>
        //                 <IonCol sizeLg="6" sizeMd="6" sizeSm="6" sizeXs="6" class="ion-text-left">
        //                     <IonGrid>
        //                         <IonRow>
        //                             <IonCol sizeLg="12" sizeMd="12" sizeSm="12" sizeXs="12">
        //                                 <IonLabel class="name">{member.name}</IonLabel>
        //                             </IonCol>
        //                         </IonRow>
        //                         <IonRow>
        //                             <IonCol sizeLg="6" sizeMd="6" sizeSm="6" sizeXs="6">
        //                                 <FontAwesomeIcon icon={ member.gender == "F" ? "female" : "male" } size="3x" />
        //                             </IonCol>
        //                             <IonCol sizeLg="6" sizeMd="6" sizeSm="6" sizeXs="6">
        //                                 <IonBadge class="age" color="secondary">{age}</IonBadge>
        //                             </IonCol>
        //                         </IonRow>
        //                     </IonGrid>
        //                 </IonCol>
        //             </IonRow>
        //         </IonGrid>
        //     </IonCardContent>
        // </IonCard>
    )
};

export default FamilyMemberCard;