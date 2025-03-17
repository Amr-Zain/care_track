import { BloodDonator } from "../../schema/blood-bank";
import { BloodRequest, Clinic, ClinicSchedule } from "./../../schema";

export default interface BloodBankDAO  {
    createBloodRequest:  (bloodRequest: BloodRequest ) => Promise<void>;
    deleteBloodRequest: (id: string) => Promise<void>;
    getBloodRequest:  (id: string) => Promise<BloodDonator>;
    updateBloodRequest: (bloodRequest: BloodRequest) => Promise<void>;
    listUserBloodRequests: (userId: string) =>Promise<BloodRequest[]>;
}