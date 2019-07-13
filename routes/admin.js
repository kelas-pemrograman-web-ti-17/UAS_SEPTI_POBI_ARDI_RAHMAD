var express = require('express');
var crypto = require('crypto')

var User = require('../model/user')
var Optik = require('../model/optik')
var Auth_middleware = require('../middlewares/auth')

var router = express.Router();
var secret = 'rahasia'
var session_store

/* GET users listing. */
router.get('/admin', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    User.find({}, function(err, user) {
        console.log(user);
        res.render('admin/home', { session_store: session_store, users: user })
    }).select('username email firstname lastname users createdAt updatedAt')
});

/* GET users listing. */
router.get('/dataoptik', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Optik.find({}, function(err, optik) {
        //console.log(buku);
        res.render('admin/optik/table', { session_store: session_store, optiks: optik })
    }).select('_id idproduk jenis merk harga garansi created_at')
});

/* GET users listing. */
router.get('/inputdata', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session
    res.render('admin/optik/input_data', { session_store: session_store})
});

//input data buku
router.post('/inputdata', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Optik.find({ idproduk: req.body.idproduk }, function(err, optik) {
        if (optik.length == 0) {
            var dataoptik = new Optik({
                idproduk: req.body.idproduk,
                jenis: req.body.jenis,
                merk: req.body.merk,
                harga: req.body.harga,
                garansi: req.body.garansi,
            })
            dataoptik.save(function(err) {
                if (err) {
                    console.log(err);
                    req.flash('msg_error', 'Maaf, nampaknya ada masalah di sistem kami')
                    res.redirect('/dataoptik')
                } else {
                    req.flash('msg_info', 'User telah berhasil dibuat')
                    res.redirect('/dataoptik')
                }
            })
        } else {
            req.flash('msg_error', 'Maaf, kode buku sudah ada....')
            res.render('admin/optik/input_data', {
                session_store: session_store,
                idproduk: req.body.idproduk,
                jenis: req.body.jenis,
                merk: req.body.merk,
                harga: req.body.harga,
                garansi: req.body.garansi,
            })
        }
    })
})

//menampilkan data berdasarkan id
router.get('/:id/editdata', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Optik.findOne({ _id: req.params.id }, function(err, optik) {
        if (optik) {
            console.log("optiksss"+optik);
            res.render('admin/optik/edit_data', { session_store: session_store, optiks: optik })
        } else {
            req.flash('msg_error', 'Maaf, Data tidak ditemukan')
            res.redirect('/dataoptik')
        }
    })
})

router.post('/:id/editdata', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Optik.findById(req.params.id, function(err, optik) {
        optik.idproduk = req.body.idproduk;
        optik.jenis = req.body.jenis;
        optik.merk = req.body.merk;
        optik.harga = req.body.harga;
        optik.garansi = req.body.garansi;

        optik.save(function(err, user) {
            if (err) {
                req.flash('msg_error', 'Maaf, sepertinya ada masalah dengan sistem kami...');
            } else {
                req.flash('msg_info', 'Edit data berhasil!');
            }

            res.redirect('/dataoptik');

        });
    });
})

router.post('/:id/delete', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    Optik.findById(req.params.id, function(err, optik){
        optik.remove(function(err, optik){
            if (err)
            {
                req.flash('msg_error', 'Maaf, kayaknya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Data Optik berhasil dihapus!');
            }
            res.redirect('/dataoptik');
        })
    })
})

module.exports = router;