window.onload = function () {
    var sw = $('#switch');
    var audio = $('audio')[0];

    sw.on('click', function () {
        if (navigator.userAgent.match(/iPhone|(iPad)/)) {
            audio.load();

            audio.addEventListener('progress', function () {
                var range = 0;
                var bf = this.buffered;
                var time = this.currentTime;

                while (!(bf.start(range) <= time && time <= bf.end(range))) {
                    range += 1;
                }
                var loadStartPercentage = bf.start(range) / this.duration;
                var loadEndPercentage = bf.end(range) / this.duration;
                var loadPercentage = loadEndPercentage - loadStartPercentage;
                sw.html('loading... ' + loadPercentage + '%');
            });

            audio.addEventListener('canplaythrough', function () {
                audio.play();
                sw.fadeOut(300);
                setTimeout(function () {
                    start();
                }, 300);
            });

            setTimeout(function () {
                sw.html('loading...')
            }, 600);
        } else {
            sw.fadeOut(500);
            setTimeout(function () {
                start();
                audio.play();
            }, 600);
        }
    });
};

function start() {
    // show background lights
    fillBackgroundLights(50);

    // start snowfall
    var snow = $('#snow');
    snow.snowfall({
        flakeCount: 60,
        minSize: 1,
        maxSize: 3,
        minSpeed: 1,
        maxSpeed: 3
    });
    setTimeout(function () {
        snow.fadeIn(2000);
    }, 2500);

    // showTree && grass
    setTimeout(function () {
        $('#tree').fadeIn(2000);
        $('#grass').fadeIn(2000);
    }, 2000);

    // show words
    setTimeout(function () {
        $('#words').removeClass('hide');
    }, 4000);

    // show flowers
    setTimeout(function () {
        showFlowers();
    }, 5000);
}

function fillBackgroundLights(count) {
    var lightsElem = document.getElementById('lights');
    var lights = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
        var light = document.createElement('div');
        light.classList.add('light');
        lights.appendChild(light);
    }
    lightsElem.appendChild(lights);
}

function showFlowers() {
    var canvas = document.getElementById('flower');
    var ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = "lighter";
    var garden = new Garden(ctx, canvas);

    setInterval(function () {
        garden.render()
    }, Garden.options.growSpeed);

    var list = [[346, 148], [354, 350], [220, 240], [442, 422], [140, 490], [344, 590], [230, 588], [326, 472], [70, 568], [580, 526], [212, 166], [290, 22], [464, 340], [468, 546], [182, 326], [344, 230], [260, 390]];

    var drawFlower = function (i) {
        if (i >= list.length) return;
        setTimeout(function () {
            garden.createRandomBloom(list[i][0], list[i][1]);
            drawFlower(i + 1);
        }, 600);
    };

    drawFlower(0);

    canvas.addEventListener('click', function (e) {
        console.log(e.offsetX * 2, e.offsetY * 2)
    })
}
