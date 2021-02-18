// import Menu from './components/Menu';
import React, { useEffect, useState } from 'react';
import { IonApp, IonLoading, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import LandingGridPage from './pages/LandingGridPage';

import RegisterUserPage from './pages/RegisterUserPage'
import FamilyPage from './pages/FamilyPage'
import DevicesPage from './pages/DevicesPage'
import LogoutPage from './pages/LogoutPage'
import FileTestPage from './pages/FileTestPage'

import NewRecord from './pages/NewRecord'
import NewFamilyMember from './pages/NewFamilyMember'

import EditFamilyMember from './pages/EditFamilyMember'

import NewDevice from './pages/NewDevice'
import NewMedicalAppointment from './pages/NewMedicalAppointment'



import DoctorAppointmentsPage from './pages/DoctorAppointmentsPage'

import { AuthContext, useAuthInit } from './auth';
import NotFoundPage from './pages/NotFoundPage';
import LoginWithPhonePage from './pages/LoginWithPhonePage';
import { DataHandler } from './DataHandler'
import { APP_VERSION, APP_NAME, APP_FOLDERS_FILES_CONFIG } from './env';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faMale, faFemale } from '@fortawesome/free-solid-svg-icons';
import { librarySharp } from 'ionicons/icons';

import { db } from './firebase'
import SetOwnerProfile from './pages/SetOwnerProfile';
import RecordsPage from './pages/RecordsPage';

// import { auth } from './firebase';

library.add(faFemale, faMale)

const App: React.FC = () => {

 const { loading, auth } = useAuthInit();
  // const authState = useAuthInit();

  // const [family, setFamily] = useState<DataHandler>(new DataHandler('Family', APP_FOLDERS_FILES_CONFIG.DATA_FOLDER_NAME,  APP_FOLDERS_FILES_CONFIG.FAMILY_DATA_FILE));
  // const [devices, setDevices] = useState<DataHandler>(new DataHandler('Devices', APP_FOLDERS_FILES_CONFIG.DATA_FOLDER_NAME,  APP_FOLDERS_FILES_CONFIG.DEVICE_DATA_FILE));
  // const [doctorAppointments, setDoctorAppointments] = useState<DataHandler>(new DataHandler('Doctor Appointments', APP_FOLDERS_FILES_CONFIG.DATA_FOLDER_NAME,  APP_FOLDERS_FILES_CONFIG.DOCTOR_APPOINTMENTS_DATA_FILE));
  const [ medicalRecords, setMedicalRecords] = useState<DataHandler>(new DataHandler('Medical Records', APP_FOLDERS_FILES_CONFIG.DATA_FOLDER_NAME,  APP_FOLDERS_FILES_CONFIG.MEDICAL_RECORDS_DATA_FILE));
  const [ ownerMissing, setOwnerMissing ] = useState(false);


  useEffect(() => {
    if(auth?.loggedIn) {

      if(auth.userData == undefined) {
        console.log('User Data is missing')
        setOwnerMissing(true);
      } else {
        console.log('User data is available. Redirect to landing pages.')
        setOwnerMissing(false);
      }
      medicalRecords.init();
      //+ auth?.userId

    }
  }, [auth])
  if(loading) {
    console.log('Loading is inprogress...')
    return <IonLoading isOpen />
  } else {



  }
  

  console.log('Rendering the app with auth', auth);

  return (

    <IonApp>

      <AuthContext.Provider value={auth!}>

        <IonReactRouter>

          <Switch>

            <Route exact path="/login">
              {/* <LoginPage /> */}
              <LoginWithPhonePage />
            </Route>

            <Route exact path="/page/Logout">
              <LogoutPage />
            </Route>
            
            <Route exact path="/register">
              <RegisterUserPage />
            </Route>

            <Route exact path="/my/landing">
              <LandingGridPage />
            </Route>

            <Route exact path="/my/records/list">
              <RecordsPage data={medicalRecords} />
            </Route>
            <Route exact path="/my/records/add">
              <NewRecord  data={medicalRecords}/>
            </Route>

            <Route exact path="/my/family/list">
              <FamilyPage  />
            </Route>
            <Route exact path="/my/family/edit/:selected_name">
              <EditFamilyMember  />
            </Route>
            <Route exact path="/my/family/add">
              <NewFamilyMember  />
            </Route>

            <Route exact path="/my/devices/list">
              <DevicesPage />
            </Route>
            <Route exact path="/my/devices/add">
              <NewDevice />
            </Route>

            <Route exact path="/my/doctorappointments/list">
              <DoctorAppointmentsPage />
            </Route>
            <Route exact path="/my/doctorappointments/add">
              <NewMedicalAppointment  />
            </Route>

            <Route exact path="/my/ownerprofile/:id">
              <SetOwnerProfile />
            </Route>

            <Route exact path="/filetest">
              <FileTestPage />
            </Route>


            {/* <Redirect exact path="/" to="/filetest" /> */}
            <Redirect exact path="/" to="/login" />
            {
              ownerMissing ? <Redirect  to="/my/ownerprofile/`${auth.userId}`"/> 
                            : <Redirect  to="/my/landing"/>
            }
            <Route>
              <NotFoundPage />
            </Route>

          </Switch>
        </IonReactRouter>
      </AuthContext.Provider>
    </IonApp>
  );
};

export default App;
