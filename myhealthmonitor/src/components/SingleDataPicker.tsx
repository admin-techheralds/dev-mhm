import React, { useEffect, useRef, useState } from 'react';
import './FamilyMemberCard.css';

import { 
    IonLoading,
    IonPicker 
} from '@ionic/react';
import dayjs from 'dayjs'
import { PickerColumn } from "@ionic/core";


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
import { useAuth } from '../auth';


interface SingleDataPickerProps {
    isOpen: boolean;
    columnData: any; 
    onCancel: Function;
    onSave: Function;
}

const SingleDataPicker: React.FC<SingleDataPickerProps> = ({ isOpen, onSave, onCancel, columnData  }) => {

    const pickerElement = useRef<HTMLIonPickerElement>(null);
    const [ pickerColumn, setPickerColumn ] = useState<PickerColumn>()
    var optionsList:any = [];
    if(columnData != undefined) {
        columnData.forEach((m:any) => {
            optionsList.push({
                text : m['name'],
                value : m['name']
            })
        });
    }

    const pickerElementData:PickerColumn[] = [
        {
            name : 'selected_data',
            options: optionsList
        }
    ] 
    return (
        <div>
            <IonPicker
                
                ref = {pickerElement}

                isOpen={isOpen}
                columns={pickerElementData}
                buttons={
                    [
                        {
                            text: "Cancel",
                            role: "cancel",
                            handler: value => {
                                onCancel()
                            }
                        },
                        {
                            text: "Confirm",
                            handler: value => {
                                onSave(value)
                            }
                        }
                    ]
                }
            />

        </div>
    )
};

export default SingleDataPicker;