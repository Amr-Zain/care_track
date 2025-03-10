import { configureStore }  from '@reduxjs/toolkit';
import authedUser from './features/authedUser';
import populars from './features/populers';
import citiesAndSpecializations from './features/cities-specializations';
import appointments from './features/appointments';
import search from './features/search';
import medicalHistory from './features/medicalHistory';
import  profile  from './features/profile';

export const store = configureStore({
    reducer: {
        authedUser,
        populars,
        appointments,
        profile,
        search,
        citiesAndSpecializations,
        medicalHistory,
    }
});
