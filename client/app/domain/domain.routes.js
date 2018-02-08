angular.module("App").config(($stateProvider) => {
    "use strict";

    $stateProvider.state("app.domains", {
        "abstract": true,
        template: "<div ui-view></div>"
    });

    $stateProvider.state("app.domains.product", {
        url: "/configuration/domain/:productId?tab",
        templateUrl: "domain/domain.html",
        controller: "DomainCtrl",
        controllerAs: "ctrlDomain",
        reloadOnSearch: false,
        params: {
            tab: null
        },
        resolve: {
            currentSection: () => "domain",
            navigationInformations: [
                "Navigator",
                "$rootScope",
                (Navigator, $rootScope) => {
                    $rootScope.currentSectionInformation = "domain";
                    return Navigator.setNavigationInformation({
                        leftMenuVisible: true,
                        configurationSelected: true
                    });
                }
            ],
            translator: ["translator", (translator) => translator.load(["domain", "email", "hosting", "domainsOperations"]).then(() => translator)]
        }
    });

    $stateProvider.state("app.domains.alldom", {
        url: "/configuration/all_dom/:allDom/:productId?tab",
        templateUrl: "domain/domain.html",
        controller: "DomainCtrl",
        controllerAs: "ctrlDomain",
        reloadOnSearch: false,
        params: {
            tab: null
        },
        resolve: {
            currentSection: () => "domain",
            navigationInformations: [
                "Navigator",
                "$rootScope",
                (Navigator, $rootScope) => {
                    $rootScope.currentSectionInformation = "all_dom";
                    return Navigator.setNavigationInformation({
                        leftMenuVisible: true,
                        configurationSelected: true
                    });
                }
            ],
            translator: ["translator", (translator) => translator.load(["domain", "email", "hosting", "domainsOperations"]).then(() => translator)]
        }
    });
});
