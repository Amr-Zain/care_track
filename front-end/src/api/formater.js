//import crypto from 'crypto';

import { nanoid } from "@reduxjs/toolkit"

const formate = ( user) =>{
    return {
        ...user,
        id: nanoid(12),
    }
}

const formateWithDate = (obj) =>{
    return {
        ...obj,
        id:nanoid(12),
        date: Date.now()
    }
}
const formateDonationRequest = ({ patientId, city, governorate,bloodType,requiredDonaters }) =>{
    return {
        id : nanoid(12),
        patientId,
        city,
        governorate,
        bloodType,
        requiredDonaters,
        donators: [],
        date :Date.now()
    }
}

export { formate, formateWithDate, formateDonationRequest} 