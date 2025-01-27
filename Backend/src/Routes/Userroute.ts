import { Router } from "express";
import Usercontroller from "../Controllers/Usercontroller.ts";
import UserRepository from "../Repository/Userrepository.ts";
import UserServices from "../Services/Userservices.ts";
import multer from "multer"
import path from "path"
import AuthenticationMiddleware from "../Middleware/UserAuthMiddleware.ts";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userRepository = new UserRepository()
const userServices = new UserServices(userRepository);
const userController = new Usercontroller(userServices);
const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
       const uploadDir = path.join(__dirname, "..", "uploads"); 
       cb(null, uploadDir);
  
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });




router.post("/register",upload.single("profileImage"),userController.userRegister.bind(userController));
router.post("/login",userController.userLogin.bind(userController));
router.post("/refreshtoken",userController.refreshTocken.bind(userController));
router.get("/viewpage", userController.detailPage.bind(userController));
router.post("/addpost",AuthenticationMiddleware,upload.single("productuploadimage"),userController.AddPost.bind(userController));
router.get("/getpost",AuthenticationMiddleware, userController.findAllPost.bind(userController));
router.post("/addreview",AuthenticationMiddleware, userController.AddReview.bind(userController));
router.delete("/deletepost",AuthenticationMiddleware, userController.findAndDeletepost.bind(userController));
router.post("/editpost",AuthenticationMiddleware,upload.single("productimage"),userController.findpostandedit.bind(userController));
router.get("/getreview",AuthenticationMiddleware, userController.findAllReviews.bind(userController));









export default router;


