import { object, string, number, array } from "yup"

export default interface Clinic {
    id :string,
    doctorId :string,
    clinicName :string,
    location :string,
    city: string,
    phone: string
}
const type = [0,1, 2, 3,4,5,6] as const;
export type Day = typeof type[number];
export interface ClinicSchedule {
    day :Day,
    clinicId :string,
    from :string,
    to :string
}
export interface ClinicWithSchedule extends Clinic{
    schedule: ClinicSchedule[]
}

const body = object({
    clinicName: string().required('clinic name is required'),
    location: string().required('location is required'),
    city: string().required('city id is required'),
    phone: string().matches(/^01[0125][0-9]{8}$/, 'clinic Phone number is not valid').required('phone is reqired'),
})
const  params =  object({
    id: string().required(' id is required')
});
export const createClinicSchema = object({
    body
});

export const getClinicSchema = object({
    params
});
export const updateClinicSchema = object({
    body,
    params
});
export const deleteClinicSchema = object({
    params
});
export const addClinicSchedule = object({
    body: object({

    }),
    params: object({
        day: number().min(0).max(6).required('day number is required'), 
        clinicId: string().required('clinicId is required')
    })
})
export const createScheduleSchema =  object({
    body: object({
      days: array()
        .of(
          object({
            day: number().min(0).max(6).required('day is required'),
            from: string()
              .required('from hour is required')
              .test(
                'valid-time-format',
                'from must be in HH:MM:SS format',
                (value) => {
                  if (!value) return true;
                  return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(value);
                }
              ),
            to: string()
              .required('to hour is required')
              .test(
                'valid-time-format',
                'to must be in HH:MM:SS format',
                (value) => {
                  if (!value) return true;
                  return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(value);
                }
              )
              .test('is-after-from', 'to must be after from', function (to) {
                const { from } = this.parent;
                if (!from || !to) return true;
                const fromParts = from.split(':').map(Number);
                const toParts = to.split(':').map(Number);
  
                const fromDate = new Date(0, 0, 0, fromParts[0], fromParts[1], fromParts[2]);
                const toDate = new Date(0, 0, 0, toParts[0], toParts[1], toParts[2]);
  
                return toDate > fromDate;
              }),
          })
        )
        .test('unique-days', 'Days must be unique', (value) => {
          if (!value) return true; // Allows for empty arrays
          const days = value.map((dayObj) => dayObj.day);
          return days.length === new Set(days).size;
        }),
    }), 
    params: object({
      clinicId: string().required('clinicId is required'),
    }),
  });

export const getScheduleSchema = object({
    params: object({
        clinicId: string().required('clinicId is required')
    })
})
export const updateDayToSchedule = object({
    body:object({
        body: object({
            day: number().min(1).max(6).required('day is required'),
            from: string()
            .required('from hour is required')
            .test(
                'valid-time-format',
                'from must be in HH:MM:SS format',
                (value) => {
                if (!value) return true; // Let required handle empty values
                return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(value);
                }
            ),
            to: string()
            .required('to hour is required')
            .test(
                'valid-time-format',
                'to must be in HH:MM:SS format',
                (value) => {
                if (!value) return true; // Let required handle empty values
                return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(value);
                }
            )
            .test('is-after-from', 'to must be after from', function(to) {
                const { from } = this.parent;
                if (!from || !to) return true; // let required handle it
                const fromParts = from.split(':').map(Number);
                const toParts = to.split(':').map(Number);

                const fromDate = new Date(0, 0, 0, fromParts[0], fromParts[1], fromParts[2]);
                const toDate = new Date(0, 0, 0, toParts[0], toParts[1], toParts[2]);

                return toDate > fromDate;
            })
        })
    }),
    params: object({
        day: number().min(0).max(6).required('day number is required'), 
        clinicId: string().required('clinicId is required')
    })
})
export const deleteDayToSchedule = object({
    params: object({
        day: number().positive().min(0).max(6).required('day number is required'), 
        clinicId: string().required('clinicId is required')
    })
})
export const getAppointmentsSlotsSchema = object({
    params: object({
        date: number().positive().required('date is required'),
        clinicId: string().required('clinicId is required')
    })
})