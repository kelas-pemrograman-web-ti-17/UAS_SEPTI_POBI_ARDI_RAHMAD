const mongoose = require('mongoose');
const optikSchema = mongoose.Schema({
    idproduk        : {type: String, unique: true},
    jenis 		    : String,
    merk 	        : String,
    harga	        : String,
    garansi	        : String,
    created_at		: String
});
module.exports = mongoose.model('optik', optikSchema);