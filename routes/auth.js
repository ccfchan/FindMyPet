const express = require('express');
const router = express.Router();
const config = require('config');
const jwt = require ('jsonwebtoken');
const {check, validationResult} = require('express-validator/check');
const UserModel = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const auth = require('../middlewares/auth');




/** private route, Logged In users Can access it */
router.get('/', auth, async (req, res)   => {
   try {
       const user = await (await UserModel.findById(req.user.id)).Selected('-password');
       res.json(user);
   } catch (err) {
       console.log(err.message);
       res.status(500).send('error');

   }




});













router.post('/', [
    check('email', 'Please Enter Valid Email').isEmail(),
    check('password', 'Please Enter Password').exists()


],
   async (req, res) => {
    const errors = validationResult(req);
   if( !errors.isEmpty){
       return res.status(400).json({errors: errors.array()})
   }
   const {email, password}  = req.body;
   try {

       let user = await UserModel.findOne({email});
       if(!user){
           return res.status(400).json({msg: 'User not found with Provided Email'});
       } 

       const checkpassword = await bcrypt.compare(password, user.password);
       if (!checkpassword) {
           return res.status(400).json({ msg: 'Wrong Password'});
       }
       const payload = {
        user: {
            id: user.id
        }
    };
    jwt.sign(payload, config.get('SecretKey'), {
        expiresIn: 360000
    },(err, token) => {
        if(err) throw err;
        res.json({ token });      
    } )

   } catch (error) {
       console.log(error.message);
       res.status(500).send('Server Error');

   }    
   res.send('Data Passed');
});






module.exports = router;
