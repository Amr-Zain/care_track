
import { User, Diagnosis,DoctorNurseAppointment, Appointment,PatientAppointment,Medicine,Session, Clinic, Receptionist, ClinicSchedule, BloodRequest  } from "../../schema";
import {  DoctorData, NurseData, NurseFullData, DoctorFullData, Rating  } from "../../schema/doctor-nurse";

import AppointmentDAO from "../DAO/appointmentDAO";
import DiagnosisDAO from "../DAO/diagnosisDAO";
import DoctorNurseDAO from "../DAO/doctorNurseDAO";
import ReceptionistDAO from "../DAO/receptionistDAO";
import UserDAO from "../DAO/userDAO";
import SessionDAO from "../DAO/sessionDAO";
import ClinicDAO from "../DAO/clinicDAO";
import BloodBankDAO from "../DAO/blood-bankDAO";
import { BloodDonator } from "../../schema/blood-bank";
import db from '../../models';
import sequelize from "sequelize";
import { DiagnosisWithDoctorInfo } from "../../schema/diagnosis";
import { ClinicWithSchedule } from "../../schema/clinic";


class Datastore implements UserDAO, AppointmentDAO, DiagnosisDAO,ClinicDAO,
        DoctorNurseDAO,ReceptionistDAO,SessionDAO, BloodBankDAO{
    private db;    
    async createUser(user: User): Promise<void>{
        await db.User.create(user);
    }
    async getUserByPhone(phone: string| number): Promise<User| null>{
        return (await db.User.findOne({ where: { phone: phone } }))?.toJSON();
    }
    async getUserById(userId: string):Promise< User | null >{
        return (await db.User.findByPk(userId))?.toJSON();
    }
    async getUserByEmail(email: string):Promise< User | null >{
        return (await db.User.findOne({ where: { email: email } }))?.toJSON();
    } 
    async patientInfo(id: string):Promise<{name: string, birthDay:Date, image: string, email: string}|null>{
        id
        const patientInfo = db.User.findOne({
            attributes: [
                'id', 
                'birthday',
                'image',
                'email',
                [sequelize.fn('CONCAT', sequelize.col('firstName'), sequelize.literal("' '"), sequelize.col('lastName')), 'name'],
            ],
            where:{id},
            raw:true
        });
        return patientInfo as unknown as {name: string, birthDay:Date, image: string, email: string};
    }
    async updateUser(user: User):Promise<void>{
        await db.User.update(user, { where: { id: user.id } });
    }
    async updateUserImage(url: string, userId: string) : Promise<void>{
        await db.User.update({ image: url }, { where: { id: userId } });
    }
    async resetPassword(userId: string, password: string) : Promise<void>{
        await db.User.update({ password: password }, { where: { id: userId } });
    }
    async deleteUser(userId: string):Promise<void>{
        await db.User.destroy({ where: { id: userId } });
    }
    async rateDoctorNurse (ratedId: string, patientId: string,value: number,comment: string):Promise<void>{
        await db.Rating.create({ ratedId, patientId, rating: value, comment });

    }
    async listRating (id: string):Promise<Rating>{
        return await db.Rating.findOne({
            where: { ratedId: id },
            include: [{ model: db.User, as: 'patient' }]
          });
    }
    async createAppointment (appointment: Appointment) : Promise<void>{
        await db.Appointment.create(appointment);
    }
    async getAppointmentById (appointmentId: string): Promise<Appointment |null>{
        console.log('appointmentId',appointmentId)
        return (await db.Appointment.findByPk(appointmentId))?.toJSON(); 
    }
    async appointmentExist (doctorId: string,patientId: string,date:Date): Promise<Appointment>{
        const app = await db.Appointment.findOne({
            attributes: [
                'id',
                'date',
                'patientId',
                'clinicId',
                'nurseId',
                'bookedAt',
                [sequelize.col('clinic.doctorId'), 'doctorId'],
                [sequelize.col('clinic.id'), 'clinicId'],
            ],
            include: [
                {
                    model: db.Clinic,
                    as: 'clinic',
                    required:true,
                    attributes: [],
                    where: {
                        doctorId,
                    },
                },
            ],
            where: {
                patientId,
                date: {
                    [sequelize.Op.gte]: date,
                },
            },
            raw: true,
        }

        );
        return app;
    }
    async listPatientAppointment (patientId: string): Promise<PatientAppointment[] |null>{
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const appointments = await db.Appointment.findAll({
            attributes:[
                'id',
                'date',
                'patientId',
                'clinicId',
                'nurseId',
                'bookedAt',
                [sequelize.col('clinic.location'), 'location'],
                [sequelize.col('clinic.doctorId'), 'doctorId'],
            ],
            include: [
                {
                    model: db.Clinic,
                    as: 'clinic',
                    attributes:[],
                    required:false,
                }],
            where:{ patientId},
            raw:true
        })

        const appsWithDoctorNurse = Promise.all(appointments.map((async(app)=>{
            if(app.nurseId){
                const nurse = await this.getNurse(app.nurseId);
                return({...app,...nurse,id:app.id})
            }else{
                const day = new Date(app.date).getDay();
                console.log(day)
                const fromTo = await db.ClinicSchedule.findOne({attributes:['from','to'],where:{day,clinicId:app.clinicId}, raw:true})
                const doctor = await this.getDoctor(app.doctorId);
                return({...doctor,...app,...fromTo})
            }
        })));
        
      
        return <PatientAppointment[]><unknown>appsWithDoctorNurse;
   
    }
    async getPatientAppointment (appointmentId: string): Promise<PatientAppointment|null>{
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const app = await db.Appointment.findOne({
            attributes:[
                'id',
                'date',
                'patientId',
                'clinicId',
                'nurseId',
                'bookedAt',
                [sequelize.col('clinic.location'), 'location'],
                [sequelize.col('clinic.doctorId'), 'doctorId'],
            ],
            include: [
                {
                    model: db.Clinic,
                    as: 'clinic',
                    attributes:[],
                    required:false,
                }],
            where:{ id:appointmentId},
            raw:true
        })

        const appsWithDoctorNurse = (async()=>{
            if(app.nurseId){
                const nurse = await this.getNurse(app.nurseId);
                return({...app,...nurse,id:app.id})
            }else{
                const day = new Date(app.date).getDay();
                const fromTo = await db.ClinicSchedule.findOne({attributes:['from','to'],where:{day,clinicId:app.clinicId}, raw:true})
                const doctor = await this.getDoctor(app.doctorId);
                return({...doctor,...app,...fromTo})
            }
        })();
    
        return <PatientAppointment><unknown>appsWithDoctorNurse;
   
    }
    async listDoctorAppointment (doctorId: string, date: Date): Promise<DoctorNurseAppointment[]>{
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(),23,59,59,999);
        const appointments = (await db.Appointment.findAll({
            attributes: [
                'id',
                'date',
                'patientId',
                'clinicId',
                'nurseId',
                'bookedAt',
                [sequelize.col('clinic.location'), 'location'],
                [sequelize.col('clinic.doctorId'), 'doctorId'],
                [sequelize.fn('CONCAT', sequelize.col('patient.firstName'), sequelize.literal("' '"), sequelize.col('patient.lastName')), 'patientName'],
                [sequelize.col('patient.email'), 'patientEmail'],
                [sequelize.col('patient.image'), 'patientImg'],
                [sequelize.col('patient.birthday'), 'patientBirthday'],
            ],
            include: [
                {
                    model: db.Clinic,
                    as: 'clinic',
                    attributes: [],
                    where: {
                        doctorId,
                    },
                },
                {
                    model: db.User,
                    as: 'patient',
                    attributes: [],
                },
            ],
            where: {
                date: {
                    [sequelize.Op.gte]: date,
                    [sequelize.Op.lte]: endOfDay,

                },
            },
            raw: true,
        }));
        return appointments as unknown as DoctorNurseAppointment[];
    }
    async listNurseAppoitment ( nurseId: string, date:Date): Promise<DoctorNurseAppointment[]>{
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(),23,59,59,999);
        const appointments = (await db.Appointment.findAll({
            attributes: [
                'id',
                'date',
                'patientId',
                'nurseId',
                'bookedAt',
                'date',
                [sequelize.fn('CONCAT', sequelize.col('patient.firstName'), sequelize.literal("' '"), sequelize.col('patient.lastName')), 'patientName'],
                [sequelize.col('patient.email'), 'patientEmail'],
                [sequelize.col('patient.image'), 'patientImg'],
                [sequelize.col('patient.birthday'), 'patientBirthday'],
            ],
            include: [
                {
                    model: db.User,
                    as: 'nurse',
                    attributes: [],
                    where: {
                        id: nurseId,
                    },
                },
                {
                    model: db.User,
                    as: 'patient',
                    attributes: [],
                },
            ],
            where: {
                date: {
                    [sequelize.Op.gte]: date,
                    [sequelize.Op.lte]: endOfDay,

                },
            },
            raw: true,
        }));
        return appointments as unknown as DoctorNurseAppointment[];
    }
    async getNursePatients ( id:string): Promise<number>{
        const count = db.Appointment.count({where:{ nurseId: id}})
        return count;
    }
    async deleteAppointment (id: string): Promise<void>{
        await db.Appointment.destroy({
            where: {
                id
            },
        });        
    }
    async  updateAppointmentDate (id: string, newDate: Date) : Promise<void>{
        await db.Appointment.update(
            { date: newDate },
            {
                where: {id}
            })
    }
    async createSession(session: Session): Promise<void>{
        await db.Session.create(session);
        
    }
    async getSessionById(sessionId: string): Promise<Session>{
        const session =  (await db.Session.findByPk(sessionId)).toJSON()
        return session;
    }
    async listUserValidsession(userId: string): Promise<Session[]>{
        const sessions = await db.Session.findAll({
            where: {
              userId: userId,
              valid: 1,
            },
            raw:true
          });
        return sessions.map(s=>s.toJSON());
    }
    async invalidateSession(sessionId: string): Promise<void>{
        await db.Session.update({ valid: false }, {
            where: {
                id: sessionId
            }
        });
    }
    async createDiagnosis({id, patientId, doctorId,date, clinicId, description, medicines}: Diagnosis): Promise<void>{
        await db.Diagnosis.create({id, patientId, doctorId,date, clinicId, description});
        await db.Medicine.bulkCreate(medicines);
    }
    async getDiagnosisById(diagnosisId: string): Promise<Diagnosis |null>{
        const diagnosis = await db.Diagnosis.findOne({
            attributes: [
                'id',
                'patientId',
                'doctorId',
                'clinicId',
                'date',
                'description',
                [sequelize.fn('CONCAT', sequelize.col('doctor.firstName'), sequelize.literal("' '"), sequelize.col('doctor.lastName')), 'doctorName'],
                [sequelize.col('doctor.image'), 'doctorImage'],
                [sequelize.col('DoctorNurse.specialization'), 'specialization'],
            ],
            include: [
                {
                    model: db.User,
                    as: 'doctor',
                    attributes: [],
                    required:true,
                    
                },{
                    model: db.DoctorNurse,
                    attributes: [],
                    as:'DoctorNurse',
                    required: true,
                },
            ],
            where: {id:diagnosisId},
            raw: true,
        });
        if(!diagnosis) return null
        const medicines = await db.Medicine.findAll({
            attributes: [
                'id',
                'dosage',
                'name',
                'duration',
                'description',
                [sequelize.col('diagnosis.date'), 'date'],
                ],
            where: {diagnosisId: diagnosisId},
            include: [
                {
                    model: db.Diagnosis,
                    as: 'diagnosis',
                    attributes: [],
                    required: true,
                },
            ],
            raw: true
        });
        diagnosis.medicines = medicines;
        return diagnosis;
    }
    async getPtinetDiagnosisSpecializations(patientId: string): Promise<{value: string,id:string}[]>{
        const specializations = await db.Diagnosis.findAll({
            attributes: [
                [sequelize.col('DoctorNurse.specialization'), 'value'],
                [sequelize.col('DoctorNurse.specialization'), 'label'],
            ],
            include: [
                {
                    model: db.User,
                    as: 'doctor',
                    attributes: [],
                    required:true,
                    
                },{
                    model: db.DoctorNurse,
                    attributes: [],
                    as:'DoctorNurse',
                    required: true,
                },
            ],
            where: {patientId},
            group:[sequelize.col('DoctorNurse.specialization')],
            raw: true,
        }) as unknown as {value: string,id:string}[];
        return specializations
    }
    async listPatientDiagnosis(patientId: string, specializations: string[]|string, date: Date, byDocotr: boolean, doctorId: string): Promise<DiagnosisWithDoctorInfo[]>{
        const whereClauseDiagnosis :{patientId:string,date?:unknown,doctorId?: string}= { patientId }
        if(byDocotr) whereClauseDiagnosis.doctorId = doctorId;
        if(date)whereClauseDiagnosis.date = {[sequelize.Op.gte] : date}

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const doctorSpeicaizationFilter: any = {};
        
        if(typeof specializations == 'string'){
            doctorSpeicaizationFilter.specialization ={[sequelize.Op.eq]: specializations}
        }else if(Array.isArray(specializations) && specializations.length > 0){
            doctorSpeicaizationFilter.specialization = { [sequelize.Op.in]: specializations };
        }
        console.log(specializations, doctorSpeicaizationFilter);
        const diagnoses = await db.Diagnosis.findAll({
            attributes: [
                'id',
                'patientId',
                'doctorId',
                'clinicId',
                'date',
                'description',
                [sequelize.fn('CONCAT', sequelize.col('doctor.firstName'), sequelize.literal("' '"), sequelize.col('doctor.lastName')), 'doctorName'],
                [sequelize.col('doctor.image'), 'doctorImage'],
                [sequelize.col('DoctorNurse.specialization'), 'specialization'],
            ],
            include: [
                {
                    model: db.User,
                    as: 'doctor',
                    attributes: [],
                    required:true,
                    
                },{
                    model: db.DoctorNurse,
                    attributes: [],
                    as:'DoctorNurse',
                    where: doctorSpeicaizationFilter,
                    required: true,
                },
            ],
            where: whereClauseDiagnosis,
            raw: true,
        });
        return diagnoses as unknown as DiagnosisWithDoctorInfo[];
    }

    async getDiagnosisMedicnes(diagnosisId: string, patientId: string): Promise<Medicine[]>{
        const medicines = await db.Medicine.findAll({
            attributes: [
                'id',
                'dosage',
                'duration',
                'name',
                'description',
                'diagnosisId',
                [sequelize.col('diagnosis.doctorId'), 'doctorId'],
                ],
                include: [
                {
                    model: db.Diagnosis,
                    as: 'diagnosis',
                    attributes: [],
                    where:{ patientId},
                    required: true,
                },
                ],
                where: {
                diagnosisId,
                },
                raw: true,
            });
        return medicines;
    }
    async getMedicine(medicineId: string): Promise<Medicine>{
        const medicine = await db.Medicine.findOne({
            attributes: [
                'id',
                'dosage',
                'duration',
                'name',
                'description',
                'diagnosisId',
                [sequelize.col('diagnosis.doctorId'), 'doctorId'],
                ],
                include: [
                {
                    model: db.Diagnosis,
                    as: 'diagnosis',
                    attributes: [],
                    required: true,
                },
                ],
                where: {
                id: medicineId,
                },
                raw: true,
            });
        return medicine;
    }
    async getPatientMedicies(patientId: string): Promise<Medicine[]>{
        const medicines = await db.Medicine.findAll({
            attributes:['id',
                        'dosage',
                        'duration',
                        'name',
                        'description',
                        'diagnosisId',
                        [sequelize.col('diagnosis.date'), 'date']
                        ],
            include: [
            {
                model: db.Diagnosis,
                as: 'diagnosis',
                where: { patientId },
                attributes:[],
                required: true,
            },
            ],
            where: sequelize.literal(
                `DATE_ADD(diagnosis.date, INTERVAL duration+3 DAY) >= CURDATE()`
            ),
            raw:true
        });
        return medicines;
    }
    async updateMedicine({id, name, dosage, duration, description }: Medicine): Promise<void>{
        await db.Medicine.update(
            {
                name,
                dosage,
                duration,
                description,
            },
            {
                where: {
                    id,
                },
            }
        );
    }
    async deleteMedicine(medicineId: string): Promise<void>{
        await db.Medicine.destroy({
            where: {
                id: medicineId,
            },
        });    
    }
    async listDiagnosisMedicines(diagnosisId: string): Promise<Medicine[]>{
        const medicines = await db.Medicine.findAll({
            where: {diagnosisId: diagnosisId},
            raw: true
        });
        return medicines;
    }
    async createDoctorNurseData(data: DoctorData | NurseData): Promise<void>{
        await db.DoctorNurse.upsert(data);
    }
    async getDoctor ( id:string) :Promise<DoctorFullData>{
        const doctor = await db.User.findOne({
            attributes: [
                'id',
                'email',
                'city',
                'image',
                'userType',
                [sequelize.fn('CONCAT', sequelize.col('firstName'), sequelize.literal("' '"), sequelize.col('lastName')), 'name'],
                [sequelize.col('DoctorNurse.fees'), 'fees'],
                [sequelize.col('DoctorNurse.description'), 'description'],
                [sequelize.col('DoctorNurse.appointmentTime'), 'appointmentTime'],
                [sequelize.col('DoctorNurse.specialization'), 'specialization'],
                [sequelize.fn('AVG', sequelize.col('ratedDoctorNurse.rating')), 'rating'], // Calculate average rating
            ],
            include: [
            {
                model: db.DoctorNurse,
                as: 'DoctorNurse',
                attributes:[],
                required: false,
            },
            {
                model: db.Rating,
                as:'ratedDoctorNurse',
                attributes: [], 
            },
            ],
            where: { id, userType: 2 }, 
            group: ['User.id'], 
            raw: true,
        })as unknown as DoctorFullData;
        if(doctor) doctor.clinics = await this.listDoctorClinics(doctor.id);
        return doctor 
    }
    async getDoctorPatientCount(id:string):Promise<number>{
        const count = await db.Appointment.count({
            include:{
                model: db.Clinic,
                as: 'clinic',
                attributes:[],
                required:true,
                where:{ doctorId:id}
            }
        });
        return count;
    }
    async getNurse ( id:string) :Promise<NurseFullData>{
        const nurse = await db.User.findOne({
                attributes: [
                'id',
                'email',
                'city',
                'image',
                'userType',
                [sequelize.fn('CONCAT', sequelize.col('firstName'), sequelize.literal("' '"), sequelize.col('lastName')), 'name'],
                [sequelize.col('DoctorNurse.fees'), 'fees'],
                [sequelize.col('DoctorNurse.description'), 'description'],
                [sequelize.col('DoctorNurse.location'), 'location'],
                [sequelize.fn('AVG', sequelize.col('ratedDoctorNurse.rating')), 'rating'], // Calculate average rating
                
                ],
                include: [
                {
                    model: db.DoctorNurse,
                    attributes:[],
                    as: 'DoctorNurse',
                    required: false,
                },
                {
                    model: db.Rating,
                    as:'ratedDoctorNurse',
                    attributes: [], 
                },
                
            ],
            where: { id, userType: 3 }, // Assuming userType 3 is nurse
            group: ['User.id'], 
            raw: true,
        });
        return nurse as unknown as NurseFullData;
    }
    async updateDoctorNurseData(data: DoctorData | NurseData): Promise<void>{
        await db.DoctorNurse.update(
            data,
            {
                where:{userId: data.userId}
            }
        )
    }
    async listDoctorClinics (doctorId: string) : Promise<Clinic[]>{
        const clinics = await db.Clinic.findAll({
            where: { doctorId: doctorId },
            raw: true, 
            });
        return clinics;
    }
    async getClinicById(clinicId: string) : Promise<Clinic>{
        const clinic = await db.Clinic.findByPk(clinicId)
        return clinic as Clinic;
    }
    async getClinic(clinicId: string) : Promise<ClinicWithSchedule>{
        const clinic = await db.Clinic.findOne({
            attributes: [
                'id', 
                'clinicName',
                'location',
                'city',
                'phone',
                'doctorId', 
            ],
            where: { id:clinicId},
            raw: true,
            }) as unknown as ClinicWithSchedule;
        const schedule = await this.getClinicSchedule(clinicId);
        clinic.schedule = schedule;
        return clinic;
    }
    async addClinic (clinic: Clinic) :Promise<void>{
        await db.Clinic.create(clinic);
    }
    async deleteClinic (clinicId: string) : Promise<void>{
        await db.Clinic.destroy({
            where: { id: clinicId },
        });
    }
    async updateClinic (clinic :Clinic) : Promise<void>{
        await db.Clinic.update(
            {
                clinicName: clinic.clinicName,
                phone: clinic.phone,
                city: clinic.city,
                location: clinic.location,
            },
            {
                where: { id: clinic.id },
            }
          );
        
    }
    async getClinicAppointmentsSlots(clinicId: string, date:Date):Promise<{start_time:number,end_time:number,isReserved: boolean}[]>{
        date.setHours(0,0,0,0);
        console.log({ clinicId, date})
        const query =`WITH RECURSIVE time_slots AS (
                SELECT 
                cs.clinicId,
                cs.day,
                cs.from AS slot_start,
                ADDTIME(cs.from, SEC_TO_TIME(dn.appointmentTime * 60)) AS slot_end,
                dn.appointmentTime
                FROM clinic_schedule cs
                JOIN clinic c ON cs.clinicId = c.id
                JOIN doctor_nurse dn ON c.doctorId = dn.userId
                WHERE cs.clinicId = :clinicId 
                AND cs.day = :dayOfWeek
                
                UNION ALL
                
                SELECT 
                clinicId,
                day,
                slot_end AS slot_start,
                ADDTIME(slot_end, SEC_TO_TIME(appointmentTime * 60)) AS slot_end,
                appointmentTime
                FROM time_slots
                WHERE slot_end < (
                SELECT cs.to FROM clinic_schedule cs 
                WHERE cs.clinicId = time_slots.clinicId 
                    AND cs.day = time_slots.day
                )
            )
            
            SELECT 
                ROW_NUMBER() OVER (ORDER BY ts.slot_start) AS number, -- Order slots chronologically
                DATE_FORMAT(ts.slot_start, '%H:%i') AS start_time,
                DATE_FORMAT(ts.slot_end, '%H:%i') AS end_time,
                EXISTS (
                SELECT 1
                FROM appointment a
                WHERE a.clinicId = ts.clinicId
                    AND DATE(a.date) = :date 
                    AND TIME(a.date) >= ts.slot_start
                    AND TIME(a.date) < ts.slot_end
                ) AS isReserved
            FROM time_slots ts
            ORDER BY ts.slot_start;`;
        const day =await db.sequelize.query(query,{
            replacements: { clinicId, date, dayOfWeek: date.getDay() },
            type: sequelize.QueryTypes.SELECT
        });
        return day as {number: number, start_time:number,end_time:number,isReserved: boolean}[];
    }
    async getClinicSchedule(clinicId :string): Promise<ClinicSchedule[]>{
        const schedule = await db.ClinicSchedule.findAll({
            attributes: [
                'day', 
                'from',
                'to',
            ],
            where: {clinicId},
            raw:true
        });
        return schedule;
    }
    async postClinicSchedule(clinicSchedule: ClinicSchedule[],clinicId: string): Promise<void>{
        const schedules = clinicSchedule.map(s=>({...s, clinicId}))
        await db.ClinicSchedule.bulkCreate(schedules, {
            updateOnDuplicate: ['from', 'to'],
          }); 
    }
    async deleteDayFromSchedule(clinicId :string, day :number): Promise<void>{
        await db.ClinicSchedule.destroy({ where:{clinicId, day}})
    }
    async updateScheduleDay(clinicSchedule: ClinicSchedule): Promise<void>{
        await db.ClinicSchedule.update(
            {
              from: clinicSchedule.from,
              to: clinicSchedule.to,
            },
            {
              where: {
                clinicId: clinicSchedule.clinicId,
                day: clinicSchedule.day,
              },
            }
          );
    }
    async postDayToSchedule(day: ClinicSchedule): Promise<void>{
        await db.ClinicSchedule.create(day);
    }
    async createBloodRequest (bloodRequest: BloodRequest ) :Promise<void>{
        await db.Blood.create({
            id: bloodRequest.id,
            bloodType: bloodRequest.bloodType,
            isRequest: bloodRequest.isRequest,
            date: bloodRequest.date,
            city: bloodRequest.city,
            patientId: bloodRequest.patientId,
            describtion: bloodRequest.describtion,
        });
    }
    async deleteBloodRequest(id: string) :Promise<void>{
        await db.Blood.destroy({
            where: {
                id: id,
            },
        });
    }
    async getBloodRequest (id: string): Promise<BloodDonator>{
        const bloodRequest = await db.Blood.findOne({
            attributes:[
                'id',
                'patientId',
                'isRequest',
                'bloodType',
                'city',
                'date',
                'describtion',
                [sequelize.fn('CONCAT', sequelize.col('patient.firstName'), sequelize.literal("' '"), sequelize.col('patient.lastName')), 'name'],
                [sequelize.col('patient.email'), 'email'],
                [sequelize.col('patient.phone'), 'phone'],
                [sequelize.col('patient.image'),'image'],
            ],
            where: {
                id,
            },
            include: {
                model: db.User,
                attributes:[],
                as: 'patient', 
            },
            raw:true
        });
        return bloodRequest as unknown as BloodDonator;
    }
    async updateBloodRequest(bloodRequest: BloodRequest) :Promise<void>{
        await db.Blood.update(
            {
                bloodType: bloodRequest.bloodType,
                isRequest: bloodRequest.isRequest,
                date: bloodRequest.date,
                city: bloodRequest.city,
                describtion: bloodRequest.describtion,
            },
            {
                where: {
                    id: bloodRequest.id,
            },
                returning: true,
            }
        );
    }
    async listUserBloodRequests(userId: string):Promise<BloodRequest[]>{
        const bloodRequests = await db.Blood.findAll({
            where: {
                patientId: userId,
            },
            raw: true, 
        });
        return bloodRequests;
    }






    async getReceptionist( receptionistId: string, clinicId?: string): Promise<Receptionist>{
        const whereClause: { id: string; clinicId?: string } = {
            id: receptionistId,
            };
            if (clinicId) {
                whereClause.clinicId = clinicId;
            }
        const receptionist = await db.User.findOne({
            attributes: [
                'id',
                'userType',
                'firstName',
                'lastName',
                'city',
                'createdAt',
                'gender',
                'email',
                'phone',
                'birthday',
                [sequelize.col('receptionist.doctorId'), 'doctorId'],
                [sequelize.col('receptionist.clinicId'), 'clinicId'],
            ],
            include: [{
                model: db.Receptionist,
                as: 'receptionist',
                attributes: [] ,
                where: whereClause
            }]
            ,
            raw: true,
        });
        return receptionist.toJSON() as unknown as Receptionist;
    }
    async isReceptionistOfDoctor( doctorId: string, email: string ): Promise<Receptionist| null>{
        const [rows] = await this
                .db.execute(`SELECT clinic_recep.*, clinic.doctorId as doctorId 
                            FROM (
                                    SELECT u.*,   recep.clinicId as clinicId 
                                    FROM user as u
                                    INNER JOIN receptionist recep
                                    ON u.userType = 4 AND u.email = ? AND recep.receptionistId = u.id 
                                ) as clinic_recep
                            INNER JOIN clinic 
                            ON clinic.doctorId = ?;`
                            ,[email, doctorId]);
        return <Receptionist> rows[0];
    }
    async listReceptionists(doctorId :string): Promise<Receptionist[]>{
        const [ rows ] = await this.db
                        .execute(`SELECT u.id, r.doctorId, u.userType, u.firstName, u.lastName,
                                        u.city, u.createdAt, u.gender,u.email, u.phone, u.birthday FROM receptionist as r 
                                    INNER JOIN user as u
                                    ON r.doctorId = ? AND u.id = r.receptionistId;`
                                ,[doctorId]);
        /* 
            SELECT clinicReceps.*, user.id as doctorId
                                FROM (
                                    SELECT clinic_recep.*, clinic.doctorId as doctorId 
                                        FROM (
                                                SELECT u.id, u.userType, u.firstName, u.lastName, 
                                                    u.email, u.phone, u.createdAt, recep.clinicId as clinicId 
                                                FROM user as u
                                                INNER JOIN receptionist recep
                                                ON recep.receptionistId = u.id AND clinicId = ?
                                            ) as clinic_recep
                                            INNER JOIN clinic 
                                    ON clinic_recep.clinicId = clinic.id) AS clinicReceps
                                INNER JOIN user
                                ON user.id = clinicReceps.doctorId AND user.id = ?;        
        */
        return <Receptionist[]>rows;
    }
    async createReceptionist(clinicId: string, receptionistId: string, doctorId: string): Promise<void>{
        await this.db.query(`INSERT INTO receptionist 
            (receptionistId, clinicId, doctorId) 
            VALUES('${receptionistId}', '${clinicId}', '${doctorId}');`);
    }
    async deleteReceptionist(doctorId: string, receptionistId: string): Promise<void>{
        await this.db.execute(`DELETE FROM receptionist
                            WHERE receptionistId = ? AND doctorId = ?;`
                            ,[receptionistId,doctorId]);
        //I may delete the user if it also
    }


    async searchDoctors({ city,gender, availability, specialization, sort, offset,limit  }) :Promise<{data:DoctorFullData[], count:number}>{

        const userWhere: {gender?:boolean} = {}
        gender == 0 || gender == 1 ?userWhere.gender = gender : null;

        const cityWhere:{ city?:string} ={};
        city?.toLowerCase() !=='all'? cityWhere.city = city : null;

        const specializationWhere:{ specialization?:string } = {};
        specialization && specialization !== 'all'? specializationWhere.specialization = specialization : null;

        const availabilityWhere:{ day?:number } = {};
        if( availability == 0 || availability == 1){
            const day = new Date().getDay()+availability;
            availabilityWhere.day = day>6?0:day;
        } 

        const order = []
        if (sort == 1) {
            order.push([sequelize.literal('rating'), 'DESC']);
        } else if (sort == 2) {
            order.push([sequelize.literal('fees'), 'ASC']);
        } else if (sort == 3) {
            order.push([sequelize.literal('fees'), 'DESC']);
        }

        const  count = await db.Clinic.count({
            attributes:[],
            include:[{
                model:db.User,
                as: 'doctor',
                where:userWhere
            },{
                model: db.DoctorNurse,
                as: 'DoctorNurse',
                where:specializationWhere
            },{
                model: db.ClinicSchedule,
                as: 'clinicSchedule',
                where: availabilityWhere
            }
        ],
        where:cityWhere,
        distinct: true,
        group: [
            'Clinic.id',
          ], 
        })
        const  doctors = await db.Clinic.findAll({
            attributes: [
                ['doctorId','id'], 
                ['id','clinicId'],
                [sequelize.fn('CONCAT', sequelize.col('doctor.firstName'), sequelize.literal("' '"), sequelize.col('doctor.lastName')), 'name'],
                [sequelize.col('doctor.email'), 'email'],
                [sequelize.col('DoctorNurse.fees'), 'fees'],
                [sequelize.col('DoctorNurse.description'), 'description'],
                [sequelize.col('DoctorNurse.appointmentTime'), 'appointmentTime'],
                [sequelize.fn('AVG', sequelize.col('doctor.ratedDoctorNurse.rating')), 'rating'],
                [sequelize.col('DoctorNurse.specialization'), 'specialization'], 
                'clinicName',
                'location',
                'city',
                'phone',
            ],
            include:[{
                model:db.User,
                attributes:[],
                as: 'doctor',
                include:[
                    {
                        model: db.Rating,
                        as:'ratedDoctorNurse',
                        required:false,
                        attributes: [], 
                    },
                ],
                where:userWhere

            },{
                model: db.DoctorNurse,
                attributes:[],
                as: 'DoctorNurse',
                where:specializationWhere
            },{
                model: db.ClinicSchedule,
                attributes:[],
                as: 'clinicSchedule',
                where: availabilityWhere
            }, 
        ],
            where:cityWhere,
            raw:true,
            limit,
            offset,
            subQuery: false,
            order,
            group: [
                'doctor.id',
                'Clinic.id',
                'Clinic.clinicName',
                'Clinic.location',
                'Clinic.city',
                'Clinic.phone',
              ], 
        }) as unknown as DoctorFullData[];
        return { count: count.length, data:doctors }
    }
    async searchNurse({ city,gender, sort, offset,limit  }) :Promise<{data:NurseFullData[], count:number}>{
        const where:{ city?:string, gender?:boolean, userType: number} ={ userType:3 };

        gender == 0 || gender ==1 ? where.gender = gender : null;
        city?.toLowerCase() !=='all'? where.city = city : null;
        console.log(where)
        const order = []
        if (sort == 1) {
            order.push([sequelize.literal('rating'), 'DESC']);
        } else if (sort == 2) {
            order.push([sequelize.literal('fees'), 'ASC']);
        } else if (sort == 3) {
            order.push([sequelize.literal('fees'), 'DESC']);
        }
        const count = await db.User.count({
            where
        });
        const nurses = await db.User.findAll({
            attributes: [
            'id',
            'email',
            'city',
            'image',
            'userType',
            [sequelize.fn('CONCAT', sequelize.col('firstName'), sequelize.literal("' '"), sequelize.col('lastName')), 'name'],
            [sequelize.col('DoctorNurse.fees'), 'fees'],
            [sequelize.col('DoctorNurse.description'), 'description'],
            [sequelize.col('DoctorNurse.location'), 'location'],
            [sequelize.fn('AVG', sequelize.col('ratedDoctorNurse.rating')), 'rating'], 
            
            ],
            include: [
            {
                model: db.DoctorNurse,
                attributes:[],
                as: 'DoctorNurse',
                required: true,
            },
            {
                model: db.Rating,
                as:'ratedDoctorNurse',
                attributes: [], 
            },
            
        ],
        where,
        raw:true,
        limit,
        offset,
        group: ['User.id'],
        subQuery: false,
        order,
    }) as unknown as NurseFullData[];
    return { count, data:nurses }
    }
    async searchBloodBank({ isRequest,bloodType, availability, city, offset, limit }): Promise<{data:BloodDonator[], count: number}>{
        const where:{ isRequest: boolean, 
                    city?: string, 
                    date?:{ [sequelize.Op.gte]: Date; [sequelize.Op.lte]?: Date }, 
                    bloodType?: ["A+", "A-", "B+", "B-", "O-", "AB+", "AB-", "All"]} 
                    =
                    { isRequest };

        bloodType && bloodType.toLowerCase()  != 'all'? where.bloodType = bloodType: null;
        city && city.toLowerCase()  !=='all'? where.city = city : null;

        const date = new Date();
        date.setHours(0,0,0,0);
        if(availability == 0 || availability == 1){
            const endDate =  new Date(date.getFullYear(),date.getMonth(),date.getDate()+Number(availability)+1);
            where.date = {
                [sequelize.Op.gte]: date,
                [sequelize.Op.lte]: endDate,
            }

        } 
        where.date = {
            [sequelize.Op.gte]: date,
        };

        
        const countResult  = (await db.Blood.count({ 
            attributes:[[sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('patientId'))), 'count']],
            where,
            group: ['patientId', 'id'],
        }) as unknown as number[]);
        const count = countResult.length as number;
        console.log(count)
        const bloodBank =  await db.Blood.findAll({
            attributes:[
                [sequelize.fn('MAX', sequelize.col('date')), 'date'],
                'id',
                'patientId',
                'isRequest',
                'bloodType',
                'city',
                'describtion',
                [sequelize.fn('CONCAT', sequelize.col('patient.firstName'), sequelize.literal("' '"), sequelize.col('patient.lastName')), 'name'],
                [sequelize.col('patient.email'), 'email'],
                [sequelize.col('patient.phone'), 'phone'],
                [sequelize.col('patient.image'),'image'],
            ],
            include: {
                model: db.User,
                attributes:[],
                as: 'patient', 
            },
            where,
            raw:true,
            limit,
            offset,
            group: ['patient.id', 'Blood.id'],
            subQuery: false,
        }) as unknown as BloodDonator[];
        
        return {data:bloodBank, count};
    }
}
export default Datastore;