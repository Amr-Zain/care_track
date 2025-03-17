import { useSelector } from "react-redux";
import { DEFAULT_IMG_URL } from "../../../constants/default";

function DoctorInfo() {
    const { user } = useSelector(state => state.authedUser);
    
    return ( 
        <div>
            <div style={{ 
                position: 'relative',
                width: '100%',
                paddingTop: '100%', 
                borderRadius: '50%',
                overflow: 'hidden'
            }}>
                <img 
                    style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }} 
                    src={user.imageURL || DEFAULT_IMG_URL} 
                    alt={`Dr.${user.name}`}
                />
            </div>
            <div>
                <h3 className="text-nowrap fs-4 text-truncate mt-1">{`Dr.${user.name}`}</h3>
            </div>
        </div>
    );
}

export default DoctorInfo;