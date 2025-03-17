import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import SearchBar from './search-bar';
import SearchFilter from './search-filter';
import SearchResults from './search-results';
import SearchPagination from './search-pagination';
import { setFilter } from '../../../features/search';
import '../../../style/search.css'

function Search() {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setFilter(Object.fromEntries(searchParams)));
    }, [dispatch, searchParams]);

    return (
        <Container>
            <Row>
                <Col xs={12}>
                    <section className="search-section">
                        <SearchBar isOverlay={false} />
                    </section>
                </Col>
            </Row>
            <Row>
                <Col md={3} className="d-none d-md-block"> 
                    <section className="search-body">
                        <SearchFilter />
                    </section>
                </Col>
                <Col md={9}>
                    <section className="search-body">
                        <div className='result-pagination'>
                            <SearchResults />
                            <SearchPagination />
                        </div>
                    </section>
                </Col>
            </Row>
        </Container>
    );
}

export default Search;