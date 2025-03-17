import jwt from 'jsonwebtoken';

export const createToken = ( payload: object, options?: jwt.SignOptions | undefined )=>{
    const token = jwt.sign( payload,
                    process.env.JWT_KEY,
                    options
                    );
    
    return token;
}
export const verify = (token :string)=>{
    try{
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        return { valid: true, expired: false, decoded }
    }catch(e){
        return { valid: false, expired: e.message === 'jwt expired', decoded: null }
    }
}