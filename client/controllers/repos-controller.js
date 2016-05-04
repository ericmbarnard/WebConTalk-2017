
angular.module('class-manager')
.controller('ReposController', ["$scope", "page-data", function($scope, pageData){
    
    $scope.repos = pageData;
    
}]);