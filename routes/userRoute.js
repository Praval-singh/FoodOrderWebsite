const express = require('express');
const router = express.Router();
const User = require("../models/userModel")



router.post("/register", (req, res) => {
    const { name, email, password } = req.body
    const newUser = new User({ name, email, password })

    try {
        newUser.save()
        res.send("User Registered Successfully")
    } catch (error) {
        return res.status(400).json({ message: error })
    }
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.find({ email, password })
        if (user.length > 0) {
            const currentUser = {
                name: user[0].name,
                email: user[0].email,
                isAdmin: user[0].isAdmin,
                _id: user[0]._id
            }
            res.send(currentUser);
        }
        else {
            return res.status(400).json({ message: 'User login failed' });
        }
    } catch (error) {
        return res.status(400).json({ message: 'Something went wrong' });
    }
});




module.exports = router;




// const express = require('express');
// const router = express.Router();
// const User = require("../models/userModel")

// router.post("/register", async (req, res) => {
//     const { name, email, password } = req.body;
//     const newUser = new User({ name, email, password });

//     try {
//         await newUser.save();
//         res.status(201).send("User registered successfully");
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email, password });

//         if (user) {
//             const currentUser = {
//                 name: user.name,
//                 email: user.email,
//                 isAdmin: user.isAdmin,
//                 _id: user._id
//             };

//             res.status(200).json(currentUser);
//         } else {
//             res.status(400).json({ message: "Invalid email or password" });
//         }
//     } catch (error) {
//         res.status(400).json({ message: "Something went wrong" });
//     }
// });

// module.exports = router;
