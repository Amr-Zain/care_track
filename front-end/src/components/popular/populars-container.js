import { Container, Row, Spinner } from "react-bootstrap";
import Abstract from "./doctorOrNurseAbstract";

const PopulersContainer = ({ DoctorsOrNurses, isLoading, type }) => {
    return (
        <section className="popular-section">
            <div className="title">
                Top Rated {type}
            </div>
            
            <Container className="appointments-container">
                <Row className="g-4 flex-nowrap">
                    {isLoading ? (
                        <div className="loading-placeholder  text-primary">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : (
                        DoctorsOrNurses.map(items => (
                            <Abstract key={items?.clinicId||items.id} {...items} />
                        ))
                    )}
                </Row>
            </Container>
        </section>
    );
};

export default PopulersContainer;