import { useEffect } from "react";
import { Container } from "react-bootstrap";
import ProfileComponents from "../../components/profile";

function Profile() {
    useEffect(()=>{
        document.title = 'Profile';
    })
    return<main className="profile">
        <Container>
            <ProfileComponents />
        </Container>
    </main>;
}   

export default Profile;