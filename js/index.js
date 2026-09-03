/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {

    no_of_clouds: 3,
    cloud_css_top_range: 50,
    perspective_items: null,
    watchID: null,

    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', app.onDeviceReady(), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        console.log('deviceReady');
        //lock screen
        console.log('lock screen');

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            try {
                window.screen.orientation.lock('landscape-primary');
            }
            catch (e) {
                console.log('orientation error line 45');
            }
        }

        console.log('show text bubbles');
        app.showTextBubbles();

        // app.prepareAccelerometer();

    },
    prepareAccelerometer: function () {

        app.perspective_items = $('.content div').not(".js-cloud, .js-bubble").toArray();
        app.perspective_items.sort(function (a, b) {
            return (Number($(a).css("z-index")) - Number($(b).css("z-index")));
        });

        $.each(app.perspective_items, function (index, value) {
            $(this).data("original-left", $(this).css('left'));
            $(this).data("original-top", $(this).css('top'));
            $(this).html('x:' + $(this).css('left') + ' y:' + $(this).css('top'));
        });

        //app.watchID =
        //{frequency: 300}
        navigator.accelerometer.getCurrentAcceleration(app.accelerometerSuccess, app.accelerometerError);
    },

    accelerometerSuccess: function (acceleration) {

        alert('Acceleration X: ' + acceleration.x + '\n' +
            'Acceleration Y: ' + acceleration.y + '\n' +
            'Acceleration Z: ' + acceleration.z + '\n' +
            'Timestamp: ' + acceleration.timestamp + '\n');

        // document.getElementById("accelerationX").innerHTML = parseFloat(Math.round(acceleration.x * 100) / 100).toFixed(2);
        // document.getElementById("accelerationY").innerHTML = parseFloat(Math.round(acceleration.y * 100) / 100).toFixed(2);
        //
        //
        // var x = parseFloat(Math.round(acceleration.x * 100) / 100).toFixed(2);
        // var y = parseFloat(Math.round(acceleration.y * 100) / 100).toFixed(2)
        //
        // $.each(app.perspective_items, function( index, value ) {
        //     $(this).html('x:'+x+' y:'+y );
        //     $(this).css({'left': $(this).data( "original-left")+(x*(index/10))+'%'});
        //     $(this).css({'top': $(this).data( "original-top")+(y*(index/10))+'%'});
        // });
    },
    accelerometerError: function (id) {
        console.log('Accelerometer error');
    },
    showTextBubbles: function (e) {
        console.log('init show text bubbles ');
        $(".button-next").on("touchstart click", function (e) {
            console.log('text bubble click');
            e.stopPropagation();
            e.preventDefault();

            var paraLength = $('main p').length;
            var currentParagraph = parseInt($(this).data("index"), 10);

            if ((paraLength === currentParagraph) || (!paraLength)) {
                document.location.href = $(this).attr('href');
            }

            //add one to the Next button
            $(this).data("index", currentParagraph + 1);

            //hide the current para and show the next
            $('.para' + currentParagraph).fadeOut();
            $('.para' + (currentParagraph + 1)).fadeIn();

        });
    },
    clouds: function () {
        console.log('init cloud movement');
        for (i = 0; i < app.no_of_clouds; i++) {

            var cloud_top = ((Math.floor(Math.random() * 35) - 10));
            var cloud_left = ((Math.floor(Math.random() * 95) - 10));
            var cloud_width = ((Math.floor(Math.random() * 30) + 5));
            var cloud_height = ((Math.floor(Math.random() * 30) + 5));

            $('<div class="js-cloud cloud' + ((Math.floor(Math.random() * 3) + 1)) + '" style="top:' + cloud_top + '%; left:' + cloud_left + '%; width:' + cloud_width + '%; height:' + cloud_height + '%;"></div>').appendTo(".content");
        }

        var clouds = $('.js-cloud');

        $.each(clouds, function (index, value) {

            var cloud = $(this);

            $(cloud).css('transform', 'rotate(' + (Math.floor(Math.random() * 15) - 15) + 'deg) skew(' + (Math.floor(Math.random() * 10) - 10) + 'deg)');

            var duration = Math.floor(Math.random() * 100) + 30;


            TweenMax.to(cloud, duration, {
                left: "100%",
                onComplete: app.cloudsBegin,
                onCompleteParams: ["cloud" + (index + 1), duration],
                ease: Power0.easeNone
            });
        });


    },
    cloudsBegin: function (x, y) {
        console.log('init clouds callback');
        $("." + x).css('left', '-25%');
        TweenMax.to($("." + x), y, {
            left: "100%",
            onComplete: app.cloudsBegin,
            onCompleteParams: [x, y],
            ease: Power0.easeNone
        });
    },
    spin: function () {
        console.log('init spin ');
        var spinners = $('.js-spin');

        $.each(spinners, function (index, value) {

            var spin = $(this);
            var duration = Math.floor(Math.random() * 69) + 30;
            TweenMax.to(spin, duration, {rotation: "360", ease: Linear.easeNone, repeat: -1});
        });
    },
    pulse: function () {
        console.log('init pulse');
        var pulsers = $('.js-pulse');

        $.each(pulsers, function (index, value) {

            var pulse = $(this);
            TweenMax.to(pulse, 2, {scale: "1.05", ease: Linear.easeNone, repeat: -1, yoyo: true});
        });

    },
    bounce: function () {
        console.log('init bounce');
        $(".js-bounce").on("touchstart click", function (e) {

            e.stopPropagation();
            e.preventDefault();

            var duration = 1;
            TweenMax.to(this, duration / 4, {y: -50, ease: Power2.easeOut});
            TweenMax.to(this, duration / 2, {y: 0, ease: Bounce.easeOut, delay: duration / 4});
        });
    },
    circular_motion: function () {
        console.log('init circular motion ');
        $.each($(".js-circular-motion"), function (index, value) {
            var duration = Math.floor(Math.random() * 10) + 3;
            var radius = Math.floor(Math.random() * 10) + 5;
            TweenMax.to($(this), duration, {
                bezier: {
                    type: "quadratic",
                    values: [
                        /*p1*/{x: 0, y: 0}, {x: radius, y: 0}, {x: radius, y: radius},
                        /*p2*/{x: radius, y: (radius * 2)}, {x: 0, y: (radius * 2)},
                        /*p3*/{x: (radius * -1), y: (radius * 2)}, {x: (radius * -1), y: radius},
                        /*p4*/{x: (radius * -1), y: 0}, {x: 0, y: 0}],
                    autoRotate: false
                }, repeat: -1,
                ease: Linear.easeNone
            });
        });
    },
    fadeOutLoadingSpinner: function () {
        $('.spinner-container').fadeOut(function () {
            console.log('spinner fade end');
        });
    }


};

app.initialize();