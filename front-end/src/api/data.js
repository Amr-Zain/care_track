
//sill
import axios from 'axios';
import { calculateAge, userTypes } from './helper';
import { createSearchParams } from 'react-router-dom';
import { NURSE, PATIENT } from '../constants/routes';


const a = process.env.REACT_APP_API_URL;
console.log(a)



const baseUrl =  process.env.REACT_APP_API_URL ||'http://localhost:3030/api/v1';



const api = axios.create({
    baseURL: baseUrl,
    timeout:2500,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) { 
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
    response => {
      // Log successful auth-related responses
        if (response.config.url === 'users/refresh') {
            console.log('Token refresh successful', {
            newToken: response.headers['x-access-token'],
            status: response.status
            });
        }
        return response;
        },
        async error => {
        const originalRequest = error.config;
        console.debug('API error:', {
            url: originalRequest.url,
            status: error.response?.status,
            message: error.message
        });

        if (error.response?.status === 403) {
        console.warn('Authentication failed for:', originalRequest.url);
        
        if (!originalRequest._retry) {
            console.log('Attempting token refresh...');
            try {
                const newToken = await handleTokenRefresh();
                originalRequest._retry = true;
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                //clearAuth();
                return Promise.reject(refreshError);
            }
            }
        }
        let errorMessage = 'An unexpected error occurred';
    
        if (error.response) {
          // Handle API response errors
          const responseData = error.response.data;
          errorMessage = responseData?.message || responseData || error.response.statusText;
          
          // Stringify non-string messages
          if (typeof errorMessage !== 'string') {
            errorMessage = JSON.stringify(errorMessage);
          }
        } else if (error.request) {
          // Handle network errors
          errorMessage = 'Network error. Please check your internet connection.';
        } else {
          // Handle other errors
          errorMessage = error.message || errorMessage;
        }
    
        return Promise.reject(new Error(errorMessage));
    }
);
async function handleTokenRefresh() {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');
    if (!refreshToken) {
        throw new Error('No refresh token available');
        }
    
        try {
        const response = await api.get('users/refresh', {
            headers: { 'x-refresh': refreshToken,Authorization:accessToken}
        });
    
        const newAccessToken = response.headers.get('x-access-token');
        if (!newAccessToken) {
            throw new Error('No access token in response');
        }
        
        localStorage.setItem('accessToken', newAccessToken);
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        
        return newAccessToken;
    } catch (error) {
      console.error('Refresh token request failed:', {
        status: error.response?.status,
        message: error.message
      });
      throw error;
    }
  }
  

export const createUserSession = async( { email, password } )=>{
        const { data } = await api.post('/sessions', { email, password });

        const user = {
            id: data.user.id,
            name: `${data.user.firstName} ${data.user.lastName}`,
            userType: userTypes[data.user.userType-1],
            email: data.user.email,
            city: data.user.city,
            imageURL : data.user.image,
            age: calculateAge(data.user.birthday)
        }
        addAuthToLocalStorage({ user, accessToken: data.accessToken, refreshToken: data.refreshToken})
        return user ; 
    
}
const clearAuth = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    delete api.defaults.headers.common.Authorization;
};
const addAuthToLocalStorage = ({ user, accessToken, refreshToken })=>{
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
}


export const getUser = async ()=>{
    const { data } = await api.get('/users')
    const user = {
        id: data.user.id,
        name: `${data.user.firstName} ${data.user.lastName}`,
        userType: userTypes[data.user.userType-1],
        email: data.user.email,
        city: data.user.city,
        imageURL : data.user.image,
        age: calculateAge(data.user.birthday)
    }
    return user
}
export const deleteUserSession = async ()=>{
    await api.delete('/sessions');
    clearAuth();
}

export const createUser = async( user )=>{
    const body ={
        city: user.city.value,
        birthday: new Date(user.birthDay).getTime(),
        userType: userTypes.indexOf(user.userType?.value||'patient')+1,
        password: user.password,
        email: user.email,
        phone: user.phone,
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ')[1],
    }
    console.log(body)
    await api.post('/users',body);
    return await createUserSession({ email: body.email, password: body.password}) ; 

}

export const listPopuler= async ({type})=>{
    const { data:{ data} } = await api.get(`/search/${type}/all?sort=1&limit=10`);
    console.log(data)
    return data;
}

export const search = async ({ searchQueries,searchFor, city, specialization, 
    bloodType, name, sort,gender, page, limit, availability })=>{


    const queries = { availability, sort, gender, page, limit: limit || 10  }
    if(searchFor === 'doctor')queries.specialization = specialization;
    let url = `search/${searchFor}/${city||'all'}?` + createSearchParams(queries);
    if((searchFor ==='donator' || searchFor === 'donation_request')) url = url+`&bloodType=${bloodType?bloodType:'all'}`
    console.log(url)
    const { data } = await api.get(url);
    return data
}

export const getPatient = async( { patientId })=>{
    const { data:{data} } = await api.get(`patients/${patientId}`);
    return {
        ...data,
        age: calculateAge(data.birthday)
    }
}
export const getPatientDiagnosisCategoy = async( { patientId })=>{
    const { data:{ data} } = await api.get(`patients/${patientId}/diagnosis/specializations`);
    console.log(data)
    return data
}
export const getDiagnosisPref = async({ selectedCategories, date, patientId, byDoctor})=>{
    const specializations = selectedCategories.map(id => `specializations=${id}`).join('&')    
    const { data:{ data} } = await api.get(`patients/${patientId}/diagnosis?isOwnDoctorDiagnois=${byDoctor}&date=${date}&${specializations}`,);
    return data
    }
    
export const getPatientMedicines = async(patientId)=>{
    const { data:{data}} = await api.get(`patients/${patientId}/medicines`);
    if(!data)return[]
    
    return data
}
    
export const getDiagnosisById = async({patientId, id})=>{
    const { data:{ data} } = await api.get(`patients/${patientId}/diagnosis/${id}`);
    return data;
}
export const listDiagnosisMedicines = async({patientId, diagnosisId})=>{
    const { data:{ data} } = await api.get(`patients/${patientId}/diagnosis/${diagnosisId}/medicines`);
    return data;
}
export const listAppointments = async ({ date, userType })=>{
    const { data:{ data:appointments }} = await api.get(`appointments${date?'?date='+date:''}`);
    console.log(appointments)
    if(userType ===PATIENT)
        appointments.forEach(app=>{
            app.DoctorNurseId = app.doctorId||app.nurseId;
            app.userType = userTypes[app.userType-1];
            app.from = app.from?.slice(0,5)
            app.to = app.to?.slice(0,5)
        });
    return appointments;
}
export const getProfileData = async ({ id, userType })=>{
        const {data:{ data }} = await api.get(`${userType}s/${id}`);
        if(data.clinics)data.clinics.forEach(clinic=>clinic.label = clinic.city)
        return data
}
export const getAppointmentsSlots = async ({ clinicId, date })=>{
    const { data:{ data }} = await api.get(`clinics/${clinicId}/appointmentsSlots/${new Date(date).getTime()}`)
    
    return data;
}

export const createApointment = async( { clinicId, nurseId, date, type } )=>{ //doctor of nure
    const body = { 
                    nurseId: type ===NURSE?nurseId:null, 
                    clinicId:type !==NURSE?clinicId:null,
                    date: new Date(date).getTime()}
    const { data:{ data }} = await api.post('appointments',body);
    data.DoctorNurseId = data.doctorId||data.nurseId;
    data.userType = userTypes[data.userType-1];
    return data
}

export const deleteUserAppointment = async({id}) =>{
    await api.delete(`appointments/${id}`)
}

export const UpdateAppointment = async({id, date}) =>{
    await api.patch(`appointments/${id}`,{newDate: new Date(date).getTime()})
}

export const PostDonation = async ({ isRequest, bloodType, city, date })=>{
    const {data} = await api.post('blood-bank',{ isRequest, bloodType, city, date})
    return data
}

export const createClinic = async( { clinicName, clinicPhone:phone, city:{value:city}, clinicLocation:location, patientId})=>{
    await api.post(`clinics`, {
        clinicName,
        phone,
        city,
        location,
    });
}
export const getClinics = async() =>{
    const {data:{ data:clinics }} = await api.get(`clinics`);
    if(clinics)clinics.forEach(clinic=>clinic.label = clinic.city)
    return clinics
   
}

export const postClinicSchedule = async({ clinicId, days }) =>{
    await api.post(`clinics/${clinicId}/schedule`,{ days})
}

export const uploadProfileImg = async(formData) =>{
    const {data:{ url }} = await api.post('users/image', formData,{
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        });
    const user = JSON.parse(localStorage.getItem('user'));
    user.imageURL = url;
    localStorage.setItem('user',JSON.stringify(user));
    return url;
    
}

export const postDiagnosis = async({ description, medicines, patientId, clinicId }) =>{
    console.log()
    await api.post(`patients/${patientId}/diagnosis`,{description, medicines, clinicId})
}

export const getTotalPatients = async({id, userType})=>{
    const { data:{count}} = await api.get(`${userType}s/${id}/appointment/total`)
    return count;
}
