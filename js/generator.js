var app = angular.module('generator', []);

app.service('HtmlUtility', function () {
    this.htmlEncode = function(string){
        var resultString = [];
        for (var i = string.length - 1; i >= 0; i--) {
            resultString.unshift(['&#', string[i].charCodeAt(), ';'].join(''));
        }
        return resultString;
    }
});

app.service('FrequencyGenerator', function () {
    var baseFrequency = 460;
    var frequencySeparator = 440;
    var frequencyInterval = 20;

    var generateHandshake = function(){
        return [380, 440, 400, 440, 420];
    }

    this.generateMessage = function(array){
        var frequencies = [];

        for (var i = 0; i < generateHandshake().length; i++) {
            frequencies.push(generateHandshake()[i]);
        };

        for (var i = 0; i < array.length; i++) {
            frequencies.push(baseFrequency + 20 * asciiTables.indexOf(array[i]));

            if (i < array.length - 1)
                frequencies.push(440);
        };

        return frequencies;
    }   

    this.playSound = function(frequencies, callback){
        var freqs = T(function(count) {
          if (count == frequencies.length){
              env.pause();
              callback();
          }

          return frequencies[count % frequencies.length];
        });

        var osc = T("square", {freq:freqs});
        var env = T("perc", osc).play();

        var interval = T("param", {value:20})

        var interval = T("interval", {interval:interval}, freqs, env).start();
    }
});

app.controller('MainCtrl', ['$scope', 'HtmlUtility', 'FrequencyGenerator', function ($scope, HtmlUtility, FrequencyGenerator) {
    $scope.generated = false;
    $scope.playButtonEnabled = true;

    var convert = function(callback){
        var charCodes = HtmlUtility.htmlEncode($scope.message);
        var frequencies = FrequencyGenerator.generateMessage(charCodes);
        $scope.debugFrequencies = frequencies.join('|');
        FrequencyGenerator.playSound(frequencies, callback);
    }

    $scope.generate = function(){
        $scope.playButtonEnabled = false;

        if ($scope.message != undefined){
            ga('send', 'event', 'Generate', 'play', 'Played a message');
            convert(function(){
                $scope.playButtonEnabled = true;
                $scope.$apply();
            });
            
            $scope.generated = true;
        }
    }
}]);