var express = require('express');
var router = express.Router();
var github = require('../common/github');

/* GET home page. */
router.get('/', function(req, res, next) {
    
    github.getReposForUser(req.user)
    .then(function(data){
        
        res.render('index', { model: data });    
        
    }, function(err){
        next(err);
    });
    
});

module.exports = router;

