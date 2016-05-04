var GitHubClient = require("github4");

var client = new GitHubClient({
    debug: true,
    protocol: "https",
    headers: {
        "user-agent": "Class-Manager"
    }
});

exports.getReposForUser = function(user){
    
    client.authenticate({
        type: "oauth",
        token: user.accessToken
    });
    
    return new Promise(function(resolve, reject){
       
        client.repos.getForUser({ 
            user: user.username
        }, function(err, data){
        
            if(err){
                reject(err);
                return;
            }
            
            resolve(data);
        });
        
    });
};