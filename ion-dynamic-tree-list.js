"use strict";
/* global angular */

var CONF = {
    baseUrl: 'lib/ion-dynamic-tree-list',
    digestTtl: 35
};

function toggleCollapse(obj) {
    for (var key in obj) {
        if (obj[key] && typeof (obj[key]) === 'object') {
            obj[key].collapsed = !obj[key].collapsed;
            toggleCollapse(obj[key]);
        }
    }
    return obj;
}

function buildRoot(options) {
    var noofchildren, children, e, id, o, pid, temp, _i, _len, _ref;
    id = options.id || "id";
    pid = options.parentid || "parentid";
    children = options.children || "tree";
    noofchildren = options.noofchildren || "noofchildren";
    temp = {};
    o = [];
    _ref = options.q;

    // 1st pass: set up the basic
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        e[children] = [];
        e[noofchildren] = 0;
        temp[e[id]] = e;
    }

    // 2nd pass: find no. of children. Reason: no assumption that root's parent is defined before the child in the array
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if (temp[e[pid]] !== undefined) {
            temp[e[pid]][noofchildren]++;
        } else {
            // root level
            e["depth"] = 1;
            e["collapsed"] = true;
            o.push(e);
        }
    }
    return o;
}

angular.module('ion-dynamic-tree-list', [], ['$rootScopeProvider', function ($rootScopeProvider) {
    $rootScopeProvider.digestTtl(CONF.digestTtl)
}])
    .directive('ionDynamicTreeList', [function () {
        return {
            restrict: 'E',
            scope: {
                items: '=',
                source: '=',
                collapsed: '=',
                templateUrl: '@',
                showReorder: '='
            },

            templateUrl: CONF.baseUrl + '/ion-dynamic-tree-list.tmpl.html',

            controller: ['$scope', function ($scope) {

                $scope.baseUrl = CONF.baseUrl;

                $scope.toggleCollapse = function (item) {

                    if (item && item.noofchildren > 0 && item.tree.length === 0) {

                        // The javascript native filter & foreach array is slow. Using for loop here
                        for (var i = 0, len = $scope.source.length; i < len; i++) {
                            var curItem = $scope.source[i];
                            if (curItem.parentid === item.id) {
                                curItem.depth = item.depth + 1;
                                curItem.collapse = true;
                                item.tree.push(curItem);
                            }
                        }
                    }

                    if (item) {
                        toggleCollapse(item);
                    }

                };

                $scope.emitChosenEvent = function (item) {
                    $scope.$emit('$ionDynamicTreeList:ItemChosen', item)
                };

                $scope.moveItem = function (item, fromIndex, toIndex) {
                    $scope.items.splice(fromIndex, 1);
                    $scope.items.splice(toIndex, 0, item);
                };

                $scope.$watch('source', function () {
                    if (typeof $scope.source !== "undefined") {
                        $scope.items = buildRoot({q: $scope.source});
                    }
                });

            }],
            compile: function (element, attrs) {
                attrs.templateUrl = attrs.templateUrl ? attrs.templateUrl : 'item_default_renderer';
            }
        }
    }]);
