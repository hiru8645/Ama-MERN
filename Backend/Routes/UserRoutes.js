const express = require("express");
const router = express.Router();
//Insert Model
const User = require("../Model/UserModel");
//Insert User Controller
const UserController = require("../Controllers/UserControllers"); 

router.get("/",UserController.getAllUsers);
router.post("/",UserController.addUser);
router.get("/:id",UserController.getById);
router.put("/:id",UserController.updateUser);
router.delete("/:id",UserController.deleteUser);
router.post("/login", UserController.loginUser);
router.put("/:id/change-password", UserController.changePassword);
router.put("/:id/reset-password", UserController.resetPassword);

//export
module.exports = router;