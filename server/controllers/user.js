const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const image = require("../utils/image");

async function getMe(req, res){
    const {user_id} = req.user;
    const response = await User.findById(user_id);
    
    if(!response){
        res.status(400).send({msg: "no se encontro el usuario"});
    } else {
        res.status(200).send(response);
    }
   
   //  res.status(200).send({msg:"OK"});
}

async function getUsers(req, res){
    const {active} = req.query;
    let response = null;

    //console.log("active->", active); SE USO PARA PRUEBA

    if(active === undefined){
        response = await User.find();
    } else {
        response = await User.find({active});
    }

      //  console.log(response);

        res.status(200).send(response); // **se uso para revisar funciona

}

async function createUser(req, res){
    const {password} = req.body;
    const user = new User({...req.body, active:false});

    const salt= bcrypt.genSaltSync(10);
    const hasPassword = bcrypt.hashSync(password,salt);
    user.password = hasPassword;

    if(req.files.avatar){
        const imagePath = image.getFilePath(req.files.avatar);
        user.avatar = imagePath;
    }

    user.save((error, userStored) => {
        if(error){
            res.status(400).send({msg:"Error al crear usuario"});
        } else {
            res.status(201).send(userStored);
        }
    });
}

async function updateUser(req, res){
    const {id} = req.params;
    const userData = req.body;

    //password 
    if(userData.password){
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(userData.password, salt);        
        userData.password = hashPassword;
    } else {
        delete userData.password;       
    }

    //avatar 
    if(req.files.avatar){
        const imagePath = image.getFilePath(req.files.avatar);
        userData.avatar = imagePath;    }

    User.findByIdAndUpdate({_id: id}, userData, (error)=>{
        if(error){
            res.status(400).send({msg:"Error al actualizar usuario"});
        } else {
            res.status(200).send({msg: "Actualizacion correcta"});
        }
    });

}

async function deleteUser(req, res) {
    const {id} =req.params;

    User.findByIdAndDelete(id, (error) =>{
        if(error){
            res.status(400).send({msg:"Error al eliminar usuario"});            
        } else {
            res.status(200).send({msg:"Usuario eliminado"});
        }
    });
}
module.exports ={
    getMe,
    getUsers,    
    createUser,
    updateUser,
    deleteUser,
};