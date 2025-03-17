import { bool, number, object, string } from "yup"
import { User } from ".";

export default interface Receptionist extends User{
    receptionistId :string;
    clinicId :string;
    doctorId :string
}

const body = object({
    firstName: string().required('firstName is required'),
    lastName: string().required('lastName is required'),
    email : string().email('must be a valid email').required('email is reqired'),
    phone: string().matches(/^01[0125][0-9]{8}$/, 'Phone number is not valid').required('phone is reqired'),
    city: string().required('city is required'),
    clinicId: string().required('clinicId is required'),
    birthday: number().required('birthday is required'), 
    gender: bool().required('gender is required')
})
export const createreceptionistSchema = object({
    body,
    params: object({
        clinicId: string().required('clinicId is required')
    })
});
export const updatereceptionistSchema = object({
    body
})
export const getreceptionistSchema = object({
    params :object({
        receptionistId: string().required('receptionistId is required')
    })
})
export const deletereceptionistSchema = object({
    params :object({
        id: string().required('clinicId is required'),
        receptionistId: string().required('receptionistId is required')
    })
})