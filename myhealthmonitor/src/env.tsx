import { FilesystemDirectory } from '@capacitor/core'

export const APP_VERSION="1.0.1"
export const APP_NAME="My Health Monitor"

export const ALERT_SHOW_DURATION_MS = 500;
export const APP_FOLDERS_FILES_CONFIG = {
    'ROOT_FOLDER' : FilesystemDirectory.Data,
    'PROFILE_FOLDER' : 'profiles/',
    'DATA_FOLDER_NAME' : "mhm/data/",
    'FAMILY_DATA_FILE' : "family_details.json",
    'DEVICE_DATA_FILE' : "device_details.json",
    'MEDICAL_RECORDS_DATA_FILE' : "medical_record_details.json",
    'DOCTOR_APPOINTMENTS_DATA_FILE' : "doctor_appointment_details.json"
}
