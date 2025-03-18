import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill } from 'react-icons/bs';
import { useSearchParams } from 'react-router-dom';
import { setFilter } from '../../../features/search';

function SearchPagination() {
    const search = useSelector( store => store.search );
    const dispatch = useDispatch()
    const [searchParams, setSearshParams ] = useSearchParams();
    const handlePageClick = (event) => {
        dispatch(setFilter({page: event.selected+1}))
        setSearshParams({ ...Object.fromEntries(searchParams), page: event.selected+1});
    }
    return ( <div className='paginate mt-3'>
                <ReactPaginate
                    activeClassName={'item active '}
                    breakClassName={'item break-me '}
                    breakLabel={'...'}
                    containerClassName={'pagination'}
                    disabledClassName={'disabled-page'}
                    nextClassName={"item next "}
                    onPageChange={handlePageClick}
                    pageCount={Math.ceil(search.result.count/search.filter.limit)}
                    pageClassName={'item pagination-page '}
                    pageRangeDisplayed={3}
                    previousClassName={"item previous"}
                    nextLabel={<BsFillArrowRightCircleFill style={{ fontSize: 20, width: 150 }} />}
                    previousLabel={<BsFillArrowLeftCircleFill style={{ fontSize: 20, width: 150 }} />}
                />
            </div>);
}

export default SearchPagination;