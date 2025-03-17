import { Offcanvas } from 'react-bootstrap';
import SearchFilter from "./search-filter";
import SearchSection from './search-bar';
import { createPortal } from 'react-dom';

function SearchFilterOverlay({ setOverlay }) {
    return createPortal(
        <>
            <Offcanvas 
                show={true} 
                onHide={() => setOverlay(false)}
                placement="start"
                className="w-75" 
                style={{ zIndex: 10000, backgroundColor:'var( --back-ground-white)' }}
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Filters</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="d-flex flex-column gap-3">
                        <SearchSection isOverlay removeOverlay={() => setOverlay(false)} />
                        <SearchFilter overlay />
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>,
        document.getElementById('root2')
    );
}

export default SearchFilterOverlay;