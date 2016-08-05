'use strict';

window.onload = function () {
    // not mobile, return to main site
    if (!navigator.userAgent.match(/AppleWebKit.*Mobile.*/)) {
        location.href = '..';
    }
    // load font
    $youziku.load("body", "684e780400104650b90d691428d240af", "minijianlinxin");
    $youziku.draw();

    var gameScene = document.getElementById('game-scene');
    var resultScene = document.getElementById('result-scene');
    var testRect = document.getElementById('test-rect');
    var startButton = document.getElementById('start-button');
    var colorButtons = document.getElementById('color-button');
    var levelTitle = document.getElementById('level');
    var scoreText = document.getElementById('score');
    var scoreRecordText = document.getElementById('score-record');
    var level, correctColor, timeGap;

    // set a random number to start button
    startButton.innerText = Math.ceil(Math.random() * 4);

    // reset game data
    var resetData = function () {
        level = 1;
        levelTitle.innerText = level;
        timeGap = 1000;
    };
    resetData();

    // for reasons to use hsl color, because its lighter
    var getRandomColor = function () {
        return "hsl(" + Math.ceil(Math.random() * 360) + ", 100%, " + Math.ceil(Math.random() * 100) + "%)";
    };

    startButton.addEventListener('click', function () {
        var startButtonNumber = parseInt(startButton.innerText);
        var count = 1, colors = [];
        var updateColor = function () {
            var ranColor = getRandomColor();
            testRect.style.backgroundColor = ranColor;
            // browser may convert hsl color to rgb color, so we record the rgb color
            ranColor = testRect.style.backgroundColor;
            colors.push(ranColor);
            setTimeout(function () {
                if (count === startButtonNumber) {
                    correctColor = ranColor;
                }

                if (count < 4) {
                    count++;
                    updateColor();
                } else {
                    // color change over, set back to white
                    testRect.style.backgroundColor = 'white';
                    // mix colors
                    colors.sort(function () {
                        return 0.5 - Math.random();
                    });
                    // set colors to 4 buttons
                    var li = 0;
                    for (var i = 0; i < colorButtons.childNodes.length; i++) {
                        if (colorButtons.childNodes[i].nodeName !== "#text") {
                            colorButtons.childNodes[i].style.backgroundColor = colors[li++];
                        }
                    }
                    // hide start button, change start button content for next puzzle, show color buttons
                    startButton.style.display = 'none';
                    startButton.innerText = Math.ceil(Math.random() * 4);
                    colorButtons.style.display = 'block';
                }
            }, timeGap);
        };
        updateColor();
    });

    colorButtons.addEventListener('click', function (event) {
        var targetLi = event.target;

        if (targetLi !== "#text") {
            // record the highest level
            var highestLevel = localStorage.highestLevel || 0;
            if (parseInt(highestLevel) < level) {
                localStorage.highestLevel = level;
            }
            // hide color buttons, show start button
            colorButtons.style.display = 'none';
            startButton.style.display = 'block';

            if (targetLi.style.backgroundColor === correctColor) {
                // success
                // add level number,change title
                level++;
                levelTitle.innerText = level;
                // decrease time gap
                if (timeGap > 500) {
                    timeGap -= 50;
                } else if (timeGap > 250) {
                    timeGap -= 25;
                } else if (timeGap > 120) {
                    timeGap -= 10;
                } else {
                    timeGap -= 5;
                }
            } else {
                // failed
                // put score to screen
                scoreText.innerText = level;
                scoreRecordText.innerText = localStorage.highestLevel;
                // show the game over scene
                gameScene.style.display = 'none';
                resultScene.style.display = 'block';
                // reset data
                resetData();
            }
        }
    });

    document.getElementById('restart-button').addEventListener('click', function () {
        resultScene.style.display = 'none';
        gameScene.style.display = 'block';
    })
};