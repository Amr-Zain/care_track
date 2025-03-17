import { createSearchParams, useNavigate } from "react-router-dom";
import { SEARCH } from "../constants/routes";

function handleUrl({searchFor, 
    city, 
    specialization, 
    bloodType,
    name, 
    gender, 
    availability, 
    sort,
    pageNumber }) {
        const route = `${SEARCH}/${searchFor}/${city ? city:'all'}`;
        let queries;
        if(searchFor === 'doctor' ) queries = { name, specialization, gender,  availability, sort, page: pageNumber };
        else if(searchFor === 'nurse') queries = { name, gender, availability, sort, page: pageNumber } ;
        else if(searchFor === 'donator' || searchFor === 'donation_request') queries = { bloodType, availability, sort, page: pageNumber };
        return({
            pathname: route,
            search: `?${createSearchParams(queries)}`,
        })
}

export default handleUrl
;