
export interface FamilyMemberDetails {
    id: string,
    name: string;
    dob : string;
    gender: string;
    profile_pic : string;
}

export interface DoctorDetails {
    id: string,
    name: string;
    preferred_slots: any;
    profile_pic : string;
    address : string;
    phone: string;
}

export interface DoctorAppointment {
    id: string,
    name: string;
    doctor: string
    appointment_date: string;
    appointment_slot: string;
    family_member_details? : any;
    doctor_details? :any;
    appointment_details: string;
    status: string;
}