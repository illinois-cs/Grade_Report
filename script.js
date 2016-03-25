var gradeReportApp = angular.module('gradeReportApp', ['gradeReportControllers']);
var gradeReportControllers = angular.module('gradeReportControllers', []);

gradeReportControllers.controller('MainController', ['$scope', '$http', function($scope, $http) {
  $http.get("results.json").success(function(data) {
        $scope.results = data;
        $scope.selected = data[data.length - 1].timestamp;
        $scope.pointsEarned = 0;
        $scope.pointsPossible = 0;
        $scope.updatePoints = function() {
            $scope.pointsEarned = 0;
            $scope.pointsPossible = 0;
            // Find the matching autograde
            var autograde;
            for (var i = 0; i < data.length; i++) {
                if (data[i].timestamp == $scope.selected) {
                    autograde = data[i];
                }
            }
            // Sum up total points
            for (var i = 0; i < autograde.testcases.length; i++) {
                var testcase = autograde.testcases[i];
                $scope.pointsEarned += testcase.ptsEarned;
                $scope.pointsPossible += testcase.ptsPossible;
            }
        }
        for (var i = 0; i < data.length; i++) {
            $scope.pointsEarned += parseInt(data[i].ptsEarned, 10);
            $scope.pointsPossible += parseInt(data[i].ptsPossible, 10);
        }
        $scope.update = function(index) {
            $("#" + index).toggleClass("active");
        };
        $scope.updateSelected = function(input) {
            $scope.selected = input;
            $scope.updatePoints();
        };
        $scope.closeDrawer = function() {
            $(".mdl-layout__drawer").toggleClass("is-visible");
        };
        $scope.updatePoints();
    });
}]);
