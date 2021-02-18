import React, { useEffect, useState } from 'react';
import './FamilyMemberCard.css';

import { IonAvatar, IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonRow } from '@ionic/react';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



const NoFamilyMemberCard: React.FC = () => {
  
    return (
        <IonCard color="danger">
            <IonCardContent>
                <IonLabel>Family members are not added yet. Click + to add a member</IonLabel>
            </IonCardContent>
        </IonCard>
    )
};

export default NoFamilyMemberCard;