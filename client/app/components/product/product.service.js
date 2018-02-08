angular
    .module("services")
    .service("product", class Product {
        constructor (AllDom, constants, Emails, $http, $q, $rootScope) {
            this.AllDom = AllDom;
            this.constants = constants;
            this.Emails = Emails;
            this.$http = $http;
            this.$q = $q;
            this.$rootScope = $rootScope;

            this.selectedProduct = {
                name: "",
                organization: "",
                type: ""
            };
        }

        retrievingProducts () {
            const retrievingProductsFrom2API = this.$http.get("/sws/products", {
                serviceType: "aapi",
                params: {
                    universe: this.constants.universe || "WEB",
                    worldPart: this.constants.target
                }
            });

            return this.$q
                .all([retrievingProductsFrom2API, this.AllDom.getAllDoms(true), this.Emails.getDelegatedEmails()])
                .then((allProducts) => transformProductRetrievalResult(allProducts));

            function transformProductRetrievalResult (allProducts) {
                const userProducts = allProducts[0].data;
                const allDomains = allProducts[1];
                const delegationEmails = allProducts[2];

                const products = {
                    domains: {
                        values: userProducts.domains,
                        children: {
                            allDomains: _(allDomains).map((domainName) => transformNameToProduct(domainName)).value()
                        }
                    },
                    emails: {
                        values: _(delegationEmails).map((email) => transformDelegationEmailToStandardEmail(email)).value()
                    }
                };

                const platforms = removeOldExchangePlatforms(userProducts);

                if (_(platforms).isArray()) {
                    products.platforms = platforms;
                }

                return products;
            }

            function transformNameToProduct (name, type) {
                return {
                    displayName: name,
                    name,
                    type
                };
            }

            function transformDelegationEmailToStandardEmail (delegationEmail) {
                const emailContainsAtSign = /@/.test(delegationEmail);

                if (!emailContainsAtSign) {
                    throw new TypeError("delegationEmail should be an email address");
                }

                const domainName = delegationEmail.split("@")[1];

                return transformNameToProduct(domainName, "EMAIL_DELEGATE");
            }

            function removeOldExchangePlatforms (products) {
                const hasOldExchangePlatforms = _(products.platforms).isArray();

                if (hasOldExchangePlatforms) {
                    const productsWithoutOldExchangePlatforms = _(products.platforms).filter((product) => product.type !== "EXCHANGE_OLD");
                    return _(productsWithoutOldExchangePlatforms).uniq((product) => product.name);
                }

                return products.platforms;
            }
        }

        retrievingSelectedProduct () {
            return this.$q.when(true);

            /* return this.retrievingProducts()
                .then((productsList) => {
                    let productLength = productsList.length;

                    if ($.isEmpty(selectedProduct.name)) {
                        selectedProduct.name = $stateParams.productId ? $stateParams.productId : "";
                        selectedProduct.type = $rootScope.currentSectionInformation ? $rootScope.currentSectionInformation.toUpperCase() : null;
                        selectedProduct.organization = $stateParams.organization ? $stateParams.organization : "";

                        if (selectedProduct.name === "") {
                            return {
                                name: "",
                                organization: "",
                                type: ""
                            };
                        }
                    }

                    for (productLength; productLength--;) {
                        if (productsList[productLength].name === selectedProduct.name && productsList[productLength].type === selectedProduct.type) {
                            return productsList[productLength];
                        } else if (productsList[productLength].hasSubComponent === true) {
                            let i = 0;
                            let found;

                            while (!found && i < productsList[productLength].subProducts.length) {
                                if (productsList[productLength].subProducts[i].name === selectedProduct.name && productsList[productLength].subProducts[i].type === selectedProduct.type) {
                                    found = productsList[productLength].subProducts[i];
                                }
                                i++;
                            }
                            if (found) {
                                return found;
                            }
                        }
                    }

                    return null;
                });*/
        }

        setSelectedProduct () {
            /* const inputIsInvalid = !_(product).isString() && !_(product).isObject();

            if (inputIsInvalid) {
                throw new TypeError("product should be either an object or a string");
            }

            if (_(product).isString()) {
                this.selectedProduct.name = product;
            } else {
                const noDataAvailable = _(product.name).isEmpty() && _(product.type).isEmpty();

                if (noDataAvailable) {
                    this.selectedProduct = product;
                } else {
                    this.selectedProduct.name = product.name;
                    this.selectedProduct.type = product.type;
                }
            }


            if (product) {
                if (angular.isString(product)) {
                    selectedProduct.name = product;
                } else if (angular.isObject(product)) {
                    if (product.name === "" && product.type === "") {
                        selectedProduct = product;
                    } else {
                        selectedProduct.name = product.name;
                        selectedProduct.type = product.type;
                    }
                }
            }

            return this.getSelectedProduct().then((p) => {
                selectedProduct.type = p.type;
                $rootScope.$broadcast("changeSelectedProduct", p);
                return p;
            });*/

            return this.$q.when(true);
        }

        removeSelectedProduct () {
            /* return this.setSelectedProduct({
                name: "",
                type: ""
            }).then((p) => {
                $rootScope.$broadcast("removeSelectedProduct");
                return p;
            });*/

            return this.$q.when(true);
        }
    });/*

    [
    "$rootScope",
    "$http",
    "$q",
    "constants",
    "$stateParams",
    "AllDom",
    "Emails",
    function ($rootScope, , constants, $stateParams, AllDom, Emails) {
        "use strict";

        const requests = {
            productsList: null
        };

        function resetCache () {
            products = null;
            productsByType = null;
            requests.productsList = null;
        }

        /*
         * get product by SWS
         *//*
        this.getProducts = function (forceRefresh) {
            if (forceRefresh === true) {
                resetCache();
            }
            return $q
                .when(true)
                .then(() => {
                    if (!products) {
                        if (requests.productsList === null) {
                            requests.productsList = $q
                                .all([
                                    $http.get("/sws/products", {
                                        serviceType: "aapi",
                                        params: {
                                            universe: constants.universe || "WEB",
                                            worldPart: constants.target
                                        }
                                    }),
                                    AllDom.getAllDoms(true),
                                    Emails.getDelegatedEmails()
                                ])
                                .then((data) => {
                                    const result = data[0];
                                    const allDoms = data[1];

                                    if (result.status < 300) {
                                        productsByType = result.data;

                                        _.forEach(data[2], (email) => {
                                            const splitted = email.split("@");
                                            if (splitted.length >= 2) {
                                                if (_.find(productsByType.emails, { name: splitted[1] }) == null) {
                                                    const domain = splitted[1];
                                                    productsByType.emails.push({
                                                        displayName: domain,
                                                        hasSubComponent: false,
                                                        name: domain,
                                                        type: "EMAIL_DELEGATE",
                                                        delegate: true
                                                    });
                                                }
                                            }
                                        });

                                        /* Exchange 25g *//*
                                        if (productsByType && productsByType.platforms && productsByType.platforms.length) {
                                            // 1. Remove all occurances and put them in other var
                                            let exchangeOld = _.remove(productsByType.platforms, (a) => a.type === "EXCHANGE_OLD");
                                            if (exchangeOld && exchangeOld.length) {
                                                // 2. Merge all domain to an uniq array
                                                exchangeOld = _.uniq(exchangeOld, (a) => a.name);

                                                // 3. Push to products array
                                                productsByType.platforms = productsByType.platforms.concat(exchangeOld);
                                            }
                                        }

                                        if (!products) {
                                            products = [];
                                        }

                                        let productDomains = [];
                                        const allDomains = _.pluck(productsByType.domains, "name");
                                        const allDomainsOnly = _.pluck(productsByType.domains.filter((x) => x.type === "DOMAIN"), "name");
                                        const allZones = _.pluck(productsByType.domains.filter((x) => x.type === "ZONE" && allDomainsOnly.indexOf(x.name) === -1), "name");

                                        if (allDoms && allDoms.length > 0) {
                                            productsByType.allDoms = [];
                                            return $q
                                                .allSettled(
                                                    allDoms.map((allDom) =>
                                                        AllDom.getDomains(allDom).then(
                                                            (domains) => {
                                                                productDomains = productDomains.concat(allDomains.filter((d) => !~domains.indexOf(d)));

                                                                productsByType.allDoms.push({
                                                                    name: allDom,
                                                                    displayName: allDom,
                                                                    hasSubComponent: true,
                                                                    type: "ALL_DOM",
                                                                    subProducts: _.intersection(allDomains, domains).map((d) => ({
                                                                        name: d,
                                                                        displayName: d,
                                                                        allDomName: allDom,
                                                                        allDomZoneOnly: allZones.indexOf(d) !== -1,
                                                                        type: allZones.indexOf(d) !== -1 ? "ZONE" : "ALL_DOM"
                                                                    }))
                                                                });
                                                            },
                                                            (err) => ({ error: err, allDom })
                                                        )
                                                    )
                                                )
                                                .then(() => {
                                                    if (productsByType.allDoms.length > 0) {
                                                        const d = productsByType.domains.filter((domain) => ~productDomains.indexOf(domain.name));

                                                        productsByType.domains = productsByType.allDoms.concat(_.sortBy(d, (elt) => elt.name));
                                                    }

                                                    ["domains", "hostings", "exchanges", "sharepoints", "vps", "cdns", "emails", "licenseOffice", "allDoms", "emailPros"].forEach((type) => {
                                                        products = products.concat(productsByType[type] || []);
                                                    });

                                                    return products;
                                                });
                                        }

                                        ["domains", "hostings", "exchanges", "sharepoints", "vps", "cdns", "emails", "licenseOffice", "emailPros"].forEach((type) => {
                                            products = products.concat(productsByType[type] || []);
                                        });

                                        return products;
                                    }
                                    return $q.reject(data);
                                });
                        }

                        return requests.productsList;
                    }
                    return products;
                })
                .then(() => products, (reason) => $q.reject(reason));
        };

        /*
         * Get list of products orderBy Type
         *//*
        this.getProductsByType = function () {
            return this.getProducts().then(() => productsByType);
        };

        /*
         * Get the selected product
         *//*
        this.getSelectedProduct = function (forceRefresh) {
            if (forceRefresh) {
                selectedProduct = {
                    name: "",
                    organization: "",
                    type: ""
                };
            }

            return this.getProducts(forceRefresh).then((productsList) => {
                let productLength = productsList.length;

                if ($.isEmpty(selectedProduct.name)) {
                    selectedProduct.name = $stateParams.productId ? $stateParams.productId : "";
                    selectedProduct.type = $rootScope.currentSectionInformation ? $rootScope.currentSectionInformation.toUpperCase() : null;
                    selectedProduct.organization = $stateParams.organization ? $stateParams.organization : "";

                    if (selectedProduct.name === "") {
                        return {
                            name: "",
                            organization: "",
                            type: ""
                        };
                    }
                }

                for (productLength; productLength--;) {
                    if (productsList[productLength].name === selectedProduct.name && productsList[productLength].type === selectedProduct.type) {
                        return productsList[productLength];
                    } else if (productsList[productLength].hasSubComponent === true) {
                        let i = 0;
                        let found;

                        while (!found && i < productsList[productLength].subProducts.length) {
                            if (productsList[productLength].subProducts[i].name === selectedProduct.name && productsList[productLength].subProducts[i].type === selectedProduct.type) {
                                found = productsList[productLength].subProducts[i];
                            }
                            i++;
                        }
                        if (found) {
                            return found;
                        }
                    }
                }

                return null;
            });
        };

        /*
         * set the selected product by Id
         *//*
        this.setSelectedProduct = function (product) {
            if (product) {
                if (angular.isString(product)) {
                    selectedProduct.name = product;
                } else if (angular.isObject(product)) {
                    if (product.name === "" && product.type === "") {
                        selectedProduct = product;
                    } else {
                        selectedProduct.name = product.name;
                        selectedProduct.type = product.type;
                    }
                }
            }

            return this.getSelectedProduct().then((p) => {
                selectedProduct.type = p.type;
                $rootScope.$broadcast("changeSelectedProduct", p);
                return p;
            });
        };

        /*
         * set the selected product by Id
         *//*
        this.removeSelectedProduct = function () {
            return this.setSelectedProduct({
                name: "",
                type: ""
            }).then((p) => {
                $rootScope.$broadcast("removeSelectedProduct");
                return p;
            });
        };

        /**
         * Get working-status for the specified product
         *//*
        this.getWorks = function (product) {
            return $http.get(`${constants.aapiRootPath}working-status/${product}`).then((resp) => resp.data);
        };

        this.getProducts(true);
    }
]);*/
