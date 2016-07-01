/// <reference path="bower_components/angular/angular.js" />

angular.module('angular-revive', [])
.constant('EmptyElement', '<div ng-transclude></<div>')
.constant('MessageSelectionChanged', 'select:SelectionChanged')
.constant('MessageItemSelected', 'select:ItemSelected')
.constant('MessageDisableItems', 'select:DisableItems')
.constant('MessageSelectReset', 'select:SelectReset')
.service('Utilities', function () {

    // value is defined
    this.isValue = function (value) {
        return (angular.isDefined(value) && (null !== value));
    }

    // value is a non-empty string
    this.isString = function (value) {
        return (this.isValue(value) && (typeof value === 'string') && ("" !== value));
    }

    // some optional scope parameters are presented in attrs although they were omitted by the user
    this.isOptionalParameter = function (scope, parameterName, attributes) {
        return (attributes.hasOwnProperty(parameterName) && angular.isDefined(attributes[parameterName]) && (null !== attributes[parameterName]));
    }
})
.directive('revive', function (EmptyElement, Utilities, $timeout, MessageItemSelected, MessageSelectionChanged, MessageDisableItems,
    MessageSelectReset) {
    return {
        scope: {
            disabledItems: '=',
            multiple: '@',
            resetSelect: '@',
        },
        template: EmptyElement,
        restrict: 'A',
        require: 'ngModel',
        transclude: Element,
        link: function (scope, element, attrs, ngModel) {
            var selections = [];
            var multipleSelections, maxSelections;
            var watchDisabled, watchreset, itemSelectedEvent;

            // set value of maximum number of selections
            var setMaxSelections = function () {

                if (multipleSelections) {
                    if (/^\d+$/.test(scope.multiple)) {
                        maxSelections = new Number(scope.multiple);
                    } else {
                        maxSelections = Number.MAX_SAFE_INTEGER;
                    }
                } else {
                    maxSelections = 1;
                }

                // if current number is less then number of selected items truncate selection array and broadcast selections
                broadcasstSelections();
            }

            // broadcast selections set
            var broadcasstSelections = function () {

                // allow only maxSelections selections
                if (maxSelections < selections.length) {
                    selections.length = maxSelections;
                }

                //broadcast values
                scope.$broadcast(MessageSelectionChanged, selections);

                // render change to model
                render()
            }

            // get values from model
            ngModel.$render = function () {

                // set value
                if (angular.isString(ngModel.$viewValue) || angular.isNumber(ngModel.$viewValue)) {
                    selections[0] = ngModel.$viewValue;
                }

                // set array of values
                if (angular.isArray(ngModel.$viewValue)) {
                    selections = ngModel.$viewValue.slice(0);
                }

                // broadcast selections
                broadcasstSelections();
            }

            //# listen to 'ItemSelected' event
            itemSelectedEvent = scope.$on(MessageItemSelected, function (event, data) {

                // stop propagation of event
                event.stopPropagation();

                processSelectdItem(data);

                // broadcast new selections list
                broadcasstSelections();

                // call render - to pass value to ngModel
                render();
            });

            // render selections to ngModel
            var render = function () {

                // update ngModel
                $timeout(function () {
                    scope.$apply(function () {
                        if (multipleSelections) {
                            ngModel.$setViewValue(selections);
                        } else {
                            ngModel.$setViewValue((0 == selections.length) ? null : selections[0]);
                        }
                    }), 1
                });
            }

            // process a selection
            var processSelectdItem = function (itemID) {
                var i;

                // user clicked on 'clear selection - basically clearing the combobbox
                if ((undefined === itemID) || (null === itemID)) {
                    if (!multipleSelections) { selections = []; }
                    return;
                }

                // if multiple selections are allowed - then selecting an already selected item - has the effect of removing the item from the selected list
                if (multipleSelections && (-1 < (i = selections.indexOf(itemID)))) {
                    selections.splice(i, 1);
                    return;
                }

                // select new item - combobox replaces selection
                if ((!multipleSelections) && (0 < selections.length)) {
                    selections.splice(0, 1, itemID);
                } else {
                    selections.unshift(itemID)
                }
            }

            //# region watch

            // disabled list changes take immidiate effect
            watchDisabled = scope.$watchCollection('disabledItems', function (newValue, oldValue) {
                scope.$broadcast(MessageDisableItems, scope.disabledItems);
            });

            // disabled list changes take immidiate effect
            watchMultiple = scope.$watch('multiple', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    setMaxSelections();
                }
            });

            // reset the select - a reset is broadcasted to transcluded children
            watchReset = scope.$watch('resetSelect', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    selections = [];
                    scope.$broadcast(MessageSelectReset);
                    render();
                }
            });

            //# region events

            // listen to destroy and turn watches off
            scope.$on('$destroy', function () {

                watchDisabled(); itemSelectedEvent(); watchReset(); watchMultiple();
            });

            // initialize values and go
            multipleSelections = Utilities.isOptionalParameter(scope, 'multiple', attrs);
            setMaxSelections();

        }
    }
})
