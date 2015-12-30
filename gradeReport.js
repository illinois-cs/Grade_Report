var gradeReportApp = angular.module('gradeReportApp', ['gradeReportControllers']);
var gradeReportControllers = angular.module('gradeReportControllers', []);

gradeReportControllers.controller('MainController', ['$scope', '$http', function($scope, $http) {

  $http.get("results.json").success(function(data) {
      $scope.results = data;
      $scope.selected = data[data.length-1].timestamp;
      $scope.update = function(index){
          $("#"+index).toggleClass("active");
      }
  });
}]);
