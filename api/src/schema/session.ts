import {  object, string, mixed } from "yup";

export default interface Session {
    id : string;
    userId : string;
    userType: number;
    valid : boolean;
    userAgent : string;
    createdAt : Date| string;
    lastAccess : Date| string;
}
export const createUserSessionSchema = object({
    body: object({
        password: string().min(6,'password has to be at least 6 digits')
                .max(20,'password must be less than 20 digits')
                .required('password is required'),
        email: string()
            .email("Must be a valid email")
            .required("Email is required"),
    }),
});   