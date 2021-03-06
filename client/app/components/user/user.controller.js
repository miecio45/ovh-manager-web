angular.module("App").controller("UserCtrl", [
    "$scope",
    "User",
    "ssoAuthentication",
    function ($scope, User, authentication) {
        "use strict";

        $scope.user = null;

        $scope.logout = () => authentication.logout();

        User.getUser().then((user) => ($scope.user = user));
    }
]);
