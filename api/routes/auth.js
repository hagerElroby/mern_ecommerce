const express = require("express");
const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN

// router.post('/login', async (req, res) => {
//     try{
//         const user = await User.findOne(
//             {
//                 userame: req.body.username
//             }
//         );

//         !user && res.status(401).json("Wrong User Name");
//         const hashedPassword = CryptoJS.AES.decrypt(
//             user.password,
//             process.env.PASS_SEC
//         );
//         const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8); 
//         const inputPassword = req.body.password;
        
//         originalPassword != inputPassword && 
//             res.status(401).json("Wrong Password");

//         const accessToken = jwt.sign(
//         {
//             id: user._id,
//             isAdmin: user.isAdmin,
//         },
//         process.env.JWT_SEC,
//             {expiresIn:"3d"}
//         );
  
//         const { password, ...others } = user._doc;  
//         res.status(200).json({...others, accessToken});

//     }catch(err){
//         console.log(err)
//         res.status(500).json(err);
        
//     }

// });


router.post('/login', async (req, res) => {
  try {
      const user = await User.findOne({
          username: req.body.username
      });

      if (!user) {
          res.status(401).json("Wrong Username");
          return;
      }

      // Compare the password provided in the request with the one stored in the database
      if (user.password === req.body.password) {
          // If passwords match, you can send a success response
          res.status(200).json("Login successful");
      } else {
          res.status(401).json("Wrong Password");
      }

  } catch (err) {
      res.status(500).json(err);
      console.log(err);
  }
});

// POST /api/auth/login
// router.post("/login", async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Find the user by username
//     const user = await User.findOne({ username });

//     if (!user) {
//       return res.status(401).json({ message: "Authentication failed" });
//     }

//     // Compare the provided password with the hashed password stored in the database
//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Authentication failed" });
//     }

//     // Generate an access token
//     const accessToken = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.status(200).json({ accessToken });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "An error occurred" });
//   }
// });


module.exports = router;