var express = require('express');
var router = express.Router();
var github = require('../common/github');

router.get("/repos/", function(req, res, next){
    
    github.getReposForUser(req.user)
    .then(function(data){
        res.json(data);
    }, function(err){
        next(err);
    });
    
});