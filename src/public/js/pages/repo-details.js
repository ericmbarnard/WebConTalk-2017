
angular.module('class-manager')
.controller('ReposController', ["$scope", "page-data", function($scope, pageData){
    
    function init(){
     
        var repos = (pageData.repos || []).map(function(x, i){
           return {
               full_name: x.full_name,
               url: x.url,
               created_at: x.created_at,
               pushed_at: x.pushed_at,
               open_issues_count: x.open_issues_count
           };
        });
                
        $scope.repos = repos;
    }   

    init()
}]);