import React, { useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { setFilter } from '../../../features/search';
import { useSelector, useDispatch } from 'react-redux';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import { bloodTypes, searchTypes, cities, specializations } from '../../../api/api';
import { PATIENT, SEARCH } from '../../../constants/routes';
import '../../../style/search-section.css';
import { Button } from 'react-bootstrap';

const SearchBar = ({ isOverlay, removeOverlay }) => {
  const { searchFor, availability='2', sort, specialization, name, gender='2', bloodType='all', city='all' } = useSelector(
    (store) => store.search.filter
  );
  const dispatch = useDispatch();
  const [, setSearshParams] = useSearchParams();
  const navigate = useNavigate();
  const [localCity, setLocalCity] = useState(city);
  const [localSpecialization, setLocalSpecialization] = useState(specialization);
  const [localBloodType, setLocalBloodType] = useState(bloodType);
  const [localSearchFor, setLocalSearchFor] = useState(searchFor);

  const handleSearch = () => {
    if (removeOverlay) removeOverlay();
    const queries = { searchFor:localSearchFor, city:localCity, availability, sort, page: 1 };
    if (localSearchFor === 'donator' || localSearchFor === 'donation_request') queries.bloodType = localBloodType|| 'all';
    else {
      if (localSearchFor === 'doctor') queries.specialization = localSpecialization;
      queries.name = name;
      queries.gender = gender;
    }
    if (!isOverlay) {
      dispatch(setFilter(queries));
      navigate({
        pathname: `/${PATIENT}/${SEARCH}`,
        search: `?${createSearchParams(queries)}`,
      });
    } else {
      dispatch(setFilter(queries));
      setSearshParams(queries);
    }
  };

  const handleChange = (name, value) => {
    if (name === 'searchFor') {
      setLocalSearchFor(value);
      dispatch(
        setFilter({
          city: 'all',
          specialization: '',
          bloodType: 'all',
          name: '',
          sort: '1',
          gender: '2',
          availability: 2,
          page: 1,
          [name]: value,
        })
      );
      setLocalCity('');
      setLocalSpecialization('');
      setLocalBloodType('');
    } else {
      dispatch(setFilter({ [name]: value }));
      if (name === 'city') setLocalCity(value);
      if (name === 'specialization') setLocalSpecialization(value);
      if (name === 'bloodType') setLocalBloodType(value);
    }
  };
  const selectStyles = {
    control: (provided) => ({
      ...provided,
      minWidth: '200px',
      width: '100%',
      borderRadius: '4px',
      height: '38px', // Match Bootstrap's form-control height
      minHeight: '38px',
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '10rem',
      overflowY: 'auto',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '38px',
    }),
  };
const disable = isOverlay?'':'d-none'
  return (
    <React.Fragment >
        <div className="flex-grow-1" style={{ minWidth: '200px' }}>
            <Select
            options={searchTypes}
            value={{ value: localSearchFor, label: localSearchFor }}
            onChange={(selectedOption) => handleChange('searchFor', selectedOption.value)}
            placeholder="Search For"
            styles={selectStyles}
            classNamePrefix="select"
            />
        </div>

        <div className={`flex-grow-1 ${disable} d-lg-block`} style={{ minWidth: '200px' }}>
            <Select
            options={cities}
            value={localCity? { label: localCity, value: localCity}:null }
            onChange={(selectedOption) => handleChange('city', selectedOption.value)}
            placeholder="City"
            styles={selectStyles}
            classNamePrefix="select"
            />
        </div>

        {localSearchFor === 'doctor' && (
            <div className={`flex-grow-1 ${disable} d-xl-block`} style={{ minWidth: '200px' }}>
            <Select
                options={specializations}
                value={localSpecialization?{label:localSpecialization, value:localSpecialization}:null }
                onChange={(selectedOption) => handleChange('specialization', selectedOption.value)}
                placeholder="Specialization"
                styles={selectStyles}
                classNamePrefix="select"
            />
            </div>
        )}

        {['donation_request', 'donator'].includes(localSearchFor) && (
            <div className={`flex-grow-1 ${disable} d-md-block`} style={{ minWidth: '200px' }}>
            <Select
                options={bloodTypes}
                value={localBloodType?{label:localBloodType, value:localBloodType}:null}
                onChange={(selectedOption) => handleChange('bloodType', selectedOption.value)}
                placeholder="Blood Type"
                styles={selectStyles}
                classNamePrefix="select"
            />
            </div>
        )}

        {['doctor', 'nurse'].includes(localSearchFor) && (
            <div className={`flex-grow-1 ${disable} d-md-block`} style={{ minWidth: '200px' }}>
            <input
                className="form-control  bg-white "
                type="search"
                value={name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                name="name"
                placeholder={`Name Of The ${localSearchFor?.charAt(0).toUpperCase() + localSearchFor?.slice(1)}`}
                style={{ height: '38px' }}
            />
            </div>
        )}

        <div className="flex-grow-1" style={{ minWidth: 'fit-content',order:isOverlay?'10':'' }}>
            <Button
            onClick={handleSearch}
            onKeyDown={(event) => {
                if (event.key === 'Enter') handleSearch();
            }}
            variant="primary"
            className="d-flex align-items-center gap-1"
            style={{height: '38px'}}
            >
            <BiSearch className="fs-5" /> Search
            </Button>
        </div>
    </React.Fragment>
  );
};

export default SearchBar;