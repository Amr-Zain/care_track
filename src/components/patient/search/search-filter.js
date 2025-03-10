import { useSelector } from "react-redux";
import RadioGroup from "./radio-group";

const GENDER_OPTIONS = [
    { id: 'anyGend', value: '0', label: 'Any' },
    { id: 'male', value: '1', label: 'Male' },
    { id: 'female', value: '2', label: 'Female' },
];

const AVAILABILITY_OPTIONS = [
    { id: 'anyAval', value: '0', label: 'Any' },
    { id: 'today', value: '1', label: 'Today' },
    { id: 'tomorrow', value: '2', label: 'Tomorrow' },
];

function SearchFilter({ overlay }) {
    const { searchFor, gender, availability } = useSelector(store => store.search.filter);


    

    return (
        <aside>
            <section className="collection p-2" style={{display:overlay?'flex':'block',gap:'5rem'}}>
                {(searchFor === 'doctor' || searchFor === 'nurse') && (
                    <RadioGroup
                        title= "Gender"
                        name= "gender"
                        options= {GENDER_OPTIONS}
                        selectedValue= {gender}
                    />
                )}
                <RadioGroup
                    title= "Availability"
                    name= "availability"
                    options= {AVAILABILITY_OPTIONS}
                    selectedValue= {availability}
                />
            </section>
        </aside>
    );
}

export default SearchFilter;