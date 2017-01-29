GogApp.service('FirebaseService', function ($firebaseObject) {

    // Initialize the Firebase SDK
    var config = {
        databaseURL: 'https://torrid-torch-7773.firebaseio.com/',
    };

    firebase.initializeApp(config);
    var ref = firebase.database().ref('/bundle');
    var stats = $firebaseObject(ref);

    this.getStatistics = function (callback) {

        stats.$loaded(function () {
            callback(stats);
        });
    }

    this.addPrice = function (price) {

        // Update total money earned
        stats.total += price;

        // Keep array sorted
        var index = sortedIndex(stats.prices, price);
        stats.prices.splice(index, 0, price);

        // Update bundles sold
        stats.sold += 1;

        // Update average
        stats.average = parseFloat((stats.total / stats.prices.length).toFixed(2));

        // Update top ten
        var prices = stats.prices;
        var index = Math.round(prices.length * 0.9) - 1;
        stats.topten = parseFloat(((prices[index] + prices[index + 1]) / 2).toFixed(2));

        stats.$save();
    }

    function sortedIndex(array, value) {

        var low = 0,
            high = array.length;

        while (low < high) {
            var mid = low + high >>> 1;
            if (array[mid] < value) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }

        return low;
    }

});
