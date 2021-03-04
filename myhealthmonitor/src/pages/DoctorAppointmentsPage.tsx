import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonLoading, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router';
import './DoctorAppointmentsPage.css';
import { useAuth } from './../auth'
import { 

  arrowBackOutline,
  arrowBackSharp,
  addOutline,
  addSharp

} from 'ionicons/icons';

import { db } from './../firebase'
import dayjs from 'dayjs'

import  DoctorAppointmentCard  from './../components/DoctorAppointmentCard'

const DoctorAppointmentsPage: React.FC = () => {

  const [ familyMembersList, setFamilyMembersList ] = useState<any>(undefined)
  const [ doctorsList, setDoctorsList ] = useState<any>(undefined)
  const [ pastAppointmentsList, setPastAppointmentsList ] = useState<any>(undefined)
  const [ upcomingAppointmentsList, setUpcomingAppointmentsList ] = useState<any>(undefined)

  const [ error, setError] = useState<string>('')
  const [ status, setStatus] = useState<string>('')
  const [ dataLoading, setDataLoading] = useState<boolean>(true)
  const { loggedIn, userId } = useAuth();
  const [ owner, setOwner ] = useState<any>(undefined)

  useEffect( () => {
    const user_ref = db.ref(`Users/${userId}`);
    user_ref.get().then((docs)=> {
      const user_details = docs.val();
      var family_member_list_local:any = [];
      var family_members = user_details['family_members'];
      const owner = {
        name : user_details.name,
        id : userId,
        profile_pic : user_details.profile_pic,
        gender : user_details.gender,
        dob : user_details.dob
      }; 
      setOwner( owner)
      if(family_members != undefined) {
        family_members.forEach(function(m:any) {
          family_member_list_local.push(m);
        })
        family_member_list_local.push(owner);
      } else {
        family_member_list_local.push(owner)
      }
      setFamilyMembersList(family_member_list_local);
      const doctors_ref = db.ref(`Doctors/`);
      doctors_ref.get().then((docs)=> {
        setDataLoading(false)
        var doctors_list:any = [];
        docs.forEach(function(doctor:any) {
          doctors_list.push(doctor.val())
        });
        setDoctorsList(doctors_list);
        var appointments = user_details['doctor_appointments'];
        var past_appointments_list:any = [];
        var upcoming_appointments_list:any = [];
        const keys = Object.keys(appointments);
        const now = dayjs().startOf('day')
        keys.forEach((k:string) => {
          const appointment = appointments[k];
          appointment.family_member_details = getItemDetailsById(family_member_list_local, appointment.name)
          appointment.doctor_details = getItemDetailsById(doctors_list, appointment.doctor)
          const appointment_date =  dayjs(appointment['appointment_date']).startOf('day')
          if(appointment_date.isBefore(now)) {
            past_appointments_list.push(appointment)
          } else {
            upcoming_appointments_list.push(appointment)
          }
        })
        past_appointments_list.sort(compareSortByDate);
        upcoming_appointments_list.sort(compareSortByDate);
        
        setPastAppointmentsList(past_appointments_list);
        setUpcomingAppointmentsList(upcoming_appointments_list);
  
      }); // end of doctors
    }); //end of users
  }, [ userId ]);
  

  const getItemDetailsById = function(members:any, id:string) {
    var selected_member = undefined;
    if(members == undefined) {
      return selected_member;
    }
    for(var i = 0; i < members!.length; i++) {
      const member = members[i];
      if(member['id'] == id) {
        selected_member = member;
        break;
      }
    }
    return selected_member;
  }

  const getDoctorName = function(id:string) {
    var name = undefined;
    for(var i = 0; i < doctorsList!.length; i++) {
      const d = doctorsList[i];
      if(d['id'] == id) {
        name = d['name'];
        break;
      }
    }
    return name;
  }
  
  const compareSortByDate = (a:any, b:any) => {
    const appointment_date_1 = dayjs(a.appointment_date).startOf('day')
    const appointment_date_2 = dayjs(b.appointment_date).startOf('day')
    
    if(appointment_date_1.isBefore(appointment_date_2)) {
      return -1;
    }
    if(appointment_date_1.isAfter(appointment_date_2)) {
      return 1;
    }
    return 0;
  }

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
          <IonTitle>My Doctor Appointments </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light">

      <IonItemGroup>
        <IonItemDivider>
          <IonLabel>Upcoming Appointments</IonLabel>
        </IonItemDivider>

        {
          upcomingAppointmentsList && upcomingAppointmentsList?.map((appnt:any) => {
              return <DoctorAppointmentCard key={`${appnt.id}`} appointment={appnt} />
          })
        }
      </IonItemGroup>

      <IonItemGroup>
        <IonItemDivider>
          <IonLabel>Past Appointments</IonLabel>
        </IonItemDivider>

        {
          pastAppointmentsList && pastAppointmentsList?.map((appnt:any) => {
            return <DoctorAppointmentCard appointment={appnt} />
          })
        }
      </IonItemGroup>
        
        <IonFab vertical="bottom" horizontal="end">
          <IonFabButton color="tertiary" routerLink="/my/doctorappointments/add">
            <IonIcon icon={addSharp}></IonIcon>
          </IonFabButton>
        </IonFab>
        {
          dataLoading ? <IonLoading isOpen /> : ""
        }
      </IonContent>
    </IonPage>
  );
};

export default DoctorAppointmentsPage;
