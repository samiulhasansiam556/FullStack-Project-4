
import {Router} from 'express';
import {deleteAllUsers, getUser,getUsers} from '../controller/userController';
import { protect,adminOnly } from '../middlewares/authMiddleware';



const router = Router();


router.get('/getuser', getUser);
router.get('/getusers',protect,adminOnly,getUsers);
router.delete('/deleteusers', deleteAllUsers);


export default router;
