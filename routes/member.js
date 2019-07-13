var express = require('express');
var crypto = require('crypto');

var User = require('../model/user')
var Optik = require('../model/optik')
var Auth_middleware = require('../middlewares/auth')

var router = express.Router();
var secret = 'rahasia'
var session_store

/* GET users listing. */
router.get('/member', Auth_middleware.check_login, Auth_middleware.is_member, function(req, res, next) {
    session_store = req.session

    User.find({}, function(err, user) {
        console.log(user);
        res.render('admin/home', { session_store: session_store, users: user })
    })
});

/* GET users listing. */
router.get('/dataoptikmember', Auth_middleware.check_login, Auth_middleware.is_member, function(req, res, next) {
    session_store = req.session

    Optik.find({}, function(err, optik) {
        console.log(optik);
        res.render('admin/optik/table', { session_store: session_store, optiks: optik })
    }).select('_id idproduk jenis merk harga garansi created_at')
});





module.exports = router;