import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import { Redirect, useParams } from 'react-router';
import './FileTestPage.css';
import { useAuth } from './../auth'
import { 

  arrowBackOutline,
  arrowBackSharp

} from 'ionicons/icons';


import { File }  from '@ionic-native/file';
// import { useFilesystem  } from '@ionic/react-hooks/filesystem'

import { isDirExists, mkDir, rmDir, listFilesFromDir, writeFile, readFile, deleteFile, isFileExists }  from './../FileUtils'
import { APP_FOLDERS_FILES_CONFIG } from './../env'
import { DataHandler } from './../DataHandler'

const FileTestPage: React.FC = () => {

  // const { name } = useParams<{ name: string; }>();
  const [error, setError] = useState<string>('')

  const [family, setFamily] = useState<DataHandler>(new DataHandler('Family', APP_FOLDERS_FILES_CONFIG.DATA_FOLDER_NAME,  APP_FOLDERS_FILES_CONFIG.FAMILY_DATA_FILE));
  

  const [result1, setResult1] = useState<string>('')
  const [result2, setResult2] = useState<string>('')
  const [result3, setResult3] = useState<string>('')
  const [result4, setResult4] = useState<string>('')
  const [result5, setResult5] = useState<string>('')
  const [result6, setResult6] = useState<string>('')

  // const File = useFilesystem();

  const test1 = async () => {
    setError('');

    const r = await isDirExists(APP_FOLDERS_FILES_CONFIG.DATA_FOLDER_NAME);
    setResult1("Valid dir availability:" + r);
  }

  const test2 = async () => {
    setError('');
    const r = await mkDir(APP_FOLDERS_FILES_CONFIG.DATA_FOLDER_NAME);
    setResult1("Make Dir result is:" + r);
  }

  const test3 = async () => {
    setError('');
    const r = await rmDir(APP_FOLDERS_FILES_CONFIG.DATA_FOLDER_NAME);
    setResult1("Remove Dir result is:" + r);
  }
  
  const test4 = async () => {
    setError('');
    const r = await listFilesFromDir(APP_FOLDERS_FILES_CONFIG.DATA_FOLDER_NAME);
    if(r == undefined) {
      console.log('Error while reading the files.');
      setError('Error while reading the files.');
      return;
    }
    setResult1("Number of files:" + r?.files.length);
  }
  const test5 = async () => {
    setError('');
    const r = await writeFile(APP_FOLDERS_FILES_CONFIG.DATA_FOLDER_NAME, APP_FOLDERS_FILES_CONFIG.FAMILY_DATA_FILE, "Sample data file");
    if(r == undefined) {
      console.log('Error while creating the file.');
      setError('Error while creating the file.');
      return;
    }
    setResult1("Created file:" + r.uri);
  }

  const test6 = async () => {
    setError('');
    const r = await readFile(APP_FOLDERS_FILES_CONFIG.DATA_FOLDER_NAME, APP_FOLDERS_FILES_CONFIG.FAMILY_DATA_FILE);
    if(r == undefined) {
      console.log('Error while reading the file.');
      setError('Error while reading the file.');
      return;
    }
    setResult1("File Data:" + r.data);
  }

  const test7 = async () => {
    setError('');
    const r = await deleteFile(APP_FOLDERS_FILES_CONFIG.DATA_FOLDER_NAME, APP_FOLDERS_FILES_CONFIG.FAMILY_DATA_FILE);
    if(r == undefined) {
      console.log('Error while deleting the file.');
      setError('Error while deleting the file.');
      return;
    }
    setResult1('File deleted');
  }

  const test8 = async () => {
    setError('');
    const r = await isFileExists(APP_FOLDERS_FILES_CONFIG.DATA_FOLDER_NAME, APP_FOLDERS_FILES_CONFIG.FAMILY_DATA_FILE);
    setResult1('File Exists:' + r);
  }

  const test9 = async () => {
    setError('');
    try {
      family?.init()
      // if(family?.error.length <= 0) {
      //   setResult1('Init Result: OK');
      // } else {
      //   setError(family?.error);
      // }
    } catch(err) {
      setError("Failed to initialize. Error:" + err)
    }
  }

  const test10 = async () => {
    setError('');
    try {
      var fam = {
        "name" : "User1",
        "dob" : "14/05/1978",
        "is_head_of_family" : 0
      }
      console.log('after load', family?.json)
      family?.add(fam);
      // if(family?.error?.length? <= 0) {
      //   setResult1('Add Family result: OK');
      // } else {
      //   setError(family?.error?);
      // }
    } catch(err) {
      setError("Failed to add family Error:" + err)
    }
  }

  const test11 = async () => {
    setError('');
    try {
      setResult1("Family list:" + JSON.stringify(family?.json));
    } catch(err) {
      setError("Failed to list family Error:" + err)
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>File Tests</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent class="ion-padding">
        <IonList>
          <IonItem>
            <IonButton expand="block" onClick={test1}>Check Valid exists or not</IonButton>
          </IonItem>
          <IonItem>
            <IonButton expand="block" onClick={test2}>Make Dir</IonButton>
          </IonItem>
          <IonItem>
            <IonButton expand="block" onClick={test3}>Remove Dir</IonButton>
          </IonItem>
          <IonItem>
            <IonButton expand="block" onClick={test4}>Read Dir</IonButton>
          </IonItem>
          <IonItem>
            <IonButton expand="block" onClick={test5}>Create File</IonButton>
          </IonItem>
          <IonItem>
            <IonButton expand="block" onClick={test6}>Read File</IonButton>
          </IonItem>
          <IonItem>
            <IonButton expand="block" onClick={test7}>Delete File</IonButton>
          </IonItem>
          <IonItem>
            <IonButton expand="block" onClick={test8}>File Exists ?</IonButton>
          </IonItem>
          <IonItem>
            <IonButton expand="block" onClick={test9}>Family Init</IonButton>
          </IonItem>
          <IonItem>
            <IonButton expand="block" onClick={test10}>Add Family</IonButton>
          </IonItem>
          <IonItem>
            <IonButton expand="block" onClick={test11}>List Family</IonButton>
          </IonItem>
          <IonItem>
            <IonLabel className="ion-text-wrap" color="danger">{error}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel className="ion-text-wrap">{result1}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel className="ion-text-wrap">{result2}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel className="ion-text-wrap">{result3}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel className="ion-text-wrap">{result4}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel className="ion-text-wrap">{result5}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel className="ion-text-wrap">{result6}</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default FileTestPage;
