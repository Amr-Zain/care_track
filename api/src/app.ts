import express from 'express';
import dotenv from'dotenv';  
import 'express-async-errors';
import userRouter from './routes/user';
import sessionRouter from './routes/session';
import patientRouter from './routes/patient';
import doctorRouter from'./routes/doctor';
import nurseRouter from './routes/nurse';
import clinicRouter from './routes/clinic';
import appointmentRouter from './routes/appointment';  
import BloodBankRouter from './routes/blood-bank';
import searchRouter from './routes/search';
import auth from './middleware/authentication';
import notFound from './middleware/notFound';
import errorHandler from './middleware/errorHandler';
import cors from 'cors';

import path from 'path';
import checkUserType from './middleware/checkUserType';
import requireUser from './middleware/requireUser';
import { rateLimit } from 'express-rate-limit'
import { xss } from 'express-xss-sanitizer';
import helmet from 'helmet';
import mime from 'mime-types';


const app = express();
dotenv.config({ path:path.join(__dirname, '../.env')});
const PORT = process.env.PORT || 3030;

app.use(express.json());


app.use(helmet());
app.use(express.urlencoded({ extended: false, limit: '3mb' }));


app.use(cors({
        origin: process.env.CLIENT_URL||'http://localhost:3000', 
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    }));

  app.use(rateLimit({
      windowMs: 15 * 60 * 1000, 
      max: 200, 
    })
  );
  app.use(xss());

  app.use((req, res, next) => {
    res.header('Access-Control-Expose-Headers', 'x-access-token');
    next();
});
app.use(auth);

app.use('/public', express.static(path.join(__dirname, '../public'), {
  setHeaders: (res, filePath) => {
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  },
}) as express.RequestHandler);




 app.use('/api/v1/sessions', sessionRouter);
 app.use('/api/v1/users', userRouter);
 app.use('/api/v1/appointments', appointmentRouter);
 app.use('/api/v1/patients', patientRouter);
 app.use('/api/v1/nurses', nurseRouter);
 app.use('/api/v1/doctors', doctorRouter);
 app.use('/api/v1/clinics', clinicRouter);
 app.use('/api/v1/blood-bank',[ requireUser, checkUserType([1]) ], BloodBankRouter );
app.use('/api/v1/search', searchRouter);

app.use(notFound);
app.use(errorHandler);

(async function start(){
    app.listen(PORT,()=>console.log(`app listening on port ${PORT}`))
})(); 