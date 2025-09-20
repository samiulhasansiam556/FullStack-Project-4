
import {Router} from 'express';
import { deleteMaterial, getMaterialsByUniversity,
 getMaterialsByUniversityForOne, getStudentProfile,getUniversity,
 uploadMaterial} from '../controller/userController';
import { protect,adminOnly } from '../middlewares/authMiddleware';
import {getMyProfile,updateProfile,changePassword} from '../controller/userController';
import upload from '../config/upload';


const router = Router();


router.get('/get-profile',protect,getMyProfile)
router.put('/update-profile',protect,updateProfile)
router.put('/change-password',protect,changePassword)



router.get("/get-university", protect, getUniversity);
router.post("/upload-material", protect, upload.single("document"), uploadMaterial);
router.delete("/delete-materials/:id", protect, deleteMaterial);
router.get("/university/:universityId", protect, getMaterialsByUniversity);
router.get("/university", protect, getMaterialsByUniversityForOne);
router.get("/student/:userId", protect, getStudentProfile);





export default router;
