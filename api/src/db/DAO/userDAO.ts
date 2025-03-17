import { Rating, User } from "./../../schema";

export default interface UserDAO  {
    createUser: (user: User) => Promise<void>;
    getUserById: (userId: string) => Promise<User | null>;
    getUserByEmail: (email: string) => Promise<User | null>;
    getUserByPhone: (phone: string|number) => Promise<User | null>;
    updateUser:(user: User) => Promise<void>;
    updateUserImage:(url: string,userId: string) => Promise<void>;
    resetPassword:(userId: string, password: string) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
    rateDoctorNurse: (ratedId: string, patientId: string, value: number,comment: string)=>Promise<void>;
    listRating: (id: string)=>Promise<Rating>;
}