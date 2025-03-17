import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../../components/footer";
import Header from "../../components/header";
import { Container } from "react-bootstrap";

function SharedLayout() {
    return ( <Fragment>
                <Header />
                <main>
                    <Container>
                        <Outlet />
                    </Container>
                </main>
                <Footer />
            </Fragment>);
}

export default SharedLayout;