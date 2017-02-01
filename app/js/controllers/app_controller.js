GogApp.controller('AppController', function ($scope, $timeout, $compile, FirebaseService) {

    $scope.aboveAverage = true;
    $scope.aboveTopTen = true;

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

    FirebaseService.getStatistics( function(stats) {
        $scope.stats = stats;

        // Update digits when stats change
        $scope.$watch('stats', function() {
            $scope.sales = {
                firstDigit: $scope.stats.soldArr[0],
                secondDigit: $scope.stats.soldArr[1],
                thirdDigit: $scope.stats.soldArr[2],
                fourthDigit: $scope.stats.soldArr[3],
                fifthDigit: $scope.stats.soldArr[4],
                sixthDigit: $scope.stats.soldArr[5]
            }
        }, true);

        $scope.slider = {
             value: $scope.stats.topten,
             options: {
                 floor: 0.99,
                 ceil: 49.99,
                 minLimit: 0.01,
                 maxLimit: 49.99,
                 step: 0.01,
                 precision: 2,
                 ticksArray: [$scope.stats.average, $scope.stats.topten],
                 showTicksValues: true,
                 showSelectionBar: true,
                 onChange: function () {

//                    var rzPointer = angular.element(document.querySelector( '.rz-pointer.rz-pointer-min'));
//                    var sliderTooltip = angular.element(document.querySelector( '.gog-slider-tooltip'));
//
//                    var left = parseInt(rzPointer.css('left').split('px')[0]) - 80;
//                    sliderTooltip.css('left', left + 'px');

                    var value = $scope.slider.value;

                    if (value >= $scope.stats.average) {
                        $scope.aboveAverage = true;
                    } else {
                        $scope.aboveAverage = false;
                    }

                    if (value >= $scope.stats.topten) {
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

         createSliderTooltip();
    });

    $scope.buy = function () {

        var value = $scope.slider.value;

        var gamesBought = 1;
        if ($scope.aboveAverage) {
            gamesBought++;
        }

        if ($scope.aboveTopTen) {
            gamesBought++;
        }

        FirebaseService.addPrice(value, gamesBought);

        var avg = $scope.stats.average;
        var topten = $scope.stats.topten;

        $scope.slider.options.ticksArray = [avg, topten];
        $scope.slider.options.onChange();
    }

    $scope.goals = [
        {
            count: '25.000',
            threshold: 25000,
            description: '...to unlock exlusive, never before seen, trailer from Divinity: Original Sin.',
            url: 'https://www.youtube.com/watch?v=Mea7Pa3rhJU',
        },
        {
            count: '50.000',
            threshold: 50000,
            description: '...to unlock art book for Divinity: Original Sin I and Divinity: Original Sin II.',
            url: 'https://www.youtube.com/watch?v=3A_PEIkZ0O8',
        },
        {
            count: '80.000',
            threshold: 80000,
            description: '...to support the development of Divinity: Original Sin III.',
            url: 'https://www.youtube.com/watch?v=HevrTza0Nxg',
        },
        {
            count: '120.000',
            threshold: 120000,
            description: '...to see Half-Life 3 released before the end of this year (2017).',
            url: 'https://www.youtube.com/watch?v=LBWfl0pRvgY'
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

    $scope.changePrevious = function () {

        var goal;
        var idx = $scope.goals.indexOf($scope.goal);

        if (idx - 1 < 0) {
            goal = $scope.goals[$scope.goals.length - 1];
        } else {
            goal = $scope.goals[idx - 1];
        }

        $scope.change(goal);
    }

    $scope.changeNext = function () {

        var goal;
        var idx = $scope.goals.indexOf($scope.goal);

        if (idx + 1 > $scope.goals.length - 1) {
            goal = $scope.goals[0];
        } else {
            goal = $scope.goals[idx + 1];
        }

        $scope.change(goal);
    }

    function createSliderTooltip() {
         var sliderTooltip = angular.element('<div></div>');
         sliderTooltip.addClass('gog-slider-tooltip');

         var sliderInput = angular.element('<div><input type="text" value="${{slider.value}}" ng-bind="slider.value">' +
                                           '<button ng-click="buy()">Checkout now</button>');
         var sliderInfo = angular.element('<div class="input-info"><i class="fa fa-info-circle"></i> ' +
                                          'Click the price to type it in manually</div>');


         sliderTooltip.append(sliderInput);
         sliderTooltip.append(sliderInfo);
         $compile(sliderTooltip)($scope);

         var divElement = angular.element('<div></div>');

         var rzPointer = angular.element(document.querySelector( '.rz-pointer.rz-pointer-min'));
         var left = parseInt(rzPointer.css('left').split('px')[0]) - 80;
         sliderTooltip.css('left', left + 'px');
         console.log(sliderTooltip);

         rzPointer.wrap(divElement);
//         rzPointer.parent().append(sliderTooltip);
         rzPointer.append(sliderTooltip);
    }
});
