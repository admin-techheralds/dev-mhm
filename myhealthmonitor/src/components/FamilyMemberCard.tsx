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
import { FamilyMemberDetails } from './../models'


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
        <IonCard routerLink={`/my/family/edit/${member.name}`}>
            <IonCardContent>
                <IonItem lines="none">
                    <IonAvatar>
                        <img src={member.profile_pic} alt={member.name} />
                    </IonAvatar>
                    <IonLabel className="name">{member.name}</IonLabel>
                    <FontAwesomeIcon icon={ member.gender == "F" ? "female" : "male" } size="2x" />
                    <IonBadge  className="age">{age}</IonBadge >
                </IonItem>
            </IonCardContent>
        </IonCard>
    )
};

export default FamilyMemberCard;