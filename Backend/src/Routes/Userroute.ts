import { Router } from "express";
import Usercontroller from "../Controllers/Usercontroller.ts";
import UserRepository from "../Repository/Userrepository.ts";
import UserServices from "../Services/Userservices.ts";
import multer from "multer"
import path from "path"
import AuthenticationMiddleware from "../Middleware/UserAuthMiddleware.ts";

const userRepository = new UserRepository()
const userServices = new UserServices(userRepository);
const userController = new Usercontroller(userServices);
const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, "../../BW-1 TASK USER-BLOG-MANAGEMENT/Backend/src/uploads"); 
    const uploadPath = path.join(__dirname, "uploads"); // Use absolute path
    cb(null, uploadPath);

  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });




router.post("/register",upload.single("profileImage"),userController.userRegister.bind(userController));
router.post("/login",userController.userLogin.bind(userController));
router.post("/refreshtoken",userController.refreshTocken.bind(userController));
router.post("/addpost",AuthenticationMiddleware,upload.single("productimage"),userController.AddPost.bind(userController));
router.get("/getpost",AuthenticationMiddleware, userController.findAllPost.bind(userController));
router.delete("/deletepost",AuthenticationMiddleware, userController.findAndDeletepost.bind(userController));
router.post("/editpost",AuthenticationMiddleware,upload.single("productimage"),userController.findpostandedit.bind(userController));








export default router;


