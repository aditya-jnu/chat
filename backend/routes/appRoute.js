const express=require('express')
const router=express.Router();

//importing the controller
const{signUp,signIn}=require('../controllers/upUser')
const createToken = require('../controllers/createToken')

//mapping
router.post("/signin",signIn)
router.post("/signup",signUp)
router.get('/room',function(request, response) {
    const identity = request.query.identity || 'identity';
    const room = request.query.room;
    response.json({ token: createToken(identity, room) });
})

module.exports=router;