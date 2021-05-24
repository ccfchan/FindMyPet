const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator/check');
const UserModel = require('../models/UserModel');
const PeUserModel = require('../models/PetUserModel');
const auth = require('../middlewares/auth');
const PetUserModel = require('../models/PetUserModel');

/** Show All PetUser Information*/
router.get('/', auth, (req, res ) => {
    res.send('Show PetUser')
});


/** Save PetUser Information */
router.post('/', [auth, 
    check('name', ' is renamequired').not().isEmpty(),        // Checking
    check('email', 'Please enter Valid Email').isEmail(),
    check('petname', 'pet name is required').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {name, email, phone, petname, age} = req.body;
    try {
        const newPetUser = new PeUserModel({
            name,
            email,
            phone,
            petname,
            age,
            user: req.user.id
           

        });
        const savePetUser = await newPetUser.save();
        res.json(savePetUser);
    } catch(err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }

    
});

/** Edit PetUser Information  */
router.put('/:id', auth, async(req, res ) => {
    const {name, email, phone, petname, age } = req.body;
    const petsuserfields = {};
    if(name) petsuserfields.name = name;
    if(email) petsuserfields.email = email;
    if(phone) petsuserfields.phone = phone;
    if(petname) petsuserfields.petname = petname;
    try {

        let petusers = await PeUserModel.findById(req.params.id);
        if(!petusers){
            return res.status(404).json({msg: 'PetUser not found.....'})
        }
        petusers = await PetUserModel.findByIdAndUpdate(req.params.id, {
            $set: petsuserfields
        },{ new: true});
        res.json(petusers)
    
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');

    }


});

/** Delete PetUser Information */
router.delete('/:id', auth, async(req, res ) => {
    try{
        let petUsr = await PetUserModel.findById(req.params.id);
        if(!petUsr){
            return res.status(401).json({msg: 'Pet Usre Not found'})
        }
        await PeUserModel.findByIdAndRemove(req.params.id);
        res.json({msg: 'PetUser deleted'})
    } catch (err) {

      console.log(err.message);
      res.status(500).send('Server Error');
      


    }
});

module.exports = router;

