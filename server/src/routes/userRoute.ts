
import {Router} from 'express';
import {getUser} from '../controller/userController';
import { get } from 'http';


const router = Router();




router.get('/getuser', getUser);






export default router;
