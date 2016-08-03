var fenixApp = angular.module('fenixApp', ['ngRoute']);

fenixApp.factory('socket', ['$rootScope', function($rootScope) {
    var socket = io.connect();
    console.log("socket created");

    return {
        on: function(eventName, callback) {
            function wrapper() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            }

            socket.on(eventName, wrapper);

            return function() {
                socket.removeListener(eventName, wrapper);
            };
        },

        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
}]);
fenixApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    //route for home page
        .when('/', {
        templateUrl: '/',
        controller: 'mainController'
    })
}]);
fenixApp.controller('mainController', function($scope, socket) {
    $scope.recievedTroughSocket = "still waiting for data...";
    $scope.sendWithSocket = function(msg) {
        socket.emit("something", msg);
    }
    socket.on("greetings", function(data) {
        console.log("user data: " + JSON.stringify(data));
        $scope.recievedTroughSocket = data.msg;
    });
});