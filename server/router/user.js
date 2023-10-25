const express = require("express");
const multiparty = require("connect-multiparty");
const UserController = require("../controllers/user");
const md_auth = require("../middlewares/authenticated");

const md_upload = multiparty({uploadDir: "./uploads/avatar"});
const api = express.Router();

api.get("/user/me", [md_auth.asureAuth], UserController.getMe);
api.get("/users", [md_auth.asureAuth], UserController.getUsers);
api.post("/user", [md_auth.asureAuth, md_upload], UserController.createUser);
api.patch("/user/:id", [md_auth.asureAuth, md_upload], UserController.updateUser); //patch actualiza solo los datos que se envian
api.delete("/user/:id", [md_auth.asureAuth], UserController.deleteUser); //mismo Url que update pero se diferencia en patch/delete

module.exports = api;
