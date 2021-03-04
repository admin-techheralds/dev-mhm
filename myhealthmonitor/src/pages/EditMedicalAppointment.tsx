import { 
  IonButton, 
  IonButtons, 
  IonCol, 
  IonContent, 
  IonDatetime, 
  IonGrid, 
  IonHeader, 
  IonIcon, 
  IonItem, 
  IonLabel, 
  IonList, 
  IonLoading, 
  IonMenuButton, 
  IonPage, 
  IonPicker, 
  IonPickerColumn, 
  IonRow, 
  IonSegment, 
  IonSegmentButton, 
  IonSelect, 
  IonSelectOption, 
  IonTextarea, 
  IonTitle, 
  IonToast, 
  IonToolbar,
  useIonViewDidEnter,
  useIonViewDidLeave,
  useIonViewWillEnter,
  useIonViewWillLeave,

 } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router';
import './EditMedicalAppointment.css';
import { useAuth, useAuthInit } from './../auth'
import { auth as firebaseAuth } from './../firebase';
import { 

  arrowBackOutline,
  arrowBackSharp,
  addOutline,
  addSharp

} from 'ionicons/icons';

import MyFamilyMemberPicker from '../components/SingleDataPicker'
import { PickerColumn } from "@ionic/core";


import { ALERT_SHOW_DURATION_MS } from './../env'
import { db } from './../firebase'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import { DoctorAppointment } from '../models';

interface EditMedicalAppointmentParams {
  id : string;
}
const EditMedicalAppointment : React.FC = () => {

  const history = useHistory();

  const { id } = useParams<EditMedicalAppointmentParams>();

  const { loggedIn, userId } = useAuth();
  const { loading, auth } = useAuthInit();

  const [ error, setError] = useState<string>('')
  const [ status, setStatus] = useState<string>('')
  const [ dataLoading, setDataLoading] = useState<boolean>(true)

  const [ owner, setOwner ] = useState<any>(undefined)
  const [ familyMembersList, setFamilyMembersList ] = useState<any>(undefined)
  const [ doctorsList, setDoctorsList ] = useState<any>(undefined)
  const [ availableSlots, setAvailableSlots ] = useState<any>(undefined)


  const [ familyMember, setFamilyMember] = useState<string>('');
  const [ selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [ appointmentDate, setAppointmentDate] = useState<string>('');
  const [ appointmentSlot, setAppointmentSlot] = useState<string>('');
  const [ appointmentStatus, setAppointmentStatus] = useState<string>('');
  const [ appointmentDetails, setAppointmentDetails ] = useState<string>('');

  const [ selectedAppointment, setSelectedAppointment] = useState<DoctorAppointment>();
  
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
        setFamilyMembersList(family_members);
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
        const keys = Object.keys(appointments);
        for(var i = 0; i < keys.length; i++) {
          const k = keys[i];
          if(k == id) {
            const appt = appointments[k] as DoctorAppointment;
            setFamilyMember(appt.name);
            setSelectedDoctor(appt.doctor);
            setAppointmentDate(appt.appointment_date);
            setAppointmentSlot(appt.appointment_slot);
            setAppointmentStatus(appt.status);
            setAppointmentDetails(appt.appointment_details);
            appt.family_member_details = getItemDetailsById(family_member_list_local, appt.name)
            appt.doctor_details = getItemDetailsById(doctors_list, appt.doctor)

            setSelectedAppointment(appt);
            break;
          }
        }
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

  useEffect( () => {
    console.log('Doctor value changed to:', selectedDoctor);
    loadSelectedDoctorsAvailableSlots()
  }, [ selectedDoctor]);

  const customActionSheetOptionsForFamilyMember = {
    header: 'Select the family member',
    subHeader: ''
  };
  const customActionSheetOptionsForDoctor = {
    header: 'Select the Doctor',
    subHeader: ''
  };

  const customActionSheetOptionsForSlot = {
    header: 'Select the Slot',
    subHeader: ''
  };

  const loadSelectedDoctorsAvailableSlots = function() {
    console.log('Loading the slots based on the selected doctor:' + selectedDoctor);
    var slots:any = []
    if(doctorsList == undefined || doctorsList.length <= 0 || selectedDoctor == undefined || selectedDoctor.length <= 0) {
      console.log('Selected doctor / doctor list is not available')
      setAvailableSlots(slots);
      return;
    }
    
    doctorsList?.forEach(function(d:any) {
      if(d.id == selectedDoctor) {
        const pref_slots = d['preferred_slots']
        // console.log('Pref slot', pref_slots);
        const keys = Object.keys(pref_slots);
        keys.forEach(function(k:string){
          // console.log('Slot', pref_slots[k]);
          slots.push(pref_slots[k]);
        })
        setAvailableSlots(slots);
      }
    })
  }

  const goBack = () => {
    return <Redirect to="/my/doctorappointments/list" />
  }

  const editDoctorAppointment = () => {
    setError('')
    console.log("Editing appointment...");
    if(familyMember.trim().length <= 0) {
      setError('Family member cannot be empty');
      return;
    }
    if(selectedDoctor.trim().length <= 0) {
      setError('Doctor cannot be empty');
      return;
    }
    if(appointmentDate.trim().length <= 0) {
      setError('Appointment Date cannot be empty');
      return;
    }
    if(appointmentSlot.trim().length <= 0) {
      setError('Appointment Slot cannot be empty');
      return;
    }
    if(appointmentDetails.trim().length <= 0) {
      setError('Appointment Details cannot be empty');
      return;
    }

    const now = dayjs().startOf('day');
    const selectedAppointmentDate = dayjs(appointmentDate).startOf('day');
    if(selectedAppointmentDate.isBefore(now)) {
      setError('Appointment Date cannot be in past');
      return;
    }

    setDataLoading(true);

    const appointment_ref = db.ref(`Users/${userId}/doctor_appointments/${id}`);
    appointment_ref.set({
      id: id,
      name: familyMember,
      doctor: selectedDoctor,
      appointment_date : appointmentDate,
      appointment_slot : appointmentSlot,
      status : appointmentStatus,
      appointment_details : appointmentDetails
    }).then(()=>{
      setDataLoading(false);
      setStatus("Successfully edited the appointment...");
      setTimeout(function() {
          history.push('/my/doctorappointments/list');
      }, ALERT_SHOW_DURATION_MS + 500) //allow the success status msg to be displayed  
    }).catch((ex) => {
      setDataLoading(false);
      console.log('Error while editing the doctor appointment', ex)
      setError('Error while editing the doctor appointment');
    });
  }

  if(! loggedIn) {
    console.log('Me in Edit Medical appointment page. But flag is:', loggedIn)
    return <Redirect to="/login" />
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton  routerLink="/my/doctorappointments/list">
              <IonIcon slot="start" icon={arrowBackSharp} />
            </IonButton>
          </IonButtons>
          <IonTitle>My Doctor Appointments</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent class="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol className="ion-text-center">
              <IonLabel className="page-sub-heading">Edit Appointment</IonLabel>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonList lines="inset">
          <IonItem lines="inset">
            <IonLabel position="stacked">Family Member</IonLabel>
            <IonSelect value={familyMember} placeholder="Select the Family Member" 
              interfaceOptions={customActionSheetOptionsForFamilyMember}
              interface="action-sheet"
              onIonChange={(e) => {
                setFamilyMember(e.detail.value)
              }}
            >
              {
                familyMembersList && familyMembersList.map((member:any) => (
                  <IonSelectOption key={member.id} value={member.id}>
                    {member.name}
                  </IonSelectOption>
                ))
              }

            </IonSelect>
          </IonItem>   
          <IonItem lines="inset">
            <IonLabel position="stacked">Doctor</IonLabel>
            <IonSelect value={selectedDoctor} placeholder="Select the Doctor" 
              interfaceOptions={customActionSheetOptionsForDoctor}
              interface="action-sheet"
              onIonChange={(e) => {
                setSelectedDoctor(e.detail.value);
              }}
            >
              {
                doctorsList && doctorsList.map((member:any) => (
                  <IonSelectOption key={member.id} value={member.id}>
                    {member.name}
                  </IonSelectOption>
                ))
              }

            </IonSelect>
          </IonItem>   
          <IonItem lines="inset">
            <IonLabel position="stacked">Appointment Date:</IonLabel>
            <IonDatetime displayFormat="DD/MMM/YYYY" 
              value = {appointmentDate}
              onIonChange={ (event) => { 
                setAppointmentDate(dayjs(event.detail.value as string).format('DD/MMM/YYYY'))
              }}
            ></IonDatetime>
          </IonItem>
          <IonItem lines="inset">
            <IonLabel position="stacked">Slot</IonLabel>
            <IonSelect value={appointmentSlot} placeholder="Select the Slot" 
              interfaceOptions={customActionSheetOptionsForSlot}
              interface="action-sheet"
              onIonChange={(e) => {
                setAppointmentSlot(e.detail.value)
              }}
            >
              {
                availableSlots && availableSlots.map((slot:string) => (
                  <IonSelectOption key={slot} value={slot}>
                    {slot}
                  </IonSelectOption>
                ))
              }

            </IonSelect>
          </IonItem>
          <IonItem lines="inset">
            <IonLabel >Status</IonLabel>
            <IonLabel slot="end" class="ion-text-uppercase ion-float-right" id="edit_appointment_status_value" color="primary">{appointmentStatus}</IonLabel>
          </IonItem>
          <IonItem lines="inset">
            <IonLabel position="stacked">Details</IonLabel>
            <IonTextarea placeholder="Description for appointment such as: fever, cough...etc" value={appointmentDetails} 
              onIonChange={e => setAppointmentDetails(e.detail.value!)}></IonTextarea>
          </IonItem>
        </IonList>
        <div className="page-buttonbar ion-text-center">
          <IonButton color="success" onClick={editDoctorAppointment}>Save</IonButton>
          <IonButton color="light" routerLink="/my/doctorappointments/list">Cancel</IonButton>
        </div>
        <IonToast
          isOpen={error.length > 0}
          onDidDismiss={() => setError("")}
          message={error}
          duration={ALERT_SHOW_DURATION_MS}
        />
        <IonToast
          isOpen={status.length > 0}
          onDidDismiss={() => setStatus("")}
          message={status}
          duration={ALERT_SHOW_DURATION_MS}
        />
        {/* <MyFamilyMemberPicker
          isOpen={familyPickerOpen}
          columnData={familyMembersList!}
          onCancel={() => {
            setFamilyPickerOpen(false)
          }}
          onSave={(value:any) => {
            console.log('Selected family member details', value)
            setFamilyMemeber(value.selected_data.text)
            setFamilyPickerOpen(false)
          }} 
          />*/}
      </IonContent>
      {
          dataLoading ? <IonLoading  isOpen /> : ""
      }
    </IonPage>
  );
};

export default EditMedicalAppointment;
