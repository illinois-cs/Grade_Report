var gradeReportControllers = angular.module('gradeReportControllers', []);
gradeReportControllers.controller('MainController', ['$scope' , '$http' , function($scope, $http) {
  $http.get('./data/results.json').success(function(data) {
   $scope.results = data;
 });
}]);
