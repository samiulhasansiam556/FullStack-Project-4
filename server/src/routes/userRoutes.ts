
import {Router} from 'express';
import { deleteMaterial, getMaterialsByUniversity,
 getUserWithDetails, getStudentProfile,getUniversity,
 getUniversityHierarchy,
 logout,
 uploadMaterial} from '../controller/userController';
import { protect} from '../middlewares/authMiddleware';
import {getMyProfile,updateProfile,changePassword} from '../controller/userController';
import upload from '../config/upload';
import { get } from 'http';


const router = Router();


router.get('/get-profile',protect,getMyProfile)
router.put('/update-profile',protect,updateProfile)
router.put('/change-password',protect,changePassword)
router.post('/log-out',protect,logout)
router.get("/student", protect, getStudentProfile);
router.get("/get-user-details/:userId", protect, getUserWithDetails);



router.get("/get-university", protect, getUniversity);
router.get("/get-universityhierarchy", protect, getUniversityHierarchy);
router.post("/upload-material", protect, upload.single("document"), uploadMaterial);
router.delete("/delete-material/:id", protect, deleteMaterial);
router.get("/university/:universityId", protect, getMaterialsByUniversity);





export default router;
