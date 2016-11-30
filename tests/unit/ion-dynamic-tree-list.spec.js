'use strict';
/* global angular, inject, spyOn, expect */

describe('Directives', function () {
    var templateCache, scope, element, Directive,
        templateUrl = 'ion-dynamic-tree-list.tmpl.html',
        items = [],
        source = [{id: 1, parentid: 0, name: 'task 1'},
            {id: 2, parentid: 1, name: 'task 1.1'},
            {id: 3, parentid: 0, name: 'task 2'},
            {id: 4, parentid: 0, name: 'task 3'}
        ];


    beforeEach(module('ion-dynamic-tree-list'));
    beforeEach(module(templateUrl));
    beforeEach(inject(
        function ($rootScope, $compile, $templateCache, $injector) {
            Directive = function () {
                this.directive = $injector.get('ionDynamicTreeListDirective');
                this.directive[0].templateUrl = templateUrl;  // Override baseUrl for custom templates
                this.element = $compile(angular.element('<ion-dynamic-tree-list items="" source="source"></ion-dynamic-tree-list>'))(scope);
                this.element.scope().$apply();
                this.isolateScope = this.element.isolateScope()
            };

            scope = $rootScope.$new();
            scope.source = source;
            scope.items = items;
            scope.$digest();
            templateCache = $templateCache;
        }
    ));

    describe('ion-dynamic-tree-list', function () {

        var d;

        beforeEach(function () {
            d = new Directive('ionDynamicTreeList')
        });

        it('has the ion dynamic tree list directive', function () {
            expect(d.directive).toBeDefined()
        });

        it('logs a template for cart-item.html', function () {
            expect(templateCache.get('ion-dynamic-tree-list.tmpl.html')).toBeDefined()
        });

        it('has an isolate scope', function () {
            expect(d.isolateScope).toBeDefined()
        });

        it('has an isolate scope with a "items" property on it', function () {
            expect(d.isolateScope.items).toBeDefined()
        });

        it('has a moveItem method', function () {
            expect(typeof d.isolateScope.moveItem).toBe('function')
        });

        it('items have the same of elements as in scope', function () {
            expect(d.element[0].querySelectorAll('.item').length).toBe(3);
            // since the child task 1.1 is not expanded/included yet.
        });

        it('add an element after clicking/expanding the first tree', function () {
            var items = d.element.find('ion-item'), item0 = items[0].children[0].children[0];
            item0.click();
            // sync behavior since no $timeout parameter
            expect(d.element[0].querySelectorAll('.item').length).toBe(4);
        });


        it('items has the correct className assigned', function () {

            var items = d.element.find('ion-item'), item0 = items[0].children[0].children[0];
            item0.click();
            // sync behavior since no $timeout parameter

            var list = d.element[0].children[3].children[0],
                classNameFirst = list.children[0].className,
                classNameFirstNested = list.children[1].children[0].className;

            expect(classNameFirst).toBe('item item-icon-left item-icon-right depth-1');
            expect(classNameFirstNested).toBe('item item-icon-left item-icon-right depth-2');
        });

        it('has a emitChosenEvent method', function () {
            expect(typeof d.isolateScope.emitChosenEvent).toBe('function')
        });

        it('has an emitEvent on item click called $ionDynamicTreeList:ItemChosen', function () {
            spyOn(d.isolateScope, '$emit');

            var items = d.element.find('ion-item'), item0 = items[0].children[2];
            item0.click();
            d.isolateScope.$digest();

            expect(d.isolateScope.$emit).toHaveBeenCalled();
            expect(d.isolateScope.$emit).toHaveBeenCalledWith('$ionDynamicTreeList:ItemChosen', d.isolateScope.items[0]);
        });

    })
});
