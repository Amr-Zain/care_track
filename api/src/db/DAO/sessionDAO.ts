import { Session } from "./../../schema";
export default interface SessionDAO  {
    createSession: (session: Session)=>Promise<void>;
    getSessionById :( sessionId :string)=>Promise<Session>;
    listUserValidsession :(userId :string)=> Promise<Session[]>;
    invalidateSession :(sesssionId :string)=> Promise<void>;
    /*  rehandleAccessToken : (refreshToken :string ) =>string |false; 
    validateUserAndPassword:(email :string, password : string) => Promise<User>;*/
}