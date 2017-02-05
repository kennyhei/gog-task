GogApp.controller('AppController', function ($scope, $timeout, $window, FirebaseService) {

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

        $scope.slider = new Slider("#ex1", {
            min: 0.99,
            max: 49.99,
            step: 0.01,
            value: $scope.stats.topten,
            tooltip: 'hide',
            tooltip_position:'bottom',
            ticks: [0.99, $scope.stats.average, $scope.stats.topten, 49.99],
            ticks_positions: [0, ($scope.stats.average / 49.99) * 100, ($scope.stats.topten / 49.99) * 100, 100],
            ticks_labels: ['$0.99', $scope.stats.average, $scope.stats.topten, '$49.99'],
        });

        $scope.slider.on('change', function (event) {
            updateSlider(event);
        });

        $scope.$watch('slider.options.value', function (newVal, oldVal) {
            $scope.slider.setValue(parseFloat(newVal));
            setupSliderTooltip();
        });

       angular.element($window).bind('resize', function() {
            setupSliderTooltip();
            $scope.$digest();
       });

        createSliderTooltip();
    });

    $scope.buy = function () {

        var value = $scope.slider.getValue();
        $scope.slider.options.value = value;

        if (value > 49.99) {
            $scope.slider.setValue(49.99);
            $scope.slider.options.value = 49.99;
        }

        if (value < 0.99) {
            $scope.slider.setValue(0.99);
            $scope.slider.options.value = 0.99;
        }

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

        $scope.slider.setAttribute('ticks', [0.99, avg, topten, 49.99]);
        $scope.slider.setAttribute('ticks_positions', [0, (avg / 49.99) * 100, (topten / 49.99) * 100, 100]);
        $scope.slider.setAttribute('ticks_labels', ['$0.99', avg, topten, '$49.99']);
        $scope.slider.refresh();

        // For some reason refreshing the slider disables change event listener
        // so setup it again
        $scope.slider.on('change', function (event) {
            updateSlider(event);
        });
    }

    $scope.goals = [
        {
            count: '10.000',
            threshold: 10000,
            description: '...to unlock nostalgic and classy trailer from Divine Divinity.',
            url: 'https://www.youtube.com/watch?v=bbPWtF6J01Y'
        },
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

    $scope.activeGoal = $scope.goals[0];

    $scope.change = function (goal) {
        $scope.startFade = true;

        $timeout(function () {
            $scope.startFade = false;
            $scope.activeGoal = goal;
        }, 200);
    }

    $scope.changePrevious = function () {

        var goal;
        var idx = $scope.goals.indexOf($scope.activeGoal);

        if (idx - 1 < 0) {
            goal = $scope.goals[$scope.goals.length - 1];
        } else {
            goal = $scope.goals[idx - 1];
        }

        $scope.change(goal);
    }

    $scope.changeNext = function () {

        var goal;
        var idx = $scope.goals.indexOf($scope.activeGoal);

        if (idx + 1 > $scope.goals.length - 1) {
            goal = $scope.goals[0];
        } else {
            goal = $scope.goals[idx + 1];
        }

        $scope.change(goal);
    }

    function createSliderTooltip() {

         var sliderTooltip = angular.element(document.querySelector('.gog-slider-tooltip'));
         sliderTooltip.css('display', 'block');

         setupSliderTooltip();
    }

    function updateSlider (event) {
        setupSliderTooltip();

        $scope.$apply(function () {
            $scope.slider.options.value = event.newValue;

            if (event.newValue >= $scope.stats.average) {
                $scope.aboveAverage = true;
            } else {
                $scope.aboveAverage = false;
            }

            if (event.newValue >= $scope.stats.topten) {
                $scope.aboveTopTen = true;
            } else {
                $scope.aboveTopTen = false;
            }
        });
    }

    function setupSliderTooltip () {

        var gogSlider = angular.element(document.querySelector('.gog-slider'));
        var gogSliderWidth = parseFloat(gogSlider.css('width').split('px')[0]);

        var pointer = angular.element(document.querySelector( '.slider-handle.min-slider-handle.round'));
        var left = parseFloat(pointer.css('left').split('px')[0]);

        var sliderTooltip = angular.element(document.querySelector('.gog-slider-tooltip'));
        var sliderTooltipWidth = parseFloat(sliderTooltip.css('width').split('px')[0]);

        if (sliderTooltipWidth + left + 25 >= gogSliderWidth) {
            sliderTooltip.css('left', gogSliderWidth - sliderTooltipWidth - 20 + 'px');
        } else if (left < 8) {
            sliderTooltip.css('left', '8px');
        } else {
            sliderTooltip.css('left', left + 'px');
        }
    }
});
