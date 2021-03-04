import React, { useEffect, useState } from 'react';
import './DoctorAppointmentCard.css';

import { IonAvatar, IonBadge, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonRow } from '@ionic/react';
import dayjs from 'dayjs'



import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DoctorAppointment } from './../models'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { arrowForward, chevronDown, chevronForward, locationSharp, reorderFourSharp, callSharp, bandageSharp } from 'ionicons/icons';


interface DoctorAppointmentCardProps {
    appointment: DoctorAppointment
}

const DoctorAppointmentCard: React.FC<DoctorAppointmentCardProps> = ({ appointment }) => {
  
    const [ error, setError] = useState<string>('')
    const [ date, setDate] = useState<number>();
    const [ month, setMonth ] = useState<string>();
    const [ year, setYear] = useState<number>();
    const [ slot, setSlot] = useState<string>();
    const [ detailedView, setDetailedView ] = useState<boolean>(false);

    useEffect( () => {
        const appointmentDate = dayjs(appointment.appointment_date).startOf('day')
        setDate(appointmentDate.date());
        setMonth(appointmentDate.format("MMM"));
        setYear(appointmentDate.year());
        setSlot(appointment.appointment_slot.split("-")[0].trim())
    }, [])

    const showDetailedViewToggle = () => {
        console.log("Toggle view now")
        setDetailedView(! detailedView)
    }
    
    console.log('Loading Appointment details:', appointment)

    return (
        
        // routerLink={`/my/doctorappointments/edit/${appointment.id}`} button

        <IonCard onClick={showDetailedViewToggle}>
            <IonCardContent>
                <IonGrid>
                    <IonRow>
                        <IonCol size="3">
                            <IonLabel class="ion-text-uppercase">{month}</IonLabel>
                            <IonLabel className="appointmentdate">{date}</IonLabel>
                            <IonLabel class="appointmentSlot">{slot}</IonLabel>
                        </IonCol>
                        <IonCol size="4" >
                            <IonLabel className="doctor">Doctor</IonLabel>
                            <IonAvatar>
                                <img src={appointment.doctor_details.profile_pic} alt={appointment.doctor_details.name} />
                            </IonAvatar>
                        </IonCol>
                        <IonCol size="4">
                            <IonLabel className="appointmentFor">Member</IonLabel>
                            <IonAvatar>
                                <img src={appointment.family_member_details.profile_pic} alt={appointment.family_member_details.name} />
                            </IonAvatar>
                        </IonCol>
                        
                                                
                        <IonCol size="1" className="alignVertical">
                            <br/><br/>
                            <IonButton fill="clear" onClick={showDetailedViewToggle}>
                                <IonIcon  icon={ detailedView ? chevronDown : chevronForward } />
                                
                            </IonButton>
                        </IonCol>
                    </IonRow>
                    {
                        detailedView ? (
                            <div>
                                <IonRow>
                                    <IonCol size="1">
                                        <IonIcon class="appointmenteDetailsIcon" icon={bandageSharp} />
                                    </IonCol>
                                    <IonCol size="11">
                                        <IonLabel>{appointment.appointment_details}</IonLabel>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol size="1">
                                        <IonIcon class="appointmenteDetailsIcon" icon={reorderFourSharp} />
                                    </IonCol>
                                    <IonCol size="5"  class="ion-text-uppercase">
                                        <IonLabel>{appointment.status}</IonLabel>
                                    </IonCol>
                                    <IonCol size="1">
                                        <IonIcon class="appointmenteDetailsIcon" icon={callSharp} />
                                    </IonCol>
                                    <IonCol size="5">
                                        <IonLabel>{appointment.doctor_details.phone}</IonLabel>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol size="1">
                                        <IonIcon class="appointmenteDetailsIcon" icon={locationSharp} />
                                    </IonCol>
                                    <IonCol size="11">
                                        <IonLabel >{appointment.doctor_details.address}</IonLabel>
                                    </IonCol>
                                </IonRow>                                                          
                            </div>
                        ) : ""
                    }
                </IonGrid>
                {
                        detailedView ? (
                            <IonItem lines="none" >
                                <IonButton slot="end" size="small" routerLink={`/my/doctorappointments/edit/${appointment.id}`}>Edit</IonButton>
                            </IonItem>
                        ) : ""
                }
            </IonCardContent>
        </IonCard>
    )
};

export default DoctorAppointmentCard;