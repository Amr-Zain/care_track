import { useEffect } from "react";
import PopulersContainer from "./populars-container";
import { getPopulars } from "../../features/populers";
import { useDispatch, useSelector } from "react-redux";

function Populers() {

    const { doctors, nurses, isLoading }  = useSelector(state=>state.populars)
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(getPopulars());
    },[dispatch, doctors.length]);
    return ( 
            <>
                <PopulersContainer DoctorsOrNurses={doctors} isLoading={isLoading} type={'Doctors'} />
                <PopulersContainer DoctorsOrNurses={nurses} isLoading={isLoading} type = {'Nurses'} />
            </> );
}

export default Populers;