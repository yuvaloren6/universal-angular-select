angular.module('angular-universal-select-demo', ['angular-revive', 'angular-groupSort', 'universal-angular-select'])
.controller('universalSelectDemoController', function ($scope, $filter ) {

    $scope.baseballTeams = [
        { name: "New York Yankees", category: "American League", subCategory: "East", icon: "./icons/nyy.png", id: 1 },
        { name: "Boston Red Sox", category: "American League", subCategory: "East", icon: "./icons/bos.png", id: 2 },
        { name: "Toronto Blue Jays", category: "American League", subCategory: "East", icon: "./icons/tor.png", id: 3 },
        { name: "Baltimore Orioles", category: "American League", subCategory: "East", icon: "./icons/bal.png", id: 4 },
        { name: "Tampa Bay Rays", category: "American League", subCategory: "East", icon: "./icons/tb.png", id: 5 },
        { name: "New York Mets", category: "National League", subCategory: "East", icon: "./icons/nym.png", id: 6 },
        { name: "Washington Nationals", category: "National League", subCategory: "East", icon: "./icons/wsh.png", id: 7 },
        { name: "Miami Marlins", category: "National League", subCategory: "East", icon: "./icons/mia.png", id: 8 },
        { name: "Philadelphia Phillis", category: "National League", subCategory: "East", icon: "./icons/phi.png", id: 9 },
        { name: "Atlanta Braves", category: "National League", subCategory: "East", icon: "./icons/atl.png", id: 10 },
        { name: "Cleveland Indians", category: "American League", subCategory: "Central", icon: "./icons/cle.png", id: 11 },
        { name: "Kansas city Royals", category: "American League", subCategory: "Central", icon: "./icons/kc.png", id: 12 },
        { name: "Detroit Tigers", category: "American League", subCategory: "Central", icon: "./icons/det.png", id: 13 },
        { name: "Chicago White Sox", category: "American League", subCategory: "Central", icon: "./icons/chw.png", id: 14 },
        { name: "Minnesota Twins", category: "American League", subCategory: "Central", icon: "./icons/min.png", id: 15 },
        { name: "Chicago Cubs", category: "National League", subCategory: "Central", icon: "./icons/chc.png", id: 16 },
        { name: "St. Louis Cardinals", category: "National League", subCategory: "Central", icon: "./icons/stl.png", id: 17 },
        { name: "Pittsburgh Pirates", category: "National League", subCategory: "Central", icon: "./icons/pit.png", id: 18 },
        { name: "Milwaukee Brewers", category: "National League", subCategory: "Central", icon: "./icons/mil.png", id: 19 },
        { name: "Cinncinaty Reds", category: "National League", subCategory: "Central", icon: "./icons/cin.png", id: 20 },
        { name: "Texas Rangers", category: "American League", subCategory: "west", icon: "./icons/tex.png", id: 21 },
        { name: "Huston Astros", category: "American League", subCategory: "west", icon: "./icons/hou.png", id: 22 },
        { name: "Seattle Mariners", category: "American League", subCategory: "west", icon: "./icons/sea.png", id: 23 },
        { name: "Oakland Athletics", category: "American League", subCategory: "west", icon: "./icons/oak.png", id: 24 },
        { name: "Los Angeles Angels", category: "American League", subCategory: "west", icon: "./icons/laa.png", id: 25 },
        { name: "San francisco Giants", category: "National League", subCategory: "west", icon: "./icons/sf.png", id: 26 },
        { name: "Los Angelos Dodgers", category: "National League", subCategory: "west", icon: "./icons/lad.png", id: 27 },
        { name: "Arizona Diamondbacks", category: "National League", subCategory: "west", icon: "./icons/ari.png", id: 28 },
        { name: "Colorado Rockies", category: "National League", subCategory: "west", icon: "./icons/col.png", id: 29 },
        { name: "San Diego Padres", category: "National League", subCategory: "west", icon: "./icons/sd.png", id: 30 },
    ];

    $scope.americanLeagueTeams = $filter('filter')($scope.baseballTeams, { category: "American League" });
    $scope.nationalLeagueTeams = $filter('filter')($scope.baseballTeams, { category: "National League" });

    $scope.groupBy = function (object, level) {
        var categoryName;

        switch (level) {
            case 1:
                categoryName = object.category;
                break;
            case 2:
                categoryName = object.subCategory;
                break;
            default:
                categoryName = null;
        }

        return categoryName;
    }

    $scope.groupByConference = function (object, level) {
        var categoryName;

        switch (level) {
            case 1:
                categoryName = object.subCategory;
                break;
            default:
                categoryName = null;
        }

        return categoryName;
    }

    // sort categories
    $scope.sortCategories = function(name1, name2) {

        return (name1 <= name2) ? -1 : 1;
    }

    // sort items
    $scope.sortItems = function (obj1, obj2) {

        return (obj1.name <= obj2.name) ? -1 : 1;
    }
})