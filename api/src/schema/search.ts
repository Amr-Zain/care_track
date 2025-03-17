import { number, object, string } from "yup";

export default interface Session {
    id : string;
    userId : string;
    valid : boolean;
    userAgent : string;
    createdAt : number;
    lastAccess : number;
}
export const searchSchema = object({
    params: object({
        type: string()
            .required('Type is required')
            .oneOf(['doctor', 'nurse', 'donation_request', 'donator']),
        city: string()
            .required('City is required')
            .min(3, 'City must be at least 3 characters')
        }),
    query: object({
        name: string().optional(),
        specialization: string().optional().default('all'),
        gender: number()
            .oneOf([0, 1, 2])
            .default(2) //  0 = male, 1 = female
            .transform(value => Number(value)),
        availability: number()
            .oneOf([0, 1, 2])
            .default(2) // 0 = today, 1 = tomorrow
            .transform(value => Number(value)),
        sort: number()
            .oneOf([0, 1, 2, 3])
            .default(0) // 0 = best match, 1 = top rating, 2 low price ,3 high price
            .transform(value => Number(value)),
        bloodType: string()
                .oneOf(['A+','A-','B+','B-','O-','O+','AB+','AB-','a-','a+','b+','b-', 'o+','0-','ab+','ab-','all','All'])
                .transform((value) => value.toLowerCase() ==='all'?'all':value.replace(/ /g, '+').toUpperCase())
                .default('all'),
        page: number()
            .positive('Page must be positive number')
            .integer('Page must be integer')
            .default(1)
            .transform(value => Math.max(1, Number(value))),
        limit: number()
            .min(1, 'Limit must be at least 1')
            .max(100, 'Limit cannot exceed 100')
            .default(10)
            .transform(value => Math.min(100, Math.max(1, Number(value))))
        })
})