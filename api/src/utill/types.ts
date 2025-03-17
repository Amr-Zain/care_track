import { Request } from 'express'
/* import { Doctor, Nurse } from "../schema";
export interface searchDoctorsResult {
    data: Doctor[],
    count: number
}
export interface searchDoctorFilter {
    specialization: string;
    name: string;
    city: string;
    limit:number;
    page:number;
    gender:[0,1,2];
    sort:[0,1,2,3];
    day:[0,1,2];
}

export interface searchNerseResultsResult {
    data: Nurse[],
    count: number
}
export interface searchNersesFilter {
    name: string;
    city: string;
    limit:number;
    page:number;
    gender:[0,1,2];
    sort:[0,1,2,3];
    day:[0,1,2];
} */

import { User } from "../schema";
import { ModelStatic } from 'sequelize';
import UserModle from '../models/user'; // Assuming user.model.ts is in the same directory
import Appointment from '../models/appointment'; // Add other model imports
import Receptionist from '../models/receptionist';
import Clinic from '../models/clinic';
import ClinicSchedule from '../models/clinic_schedule';
import Blood from '../models/blood';
import Diagnosis from '../models/diagnosis';
import DoctorNurse from '../models/doctor_nurse';
import Medicine from '../models/medicine';
import Rating from '../models/rating';
import Session from '../models/session';

export interface AllModels {
  User: ModelStatic<UserModle>;
  Appointment: ModelStatic<Appointment>;
  Receptionist: ModelStatic<Receptionist>;
  Clinic: ModelStatic<Clinic>;
  ClinicSchedule: ModelStatic<ClinicSchedule>;
  Blood: ModelStatic<Blood>;
  Diagnosis: ModelStatic<Diagnosis>;
  DoctorNurse: ModelStatic<DoctorNurse>;
  Medicine: ModelStatic<Medicine>;
  Rating: ModelStatic<Rating>;
  Session: ModelStatic<Session>;
}


const type = [1, 2, 3,4,] as const;
export type UserType = typeof type[number];

export interface RequestWithUserSession extends Request
{
    user :User & {sessionId :string};
}