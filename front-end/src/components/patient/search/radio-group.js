import { FormCheck, FormGroup, FormLabel } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setFilter } from "../../../features/search";

const RadioGroup = ({ title, name, options, selectedValue }) => {
    const dispatch = useDispatch();
    const onChange = (e) => dispatch(setFilter({ [e.target.name]: e.target.value }));

    return<FormGroup className="mb-3"> 
        <FormLabel className="fw-bold">{title}</FormLabel>
        {options.map((option) => (
            <FormCheck
                key={option.id}
                type="radio"
                id={option.id}
                name={name}
                value={option.value}
                checked={selectedValue === option.value}
                onChange={onChange}
                label={option.label}
            />
        ))}
    </FormGroup>
};
export default RadioGroup