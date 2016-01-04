var app = angular.module('generator', []);

app.service('HtmlUtility', function () {
    this.htmlEncode = function(string){
        var resultString = [];
        for (var i = string.length - 1; i >= 0; i--) {
            resultString.unshift(['&#', string[i].charCodeAt(), ';'].join(''));
        }
        console.log(resultString);
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
        console.log(frequencies);
        return frequencies;
    }   

    this.playSound = function(frequencies){
// var table = frequencies;
// var synth = T("square", {freq:table});
// var env   = T("perc", synth).bang();

// var interval = T("interval", {interval:1000}, function(count) {
//   if (count === 3) {
//     interval.stop();
//   }
//   env.bang();
// }).set({buddies:synth}).start();

        var freqs = T(function(count) {
          return frequencies[count % frequencies.length];
        });        
        var osc = T("square", {freq:freqs}).on("ended", function() {
    this.pause();
});
        var env = T("perc", osc).bang();

        var interval = T("param", {value:100});

var interval = T("interval", {interval:interval}, freqs, env).start();
        env.play();

//         T("interval", {interval:interval},  function(count) {
//   if (count === 1) {
//     interval.stop();
//   }
//  env.bang();
// }, freqs, env).start().play();
        // T("square", {frequency: freqs}).play();
    }
});

app.controller('MainCtrl', function ($scope, HtmlUtility, FrequencyGenerator) {
    $scope.generated = false;

    var convert = function(){
        var charCodes = HtmlUtility.htmlEncode($scope.message);
        var frequencies = FrequencyGenerator.generateMessage(charCodes);
        FrequencyGenerator.playSound(frequencies);
    }

    $scope.generate = function(){
        $scope.generated = true;
        convert();
    }
});