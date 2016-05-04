var express = require('express');
var router = express.Router();
var github = require('../common/github');

/* GET home page. */
router.get('/', function(req, res, next) {
    
    var model = {
        repos: [],
        orgs: []
    };
    
    github.getReposForUser(req.user)
    .then(function(repos){
        model.repos = repos || [];
        
        return github.getOrgsForUser(req.user);  
    })
    .then(function(orgs){
        
        model.orgs = orgs || [];
        
    })
    .then(function(){
        res.render('index', { model: model});
    })
    .catch(function(err){
       next(err); 
    });
});

module.exports = router;

