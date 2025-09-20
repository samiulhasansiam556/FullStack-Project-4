
import {Router} from 'express';
import {deleteAllUsers, getTest,getUsers, } from '../controller/testController';
import { protect,adminOnly } from '../middlewares/authMiddleware';





const router = Router();


router.get('/get-test', getTest);
router.get('/get-all-users',protect,adminOnly,getUsers);
router.delete('/delet-eusers',protect,adminOnly, deleteAllUsers);




export default router;
