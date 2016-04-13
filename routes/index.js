var express = require('express');
var GitHubClient = require("github4");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/repos", function(req, res, next){
    
    var client = new GitHubClient({
        debug: true,
        protocol: "https",
        headers: {
            "user-agent": "Class-Manager"
        }
    });
    
    client.authenticate({
        type: "oauth",
        token: req.user.accessToken
    });
    
    client.repos.getForUser({ 
        user: req.user.username
    }, function(err, data){
        console.log(data);
    });
    
});

module.exports = router;
