import { object, string, mixed, number, bool } from "yup";
import { UserType } from "../utill/types";

export default interface User {
    id : string;
    userType : UserType;
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
    city: string;
    image: string;
    gender: boolean;
    birthday: Date;
    password: string;
    createdAt: Date;
}
export const createUserSchema = object({/* date validation not working errors not sent back to the user */
    body:object({
        firstName: string().required('firstName is required'),
        lastName: string().required('lastName is required'),
        email : string().email('must be a valid email').required('email is reqired'),
        phone: string().matches(/^01[0125][0-9]{8}$/, 'Phone number is not valid').required('phone is reqired'),
        city: string().required('city is required'),
        birthday: number().required('birthday is required'),
        password: string().min(6,'password has to be at least 6 digits').max(20,'password must be less than 20 digits').required('password is required'),
        userType:  mixed().required('userType is required')
        .oneOf([1,2,3,4,'1','2','3','4']) ,
        gender: bool()
    })
});
export const postUserImageSchema = object({
    file: mixed()
      .required('An image file is required.')
      .test('fileSize', 'File Size is too large', (value: any) => {
        if (!value) return true; // Skip if no file
        return value.size <= 2 * 1024 * 1024; // 2MB limit (adjust as needed)
      })
      .test('fileType', 'Unsupported File Format', (value: any) => {
        if (!value) return true; // Skip if no file
        return ['image/jpeg', 'image/png', 'image/gif'].includes(value.mimetype); // Allowed types
      }),
  });