angular.module("App").config(($stateProvider) => {
    "use strict";

    $stateProvider.state("app", {
        "abstract": true,
        url: "",
        controller: "AppCtrl",
        controllerAs: "AppCtrl",
        templateUrl: "app.html"
    });

    $stateProvider.state("app.microsoftProducts", {
        "abstract": true,
        template: "<div ui-view></div>"
    });
});
