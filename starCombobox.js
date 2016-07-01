angular.module('universal-angular-select')
.directive('starCombobox', function ($compile) {
    return {
        scope: {
            height: '@',
            width: '@',
        },
        template: '<div style="position:relative; height:400px; width:660px"></div>',
        require: "^groupSort",
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs, groupAndSortCtrl) {
            var height;
            var divs = [];

            var league = function (height, left, top, width, league) {
                var divs = [];
                var childHeight, childTop, childWidth

                if (league.categoryName) {
                    divs.push('<div class="categoryName" style="left: ' + left + 'px; top: ' + top + 'px; width: ' + width + 'px">' + league.categoryName + '</div>')
                }

                childHeight -= height - 25;
                childTop = top + 25;
                childWidth = width / 3;
                for (var i = 0; i < league.objects.length; i++) {
                    divs = divs.concat(division(childHeight, (left + (i * childWidth)), childTop, childWidth, league.objects[i]));
                }

                return divs;
            }

            var division = function (height, left, top, width, division) {
                var divs = [];
                var childrenTop;

                if (division.categoryName) {
                    divs.push('<div class="divisionName" style="left: ' + (left + 50) + 'px; top: ' + top + 'px; width: ' + width + 'px">' + division.categoryName + '</div>')
                }

                childrenTop = top + 25;
                for (var i = 0; i < division.objects.length; i++) {
                    divs.push(teamStarView(i, left, childrenTop, width, division.objects[i]));
                }

                return divs;
            }

            // arrange team icons in star like formation per division
            var teamStarView = function (index, left, top, width, team) {
                var myLeft, myTop;

                switch (index) {
                    case 0:
                        myLeft = left;
                        myTop = top + 42;
                        break;
                    case 1:
                        myLeft = left + 42;
                        myTop = top + 42;
                        break;
                    case 2:
                        myLeft = left + 84;
                        myTop = top + 42;
                        break;
                    case 3:
                        myLeft = left + 42;
                        myTop = top;
                        break;
                    case 4:
                        myLeft = left + 42;
                        myTop = top + 84;
                        break;
                    default:
                        throw Error("Invalid choice: " + choice);
                }

                var c = '<div class="roundTeamIcon" style="left: ' + myLeft + 'px; top: ' + myTop + 'px; margin:10px" \
                            ng-class="{' + "'selectedTeam': (-1 < selections.indexOf(" + team.id + '))}"> \
                            <a href="#" ng-click="clickSelect($event, ' + team.id + ')"><img src="' + team.icon + '" height="32" width="32" /></a> \
                        </div>';

                return c;
            }

            scope.groups = groupAndSortCtrl.data();

            height = Number(scope.height) / 2;
            for (var i = 0; i < scope.groups.objects.length; i++) {
                divs = divs.concat(league(height, 0, (i * height), Number(scope.width), scope.groups.objects[i]));
            }

            divs.forEach(function (currentValue) { element.append(currentValue); })

            $compile(element.contents())(scope);
        },
        controller: function ($scope, $element, $attrs, MessageItemSelected, MessageSelectionChanged) {

            // listen to click event - transmit 'me-selected' message
            $scope.clickSelect = function (event, id) {

                event.preventDefault();

                $scope.$emit(MessageItemSelected, id);
            };

            // listen to selection changed event
            selectionChangedEvent = $scope.$on(MessageSelectionChanged, function (event, selections) {

                // assign selections to scope variable and let ng-class works its magic
                $scope.selections = selections;
            });
        }
    }
})
