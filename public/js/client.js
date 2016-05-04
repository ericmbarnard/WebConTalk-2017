angular.module('class-manager', []);

angular.module('class-manager')
.controller('ReposController', ["$scope", "page-data", function($scope, pageData){
    
    $scope.repos = pageData;
    
}]);
angular.module("class-manager")
.factory("page-data", function(){
    
    return window.pageData;
    
});