GogApp.controller('AppController', function ($scope, $timeout) {

    $scope.aboveAverage = false;
    $scope.aboveTopTen = false;

    $scope.partials = {
        menu: {
            url: 'js/partials/menu.html'
        },
        header: {
            url: 'js/partials/header.html'
        },
        footer: {
            url: 'js/partials/footer.html'
        }
    }

    $scope.goals = [
        {
            count: '25.000',
            description: '...to unlock exlusive, never before seen, trailer from Divinity: Original Sin.'
        },
        {
            count: '50.000',
            description: '...to unlock art book for Divinity: Original Sin I and Divinity: Original Sin II.'
        },
        {
            count: '80.000',
            description: '...to support the development of Divinity: Original Sin III.'
        },
        {
            count: '120.000',
            description: '...to see Half-Life 3 released before the end of this year (2017).'
        }
    ];

    $scope.goal = $scope.goals[0];

    $scope.change = function (goal) {
        $scope.startFade = true;

        $timeout(function () {
            $scope.startFade = false;
            $scope.goal = goal;
        }, 200);
    }

    $scope.slider = {
        value: 2,
        options: {
            floor: 0.01,
            ceil: 49.99,
            minLimit: 0.01,
            maxLimit: 49.99,
            step: 0.01,
            precision: 2,
            ticksArray: [7.67, 18.31],
            showTicksValues: true,
            showSelectionBar: true,
            onChange: function () {

                var value = $scope.slider.value;

                if (value >= 7.67) {
                    $scope.aboveAverage = true;
                } else {
                    $scope.aboveAverage = false;
                }

                if (value >= 18.31) {
                    $scope.aboveTopTen = true;
                } else {
                    $scope.aboveTopTen = false;
                }
            },
            translate: function(value, sliderId, label) {
                return '$' + value;
            }
        }
    };
});
