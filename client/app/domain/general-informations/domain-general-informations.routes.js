angular.module("App").config(($stateProvider) => {
    "use strict";

    $stateProvider.state("app.domains.general-informations", {
        url: "/informations",
        templateUrl: "domain/general-informations/domain-general-informations.html",
        controller: "DomainTabGeneralInformationsCtrl"
    });
});
