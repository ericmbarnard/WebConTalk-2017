
angular.module("class-manager")
.controller("TodoController", ["$scope", "$http", function TodoController($scope, $http){
    
    var url = "https://my-todos.org/list.json";
    
    $scope.myName = "John Doe";
    $scope.todoInput = "";
    
    
    
    $scope.complete = function(todo){
        todo.done = true;
        todo.completedOn = new Date();
    };
    
    $scope.remove = function(todo, $index){
        $scope.todos.splice($index, 1); // remove the todo from the array
    };
    
    $scope.addTodo = function(){
        var txt = $scope.todoInput;
        $scope.todos.push({
            job: txt,
            done: false,
            completedOn: null
        });
    }
    
    function init(){
        $http.get(url, {}).then(function(resp){
            $scope.todos = resp.data; // array of todo objects
        });
    }
}]);