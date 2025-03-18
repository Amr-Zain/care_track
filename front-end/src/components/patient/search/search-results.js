import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useSearchParams } from 'react-router-dom';
import { Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import Select from 'react-select';
import { MdFilterListAlt } from 'react-icons/md';
import { setFilter } from '../../../features/search';
import SearchFilterOverlay from "./search-filter-overlay";
import ResultCard from "./result-card";
import BloodCard from './blood-results';
import { getSearchResult } from '../../../features/search';

const sortOptions = [
    { value: '0', label: 'Best Matched' },
    { value: '1', label: 'Top Rating' },
    { value: '2', label: 'Price Low to High' },
    { value: '3', label: 'Price High to Low' }
];
function SearchResults() {
    const { filter: { searchFor, sort }, result: { data, count }, isLoading, error } = useSelector(store => store.search);
    const dispatch = useDispatch();
    const [overlay, setOverlay] = useState(false);
    const location = useLocation();
    const [searchParams, setSearshParams ] = useSearchParams();

    const handleSortChange = (selectedOption) => {
        dispatch(setFilter({ sort: selectedOption.value }));
        setSearshParams({ ...Object.fromEntries(searchParams), sort: selectedOption.value})
    };
    
    const cartType = searchParams.get('searchFor')
    const Result = (cartType === 'doctor' || cartType === 'nurse') ? ResultCard : BloodCard;
    const ResultsItems = data.map(item => (
            <Result key={item.clinicId || item.id} {...item} />));

    useEffect(() => {
        dispatch(getSearchResult({ searchQueries: location.search }));
    }, [dispatch, location.search]);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center my-5 text-primary" style={{minHeight:'50vh'}}>
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <>
            <aside className="search-results">
                <div className="d-flex justify-content-between justify-content-lg-end align-items-start align-items-sm-center my-3">
                    <Button 
                        variant="outline-secondary" 
                        onClick={() => setOverlay(true)}
                        className="d-flex d-lg-none align-items-center gap-2 mb-2 mb-md-0"
                    >
                        <MdFilterListAlt />
                        <span>Filters</span>
                    </Button>

                    <div className="d-flex flex-wrap flex-sm-row flex-column-reverse align-items-start align-items-sm-center gap-1 gap-sm-3">
                        <div className="text-muted px-2">
                            Results: <strong>{count}</strong>
                        </div>
                        
                        {(searchFor === 'doctor' || searchFor === 'nurse') && (
                            <div className="d-flex  align-items-center gap-2">
                                <span className="text-muted d-none d-sm-block">Sort by:</span>
                                <Select
                                    options={sortOptions}
                                    value={sortOptions.find(option => option.value === sort)}
                                    onChange={handleSortChange}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <Alert variant="danger" className="mb-4">
                        Error: {error}
                    </Alert>
                )}

                <Row className="g-4">
                    {data.length > 0 ? (
                        ResultsItems
                    ) : (
                        !error&&<Col>
                            <Alert variant="info" className="text-center">
                                No results found
                            </Alert>
                        </Col>
                    )}
                </Row>
            </aside>

            {overlay && <SearchFilterOverlay setOverlay={setOverlay} />}
        </>
    );
}

export default SearchResults;