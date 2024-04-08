const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../userModel');
const { default: mongoose } = require('mongoose');

const routerUser = express();

const uploadDir = path.join(__dirname, 'uploads');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

routerUser.post('/register', upload.single('avatar'), async (req, res) => {
    const { username, password } = req.body;
    const avatar = req.file;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const newUser = new User({
            username,
            password,
            avatar: avatar ? avatar.filename : 'default.jpg'
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

routerUser.post('/login', async (req, res) => {
    let user = await User.findOne({ username: req.body.username });
    if (user) {
        if (user && user.password === req.body.password) {
            console.log("Đăng nhập thành công");
            user.password=null;
            res.status(200);
            res.send({user});
        }else{
            console.log("Sai mật khẩu");
            res.status(401).json({message:"Sai mật khẩu"});
        }
    } else {
        res.status(401).json({message:"Tài khoản không tồn tại"});
    }
})

module.exports = routerUser;
