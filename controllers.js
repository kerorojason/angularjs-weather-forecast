// CONTROLLERS
weatherApp.controller('homeController', [
  '$scope',
  'cityService',
  function($scope, cityService) {
    $scope.city = cityService.city;
    $scope.$watch('city', function() {
      cityService.city = $scope.city;
    });
  }
]);

weatherApp.controller('forecastController', [
  '$scope',
  '$filter',
  '$resource',
  '$routeParams',
  'cityService',
  function($scope, $filter, $resource, $routeParams, cityService) {
    $scope.city = cityService.city;

    $scope.days = $routeParams.days || 2;

    $scope.weatherAPI = $resource(
      'http://api.openweathermap.org/data/2.5/forecast',
      {
        callback: 'JSON_CALLBACK'
      },
      { get: { method: 'JSONP' } }
    );

    $scope.weatherAPI
      .get({
        q: $scope.city,
        cnt: 1 + $scope.days * 8,
        id: '524901',
        APPID: 'b0ecbf2800bef52d38557f2fd3248382'
      })
      .$promise.then(function(res) {
        $scope.timezone = res.city.timezone;
        $scope.weatherResult = $filter('filter')(res.list, function(element) {
          return [7, 8, 9, 19, 20, 21].includes(
            new Date(element.dt * 1000 - res.city.timezone * 1000).getHours()
          );
        });
      });

    $scope.convertToCelsius = function(degK) {
      return Math.round(degK - 273);
    };

    $scope.convertToDate = function(dt) {
      return new Date(dt);
    };

    $scope.isDay = function(dt) {
      return [7, 8, 9].includes(new Date(dt).getHours());
    };
  }
]);
