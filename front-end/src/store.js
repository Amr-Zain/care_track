import { configureStore }  from '@reduxjs/toolkit';
import authedUser from './features/authedUser';
import populars from './features/populers';
import appointments from './features/appointments';
import search from './features/search';
import medicalHistory from './features/medicalHistory';
import  profile  from './features/profile';
import patient from './features/patient';
import diagnosisForm from './features/diagnosisForm';

export const store = configureStore({
    reducer: {
        authedUser,
        populars,
        appointments,
        profile,
        patient,
        search,
        diagnosisForm,
        medicalHistory,
    }
});
