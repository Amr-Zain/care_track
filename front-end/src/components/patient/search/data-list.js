import DatalistInput from "react-datalist-input";
import { useDispatch } from "react-redux";
import { setFilter } from "../../../features/search";



function DataList(props) {
        const dispatch = useDispatch();
    
    return ( 
        <div className={props.name}>
        <DatalistInput
            value={String(props.value).charAt(0).toUpperCase() + String(props.value).slice(1)}
            listboxProps={{
                "aria-hidden": "false", 
            }}
            id={props.name}
            name={props.name}
            placeholder={props.name}
            onSelect={ ({ value })=>dispatch(setFilter({[props.name]: String(value).toLowerCase()})) }
            items={props.items}
        /> 
    </div>
    );
}

export default DataList;