const jwt = require("../utils/jwt");

function asureAuth(req, res, next) {
    if(!req.headers.authorization){
       return res.status(403).send({msg:"la peticion no tiene cabecera de autentificacion"});
    }

    const token = req.headers.authorization.replace("Bearer ","");

    try {
        const payload = jwt.decoded(token);
        const {exp} = payload;
        const currentData = new Date().getTime();

        if(exp <= currentData){
            return res.status(400).send({msg: "el token ha expirado"});
        }

        req.user = payload;
        next();
    } catch (con) {
        return res.status(400).send({msg:"token invalido"});
    }    
}

module.exports = {
    asureAuth,
};