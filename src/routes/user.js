const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const unique = require('../middleware/unique');
const User = require('../models/user');
const multer = require('multer');
const check = require('../middleware/check');

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        console.log(file)
        if (!file.originalname.toLowerCase().match(/\.(jpg||jpeg||png)$/)) {
            return cb(new Error('Please upload image!'));
        }
        return cb(undefined, true)
    }

})

router.post('/Signup', unique, async (req, res) => {


    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        req.session.token = await token;
        res.send(true);
    }
    catch (e) {
        res.send(e);

    }
})

router.post('/Login', async (req, res) => {

    try {

        const result = await User.checkCredentials(req.body.Email, req.body.Password);
        if (!result) {

            return res.send({ error: 'Invalid Email/Password!' })
        }
        const token = await result.generateAuthToken();
        req.session.token = await token;
        res.redirect('/User/Profile');

    } catch (e) {

        res.send(e);
    }


})

router.get('/Profile', auth, async (req, res) => {
    res.send({ user: req.user })
})

router.get('/LoggedIn', auth, async (req, res) => {
    res.send(true)
})

router.post('/Upload/Dp', auth, upload.single('dp'), async (req, res) => {
    const Dp = await User.upload(req.file.buffer, req.user._id);
    res.send(Dp !== undefined ? { Dp } : undefined)
})

router.put('/Update', auth, async (req, res) => {

    const user = await User.update(req.body);
    if (!user) {
        return res.send({ error: 'There is a problem in update!' })
    }

    res.send(true)


})

router.put('/Update/Password', auth, check, async (req, res) => {

    const change = await User.updatePassword(req.body.NewPassword, req.user);
    if (change) {
        console.log('updated!')
        return res.send(true);
    }
    res.send({ error: 'Something went wrong!' })


})

router.get('/test', async (req, res) => {
    req.session.test = await "yes";
    res.send(req.session.test)
})

router.get('/testing', (req, res) => {

    res.send(req.session.test)

})


module.exports = router;