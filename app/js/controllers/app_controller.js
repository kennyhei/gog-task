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
            ticks_labels: ['$0.99', '$' + $scope.stats.average + ' (Average)', '$' + $scope.stats.topten + ' (Top 10%)', '$49.99'],
        });

        $scope.slider.on('change', function (event) {
            updateSlider(event);
        });

        $scope.$watch('slider.options.value', function (newVal, oldVal) {
            $scope.slider.setValue(parseFloat(newVal));
        });

       angular.element($window).bind('resize', function() {
            setupTickLabelPosition();
            $scope.$digest();
       });

        createSliderTooltip();
        setupTickLabelPosition();
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

        // Update slider attributes and refresh slider
        refreshSlider(avg, topten)

        // Setup tick label positions in case of overlapping
        setupTickLabelPosition();

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

        var pointer = angular.element(document.querySelector( '.slider-handle.min-slider-handle.round'));
        pointer.append(sliderTooltip);
    }

    function updateSlider (event) {

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

    function refreshSlider(avg, topten) {

        $scope.slider.setAttribute('ticks', [0.99, avg, topten, 49.99]);
        $scope.slider.setAttribute('ticks_positions', [0, ($scope.stats.average / 49.99) * 100, ($scope.stats.topten / 49.99) * 100, 100]);
        $scope.slider.setAttribute('ticks_labels', ['$0.99', '$' + avg + ' (Average)', '$' + topten + ' (Top 10%)', '$49.99']);
        $scope.slider.refresh();
    }

    function setupTickLabelPosition () {
        var tickLabelFirst = angular.element(document.querySelectorAll('.slider-tick-label')[1]);
        var tickLabelSecond = angular.element(document.querySelectorAll('.slider-tick-label')[2]);
        var sliderTooltip = angular.element(document.querySelector('.gog-slider-tooltip'));

        var firstLeft = tickLabelFirst.css('left').split('px')[0];
        var secondLeft = tickLabelSecond.css('left').split('px')[0];

        if (secondLeft - firstLeft < 70) {
            tickLabelFirst.css('top', '25px');
            sliderTooltip.css('top', '15px');
        } else {
            tickLabelFirst.css('top', '-23px');
            sliderTooltip.css('top', '0');
        }
    }
});
