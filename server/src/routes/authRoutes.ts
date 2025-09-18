
import {Router} from 'express'


import { signUp,verifyEmail,signIn,forgotPassword,resetPassword} from '../controller/authController'


const router= Router()

router.post('/sign-up',signUp)
router.get('/verifyemail/:id',verifyEmail)
router.post('/sign-in',signIn)

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);





export default router;