angular.module('angular-groupSort', [])
.constant('EmptyElement', '<div ng-transclude></<div>')
.constant('NoGrouping', "!@#$%^&*()")
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
.directive('groupSort', function (EmptyElement, Utilities, NoGrouping) {
    return {
        scope: {
            groupBy: '&',
            objects: '=',
            sortCategories: '&',
            sortItems: '&',
        },
        template: EmptyElement,
        restrict: 'EA',
        transclude: Element,
        controller: function ($scope, $element, $attrs, Utilities) {
            var categoryTree;
            var categories = [];

            // group options by category 
            var groupByCategories = function (group, level) {
                var groups = {}

                // group objects at current level of grouping
                group.forEach(function (object, index) {
                    if (angular.isObject(object)) {
                        groupID = $scope.groupBy()(object, level);
                        if (Utilities.isString(groupID)) {
                            groups[groupID] = groups[groupID] || [];
                            groups[groupID].push(object);
                        } else {
                            groups[NoGrouping] = groups[NoGrouping] || [];
                            groups[NoGrouping].push(object);
                        }
                    }
                });

                // recursively group each category into sub categories
                for (var p in groups) {
                    if (NoGrouping !== p) {
                        groups[p] = groupByCategories(groups[p], (level + 1));
                    }
                }

                return groups;
            }

            // sort categories
            var sortCategories = function (group, sortedCategories) {
                var categories = [];

                // collect all categories at current level
                for (var p in group) {
                    if (NoGrouping !== p) { categories.push(p); }
                }

                // sort categories and assign to categories object
                categories = categories.sort(function (a, b) { return $scope.sortCategories()(a, b); });
                sortedCategories.categories = categories;

                for (var p in group) {
                    if (NoGrouping !== p) {
                        sortedCategories[p] = {};
                        sortCategories(group[p], sortedCategories[p]);
                    }
                }
            }

            // sort items
            var sortItems = function (groups) {

                // sort objects in leafs
                for (var p in groups) {
                    if (NoGrouping === p) { groups[p] = groups[p].sort(function (a, b) { return $scope.sortItems()(a, b); }); }
                }

                // sort objects in each category recursively
                for (var p in groups) {
                    if (NoGrouping !== p) { sortItems(groups[p]); }
                }
            }

            // recursively add groups to result
            var addGroups = function (groups, sortedCategories, categoryName) {
                var category;
                var obj = {};
                var data = [];
                var totalCategories, leaf;

                totalCategories = sortedCategories.categories.length;
                leaf = (0 === totalCategories);

                if (0 < Object.keys(groups).length) {
                    for (var i = 0; i < totalCategories; i++) {
                        category = sortedCategories.categories[i];
                        obj = (addGroups(groups[category], sortedCategories[category], category));
                        data.push(obj);
                    }

                    // This is a little tricky:
                    // if we arrived at a leaf - we combine the  category name with array of objects
                    // if, however, these are uncategorised objects - we create a group with null category name and array of objects
                    if (angular.isDefined(groups[NoGrouping])) {
                        if (leaf) {
                            return addGroup(categoryName, groups[NoGrouping], true);
                        } else {
                            data.push(groups[NoGrouping]);
                        }
                    }
                }

                return (leaf) ? data : addGroup(categoryName, data, false);
            }

            // add group to array
            var addGroup = function (categoryName, objects, isLeaf) {
                var obj = {};

                obj.isLeaf = isLeaf;
                obj.categoryName = (null !== categoryName) ? categoryName : "";
                obj.objects = objects;

                return obj;
            }

            // get data
            this.data = function () {
                var groups = undefined;
                var sortedCategories = undefined;
                var data = [];

                // validate parameter
                if (!angular.isArray($scope.objects)) { throw Error("Parameter object must point to an array of objects"); }

                // sort groups and categories
                if (Utilities.isOptionalParameter($scope, 'groupBy', $attrs)) {
                    groups = groupByCategories($scope.objects, 1);

                    if (Utilities.isOptionalParameter($scope, 'sortCategories', $attrs)) {
                        sortedCategories = {};
                        sortCategories(groups, sortedCategories);
                    }
                }

                // no grouping - no categories sorted
                if (!angular.isDefined(groups)) {
                    groups = {};
                    groups[NoGrouping] = $scope.objects;
                }

                // sort items
                if (Utilities.isOptionalParameter($scope, 'sortItems', $attrs)) { sortItems(groups); }

                // create array of sorted groups and items
                if (angular.isDefined(sortedCategories)) {
                    data = addGroups(groups, sortedCategories, null)
                } else {
                    data.push(addGroup(null, groups, true));
                }

                return data;
            }
        }
    }
})
