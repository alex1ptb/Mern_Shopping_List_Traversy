const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
//User Model
const User = require('../../modals/User');

// @route POST api/users
// @desc Register Users
// @access Public
router.post('/', (_req,res) => {
	const {name, email, password} = _req.body;

	//simple validation
	if( !name || !email || !password){
		return res.status(400).json({ msg:'Please enter all fields'});
	}

	//check for existing user
	User.findOne({ email })
		.then(user => {
			if(user) return res.status(400).json({msg: 'User already exists'})

			const newUser = new User({
				name,
				email,
				password
			})

			//create salt & hash
			bcrypt.genSalt(10, (err, salt) =>  {
				bcrypt.hash(newUser.password, salt, (err,hash) =>{
					if(err) throw err;
					newUser.password = hash;
					newUser.save()
						.then(user => {
							res.json({
								user: {
									id: user.id,
									name: user.name,
									email: user.email
								}
							})
						})
				})
			});
		})
});

module.exports = router
