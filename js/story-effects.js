/**
 * Created by anthonymcpeake on 06/04/2017.
 */

var story = story || {};

story.config = {

    splitTextInfo: [],

    //name of the file being loaded with the story
    jsonFile: 'RockSheep.json',

    //the story in json format
    storyData: {},

    hueCounter: 0,

    storyFile: function () {
        if (typeof cordova === "undefined") {
            return './assets/' + story.config.jsonFile;
        }
        return cordova.file.applicationDirectory + 'www/assets/' + story.config.jsonFile;

    },
    sound_directory: function () {
        var sound_dir = "./assets/sounds";
        var android_sound_dir = "/android_asset/www/assets/sounds";

        //for some reason sticking this simple block in a one liner is REALLY fragile...
        if (story.config.device_platform === 'android') {
            sound_dir = android_sound_dir;
        }
        if (story.config.device_platform === 'amazon-fireos') {
            sound_dir = android_sound_dir;
        }
        return sound_dir;
    },

    isMobile: function () {

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            return true;
        }
        return false;
    },


    currentSentence: 1,
    currentPage: 0,
    totalSentencesOnPage: null,

    //Timeline for the text
    sentenceAnimation: new TimelineMax,
    sentenceAnimationDelay: 1,

    //Timeline for the ball
    ballAnimationTimeline: new TimelineMax,

    //most pages have clouds displayed along the top - this is the default number to display
    default_no_of_clouds: 3,

    readToMe: true,
    sound_effects_on: true,
    music_on: true,

    device_platform: null,
},

    story.load = {
        init: function (callback1) {

            story.config.storyData = JSON.parse(localStorage.getItem('storyData'));

            if (story.config.storyData === null) {
                //load JSON story data and put into local storage
                story.load.loadJSON();
            }
            else {
                story.load.loadPage();
            }
        },

        /* Ajax call to load the json data with the story in it - never need to touch this again */
        loadJSON: function (callback) {

            var xobj = new XMLHttpRequest();
            xobj.open('GET', story.config.storyFile());
            xobj.onreadystatechange = function () {
                if (xobj.readyState == 4) {
                    story.config.storyData = JSON.parse(xobj.responseText);
                    localStorage.setItem('storyData', JSON.stringify(story.config.storyData));
                    story.load.loadPage();
                }
            }
            xobj.send();
        },
        loadPage: function () {
            story.config.storyData = JSON.parse(localStorage.getItem('storyData'));

            var currentPage = story.config.currentPage;

            var pageData = story.config.storyData.pages[currentPage].page;
            story.config.totalSentencesOnPage = pageData.length;

            var totalSentencesOnPage = story.config.totalSentencesOnPage;
            var main = document.getElementsByTagName("MAIN");

            //load the sentences into the <main> element on the page
            for (var i = 1; i <= totalSentencesOnPage; i++) {
                var sentence = pageData[i - 1].sentence;
                main[0].innerHTML += '<p class="sentence-' + i + ' js-sentence-' + i + '">' + sentence + '</p>';
            }

            //doesnt work for some reason if ran in the prev loop...
            for (var i = 1; i <= totalSentencesOnPage; i++) {
                var mySplitText = new SplitText('.js-sentence-' + i, {
                    type: 'chars,words',
                    wordsClass: "js-sentence-" + i + " word-++"
                });

                story.config.splitTextInfo.push(mySplitText.words);

            }

            if (story.interactions.init()) {


                setTimeout(function () {


                    story.effects.fadeOut('.loader');
                    $('.loader').one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
                        function () {
                            $(this).remove();
                        });


                    setTimeout(function () {
                        if (story.config.readToMe) {
                            story.interactions.readToMe();
                        }
                    }, 1500);


                }, 300);


            }
        }
    },

    story.interactions = {

        navigation: {

            loadNextSentence: function (e, button) {

                var readToMe = story.config.readToMe;
                var totalSentencesOnPage = story.config.totalSentencesOnPage;
                var currentSentence = story.config.currentSentence;
                var nextSentence = currentSentence + 1;

                if (nextSentence > totalSentencesOnPage) {
                    document.location.href = $(button).attr('href');
                    return true;
                }

                document.querySelector('.js-sentence-' + currentSentence).classList.add("cssFadeOut");
                document.querySelector('.js-sentence-' + nextSentence).classList.add("cssFadeIn");

                setTimeout(function () {

                    if (readToMe) {
                        story.interactions.readToMe();
                    }

                }, 1000);

                story.config.currentSentence++;

            }

        },
        readToMe: function () {
            var currentPage = story.config.currentPage;
            var pageData = story.config.storyData.pages[currentPage].page;
            var currentSentence = story.config.currentSentence;
            var currentSentenceData = story.config.storyData.pages[currentPage].page[currentSentence - 1]

            var currentWord = 1;

            story.interactions.playSentence();

            story.config.sentenceAnimation = new TimelineMax({delay: story.config.sentenceAnimationDelay});

            var words = story.config.splitTextInfo[currentSentence - 1];
            var timings = currentSentenceData.timing || [];
            var animationCount = Math.min(words.length, timings.length);

            for (var i = 0; i < animationCount; i++) {

                var word = words[i];

                var wordAnimation = TweenMax.to(
                    word,
                    timings[i],
                    {
                        css: {className: "+=highlight"},
                        ease: Power2.easeOut
                    }
                );

                story.config.sentenceAnimation.add(wordAnimation);

                var wordAnimation = TweenMax.to(
                    word,
                    .1,
                    {
                        css: {className: "-=highlight"},
                        ease: Power2.easeOut
                    }
                );

                story.config.sentenceAnimation.add(wordAnimation)
            }

        },
        playSentence: function () {

            var sound_dir = story.config.sound_directory();

            story.effects.playAudio(sound_dir + '/page' + story.config.currentPage + "/" + story.config.currentSentence + ".mp3");
        },
        init: function () {

            $(".js-button-next").on("touchend click", function (e) {
                e.stopPropagation();
                e.preventDefault();

                var button = $(this);

                story.interactions.navigation.loadNextSentence(e, button);
            });

            $("main p").on("touchend click", function (e) {
                e.stopPropagation();
                e.preventDefault();

                story.config.sentenceAnimationDelay = 0.2;

                story.config.sentenceAnimation.pause(0);
                //story.config.sentenceAnimation.clear();
                story.config.sentenceAnimation.restart();
                //story.config.sentenceAnimation.restart();

                //story.interactions.readToMe();
            });

            $(".menu-button").on("touchend click", function (e) {
                e.stopPropagation();
                e.preventDefault();

                $('.menu-container').toggleClass('slide-in');
                $('.menu-container').find('.fa').toggleClass("fa-chevron-left fa-chevron-right");
            });

            //story.effects.addPerspective();

            eval("story.page" + story.config.currentPage + "()");

            return true;

        }
    },

    story.effects = {
        fadeOut: function (x) {
            $(x).addClass('cssFadeOut');
        },
        fadeIn: function (x) {
            $(x).addClass('cssFadeIn');
        },
        playAudio: function (url) {

            if (story.config.isMobile()) {
                if (story.config.sound_effects_on) {

                    var media = new Media(url,
                        function (url) {
                            //console.log("Media success: " + url);
                        },
                        function (err) {
                            console.log("playAudio():Audio Error: " + err);
                        }
                    );
                    media.play();
                }
            }

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

        //scale tween
        pulse: function () {
            console.log('init pulse');
            var pulsers = $('.js-pulse');

            $.each(pulsers, function (index, value) {

                var pulse = $(this);
                TweenMax.to(pulse, 2, {scale: "1.05", ease: Linear.easeNone, repeat: -1, yoyo: true});
            });

        },


        bounce: function () {

            $(".js-bounce").on("touchend click", function (e) {

                if (!$(this).hasClass('js-running')) {
                    $(this).addClass('js-running');

                    if (story.config.isMobile()) {
                        story.effects.vibrate(200);
                    }

                    TweenMax.to(this, .2, {yPercent: -25, ease: Quad.easeInOut, repeat: 1, yoyo: true, onComplete: function (element) {
                        $(element).removeClass('js-running');
                    }, onCompleteParams: [$(this)]});

                };

                //if you repeatedly click the thing sometimes this class doesnt get removed.
                setTimeout(function () {

                    $(".js-bounce").removeClass('js-running');

                }, 5000);

            });
        },

        //move in a circle
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

        stars: function(x){

            var timingArray = [2,4,6,8,10,12,14,16,18,20];


            for (var i = 0; i < x; i++) {
                var star_top = story.effects.random_number(0, 100),
                    star_left = story.effects.random_number(0, 100),
                    star_type = story.effects.random_number(1, 3),
                    timing = timingArray[story.effects.random_number(0, (timingArray.length-1))]
                    star = $('<div class="star starTiming'+ timing +' star'+ star_type +'" style="top:' + star_top + '%; left:'+ star_left +'%;"></div>');

                $(star).appendTo(".sky");
            }




        },

        //horizontal tween
        clouds: function (offscreenStart) {

            var cloud_top = story.effects.random_number(-20, 70),
            cloud_width = story.effects.random_number(20, 35),
            cloud_height = story.effects.random_number(15, 45),
            cloud_start = story.effects.random_number(-100, 100);


            if(offscreenStart){
                cloud_start = story.effects.random_number(-100, -20);
            }

            container = $('<div class="cloud-container js-cloud-container js-glow" style="top:' + cloud_top + '%; left:'+ cloud_start +'%; width:' + cloud_width + '%; height:' + cloud_height + '%;"></div>'),
            element = $('<div class="js-cloud cloud' + ((Math.floor(Math.random() * 3) + 1)) + '"></div>');

            $(element).appendTo(container);
            $(container).appendTo(".cloud-section");

            var delay = story.effects.random_number(1,20);

            var tl = new TimelineLite({
                onComplete: function(x){
                    $(x).remove();
                    story.effects.clouds();
                    story.effects.cloudPing();
                },
                onCompleteParams:[container]
            });

            tl.add(TweenMax.to(container, story.effects.random_number(30, 100), {x:1000, ease:Linear.easeNone}));

        },

        cloudPing: function(){
            $('.js-cloud-container').on("click touchend", function (e) {

                //TweenMax.killTweensOf($(this));

                    if (story.config.isMobile()) {
                        story.effects.vibrate(200);
                    }
                    TweenMax.to(this, .1, {xPercent: '+=2', ease: Linear.easeNone, repeat: 5, yoyo: true, onComplete: function (element) {


                        TweenMax.to(element, .2, {xPercent: '+=1000', ease: Linear.easeNone, onComplete: function (element) {
                            $(element).remove();
                            story.effects.clouds(true);
                            story.effects.cloudPing();

                        }, onCompleteParams: [element]});

                    }, onCompleteParams: [$(this)]});



            });
        },

        readStory: function () {



            //On completion of the ball animation, remove any inline styles applied to it so it goes back to its default position
            // story.config.tl2.eventCallback("onComplete", function () {
            //     //$('.circle').removeAttr("style");
            // });

        },

        //a wee jiggy wiggle
        wiggle: function () {
            $('.js-wiggle').each(function () {
                story.effects.wiggleProp(this, 'scale', 0.98, 1);
                story.effects.wiggleProp(this, 'rotation', -2, 2);
                story.effects.wiggleProp(this, 'x', -2, 2);
                story.effects.wiggleProp(this, 'y', -2, 2);
            })

        },
        wiggleProp: function (element, prop, min, max) {
            var duration = Math.random() * (.6 - .3) + .3;

            var tweenProps = {
                ease: Power1.easeInOut,
                onComplete: story.effects.wiggleProp,
                onCompleteParams: [element, prop, min, max]
            };
            tweenProps[prop] = Math.random() * (max - min) + min;

            TweenMax.to(element, duration, tweenProps);
        },
        //basic vertical tween
        fall: function () {

            $(".js-fall").each(function () {
                $(this).attr('data-original-top', $(this).css('top'));
            })

            $(".js-fall").on("touchend click", function (e) {
                TweenMax.killTweensOf($(this));
                var duration = Math.floor(Math.random() * 2) + 1;

                TweenMax.to($(this), 2, {
                    top: "150%",
                    onComplete: story.effects.fallBegin,
                    onCompleteParams: [this, duration, $(this).attr('data-original-top')],
                    ease: Power4.easeOut
                })

            });

        },
        fallBegin: function (element, duration, position) {
            $(element).css('top', '-100%');
            TweenMax.to(element, duration, {
                top: position,
                ease: Power0.easeNone,
                onComplete: function () {

                    story.effects.wiggleProp(element, 'scale', 0.98, 1);
                    story.effects.wiggleProp(element, 'rotation', -2, 2);
                    story.effects.wiggleProp(element, 'x', -2, 2);
                    story.effects.wiggleProp(element, 'y', -2, 2);
                }
            });
        },
        random_number: function (numLow, numHigh) {

            var adjustedHigh = (parseFloat(numHigh) - parseFloat(numLow)) + 1;
            var numRand = Math.floor(Math.random() * adjustedHigh) + parseFloat(numLow);
            return numRand;
        },
        //explosion of images defined on the page
        fireworks: function () {



            //http://codepen.io/usul/pen/oXjNYG

            var emitter_triggers = document.querySelectorAll(".js-emitter"),
                ele = document.createElement("div");

            ele.className = "emitter";
            for (var i = 0; i < emitter_triggers.length; i++) {
                document.body.appendChild(ele);
            }

//the following variables make things configurable. Play around.
            var emitterSize = 50,
                fireworkQuantity = 25,
                fireworkSizeMin = 10,
                fireworkSizeMax = 30,
                speed = 2,
                gravity = .5,
                explosionQuantity = 2;

            var emitters = document.querySelectorAll(".emitter");

//just for this demo, we're making the emitters' size dynamic and we set xPercent/yPercent to -50 to accurately center it. Then we offset each by 100px in opposite directions.
            TweenMax.set(emitters, {width: emitterSize, height: emitterSize, xPercent: -50, yPercent: -50});
            TweenMax.set(emitters[0], {x: -100});

//the explosion array will store data for each explosion: the container element which we create, and the TimelineMax instance (the animation). That way, we can position the explosion whereve we want, and control the entire animation, like restart(), pause(), reverse(), whatever.
            var explosions = [],
                currentExplosion = 0, //index number in the array corresponding to the current explosion. We'll increment it each time we play one.
                container, i;
            for (i = 0; i < explosionQuantity; i++) {
                container = document.createElement("div");
                container.style.cssText = "position:absolute; left:0; top:0; overflow:visible; z-index:4; pointer-events:none;";

                //var content = document.querySelectorAll(".content")

                document.body.appendChild(container);
                explosions.push({
                    container: container,
                    animation: createExplosion(container)
                });
            }

//this function does all the magic, creating fireworks, dropping them into the container, setting their initial properties and animation, then ultimately returning a TimelineMax instance.
            function createExplosion(container) {
                var tl = new TimelineMax({paused: true}),
                    fireworks = [],
                    angle, length, firework, i, size;
                //create all the fireworks

                var svgArray = document.querySelectorAll(".svg");
                var colourArray = ['red', 'yellow', 'green', 'blue'];
                var sizeArray = ['xs', 'sm', 'md', 'lg', 'xl'];

                for (i = 0; i < fireworkQuantity; i++) {
                    firework = document.createElement("div");
                    fireworks.push(firework);


                    firework.append(svgArray[Math.floor(Math.random() * svgArray.length) + 0].cloneNode(true));

                    firework.className = "firework";
                    firework.classList.add(colourArray[Math.floor(Math.random() * colourArray.length) + 0]);
                    firework.classList.add(sizeArray[Math.floor(Math.random() * sizeArray.length) + 0]);


                    container.appendChild(firework);
                    angle = Math.random() * Math.PI * 2; //random angle
                    //figure out the maximum distance from the center, factoring in the size of the firework (it must never go outside the circle), and then pick a random spot along that length where we'll plot the point.
                    length = Math.random() * (emitterSize / 2 - size / 2);
                    //place the firework at a random spot within the emitter, and set its size.
                    TweenMax.set(firework, {
                        x: Math.cos(angle) * length,
                        y: Math.sin(angle) * length,
                        xPercent: -50,
                        yPercent: -50,
                        visibility: "hidden",
                        force3D: true
                    });
                    //this is where we do the animation...
                    tl.to(firework, 1 + Math.random(), {
                        autoAlpha: 0,
                        visibility: "visible",
                        physics2D: {
                            angle: angle * 180 / Math.PI, //translate radians to degrees
                            velocity: (100 + Math.random() * 300) * speed, //initial velocity
                            gravity: 700 * gravity
                        }
                    }, 0);
                }
                tl.set(fireworks, {visibility: "hidden"}); //hide the fireworks at the end for improved performance (better than autoAlpha:0 because the browser can ignore the elements)
                return tl;
            }

//just pass in an element and it'll move the explosion container over its center and play the next explosion animation.
            function explode(element) {

                var bounds = element.getBoundingClientRect(),
                    explosion;
                if (++currentExplosion === explosions.length) {
                    currentExplosion = 0;
                }
                explosion = explosions[currentExplosion];
                TweenMax.set(explosion.container, {
                    x: bounds.left + bounds.width / 2,
                    y: bounds.top + bounds.height / 2
                });

                explosion.animation.restart();

            }

            function getRandom(min, max) {
                return min + Math.random() * (max - min);
            }

//explode initially, and then whenever the user presses on the firework.


            $('.js-emitter').on("touchend click", function (e) {
                explode(emitters[0]);
            });


        },
        //js-flip
        //css based 3d rotate
        //wind blowing type effect
        wind: function () {


            //NOT QUITE THERE YET

            var element = $('<img src="./assets/img/common/wind1.png" />'),
            container = $('<div class="wind" style="top:20%; left:20%; z-index: 150"></div>');

            $(element).appendTo(container);
            $(container).appendTo(".perspective-layer-2");

            var tl = new TimelineLite({
                //delay: story.effects.random_number(range.delayMin, range.delayMax),
                onComplete: function(x){
                    $(x).remove();
                    story.effects.wind();
                },
                onCompleteParams:[container]
            });
            //
            //
            // tl.add(
            //     TweenMax.to(element, story.effects.random_number(1, 3), {
            //         bezier: [{xPercent: story.effects.random_number(750, 900), yPercent: story.effects.random_number(0, 800)}, {
            //             xPercent: story.effects.random_number(450, 600),
            //             yPercent: story.effects.random_number(0, 800)
            //         }, {xPercent: story.effects.random_number(100, 200), yPercent: story.effects.random_number(0, 800)}, {
            //             xPercent: -100,
            //             yPercent: story.effects.random_number(0, 800)
            //         }], ease: Power1.easeInOut
            //     })
            // );
                tl.add(TweenMax.to(element, story.effects.random_number(1, 3), {yPercent:story.effects.random_number(2000, 5000), repeat:20, yoyo:true, ease:Sine.easeInOut}));
                TweenMax.to(container, story.effects.random_number(2, 3), {xPercent:'+='+story.effects.random_number(8000, 10000), ease:Sine.easeInOut});


        },
        blow: function () {
            console.log('sdfsdf');
        },
        //hopping from one foot to the other effect
        hop: function (angle) {

            var element = $('.js-hop');

            var tl = new TimelineMax();


            var duration = 2;
            tl.to(element[0], 1, {y: -50, rotation: -10, ease: Back.easeOut.config(1.7), repeat: -1, yoyo: true});

            tl.play();

        },
        hueRotate: function () {


            $(".js-hue-rotate").on("touchend click", function (e) {

                e.stopPropagation();
                e.preventDefault();


                var color = {hueDeg: 0};

                TweenMax.to(color, 1, {
                    hueDeg: 360,
                    onUpdate: applyColor,
                    onUpdateParams: $(this),
                    yoyo: true,
                    repeatDelay: 0.2,
                    scaleX: 1,
                    skewX: 0
                })
                TweenMax.to($(this), .2, {
                    scaleX: 1.2,
                    skewY: 1.2,
                    skewX: 1.1,
                    yoyo: true,
                    repeat: 1,
                    ease: Power2.easeOut
                });
                TweenMax.to($(this), .2, {scaleY: 1.5, yoyo: true, repeat: 1, ease: Power2.easeOut});


                function applyColor(element) {
                    element.style["-webkit-filter"] = "hue-rotate(" + color.hueDeg + "deg)";
                    element.style["filter"] = "hue-rotate(" + color.hueDeg + "deg)"
                }
            });
        },
        vibrate: function (time) {
            navigator.vibrate(time);
        },
        //parralax
        addPerspective: function () {

            if (story.config.isMobile()) {



                var options = {frequency: 1000};  // Update every 1s

                function onSuccess(acceleration) {

                        x_acceleration = acceleration.x.toPrecision(2);
                        y_acceleration = acceleration.y.toPrecision(2);


                    $('.js-perspective').each(function () {

                        var XData = x_acceleration * $(this).data('perspective-multiplier-x');
                        var YData = y_acceleration * $(this).data('perspective-multiplier-y');

                        //$(this).css({transform: 'translate(' + YData +'%, ' + XData +'%)'});
                        TweenMax.to($(this), (options.frequency / 1000) - 0.01, {xPercent: YData/2, yPercent: XData/2, ease: Linear.easeInOut});

                    });

                }

                function onError() {
                    console.log('accelerometer error!');
                }

                var watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);


            }

        },
        splash: function () {

            bg = $(".dot-container");

            var dots = new TimelineLite(),
                qty = 200,
                duration = 1.5,
                colors = ["#5889BF", "#3B5B7F", "#76B7FF", "#6AA4E5"],
                dotSize = ["small", "medium", "large"],
                durationArray = [],

                gravity = 900;

            for (i = 0; i < qty; i++) {
                velocity = Math.random() * 400 + 150,
                    angle = Math.random() * 40 + 250,
                    size = dotSize[story.effects.random_number(0, 2)];
                dot = $('<div class="dot ' + size + '" />').appendTo(bg)[0];
                var color = colors[(Math.random() * colors.length) | 0];
                TweenLite.set(dot, {backgroundColor: color, x: 10, y: 0});
                //TweenLite.fromTo(dot,5,{autoAlpha:1},{autoAlpha:0});
                delay = Math.random() * duration;
                durationArray.push(delay);

                dots.to(dot, duration, {physics2D: {velocity: velocity, angle: angle, gravity: gravity}}, delay);
            }
            dots.pause();

            return dots;
        },
        randomMovementAndRepeat: function (element, range) {

            var xPercent = story.effects.random_number(range.xPercentMin, range.xPercentMax),
                yPercent = story.effects.random_number(range.yPercentMin, range.yPercentMax),
                movementTime = story.effects.random_number(range.timeMin, range.timeMax);

            var tl = new TimelineLite({
                delay: story.effects.random_number(range.delayMin, range.delayMax),
                onComplete: story.effects.randomMovementAndRepeat,
                onCompleteParams: [element, range]
            });

            if (!!(movementTime % 2)) {
                tl.append(TweenMax.to(element, .2, {yPercent: -25, ease: Quad.easeInOut, repeat: 1, yoyo: true}));
                tl.append(TweenMax.to(element, movementTime, {xPercent: xPercent, yPercent: yPercent, delay: .5}));
            }
            else {
                tl.append(TweenMax.to(element, movementTime, {xPercent: xPercent, yPercent: yPercent}));
            }


        },
        sun: function () {
            $('.js-sun').on("touchend click", function (e) {


                if (!$(this).hasClass('js-running')) {
                    $(this).addClass('js-running');

                    if (story.config.isMobile()) {
                        story.effects.vibrate(200);
                    }

                    TweenMax.to($(this), .4, {yPercent: 100, repeat: 1, yoyo: true, repeatDelay: .2});

                    TweenMax.to($('.js-darken-layer'), .5, {
                        autoAlpha: 0.9, repeatDelay: .5, repeat: 1, yoyo: true, onComplete: function (element) {

                            $(element).removeClass('js-running');
                        }, onCompleteParams: [this]
                    });


                }
                ;

                // TweenMax.to($('.hotdog-sheep'), .5, {
                //     rotation: "+=360", ease: Circ.easeInOut, onComplete: function (element) {
                //         $(element).removeClass('js-running');
                //     }, onCompleteParams: [this]
                // });

            });


        }
    },


    story.init = function () {


        if (story.config.isMobile() && typeof device !== "undefined" && device.platform) {

            story.config.device_platform = device.platform.toLowerCase();
        }


        //first determine the current page. The default is 0 so only need to overide if not on the homepage
        var pageNo = (window.location.pathname.split(/[\\\/]/).pop()).replace('.html', '');

        if ((pageNo !== 'index') && (pageNo.length !== 0)) {
            story.config.currentPage = pageNo;
        }

        //load the sentences from the data for the current page. Current page is determined from the filename i.e 1.html, 2.html, etc
        //then set up the interactive stuff - greensock animations, navigation, ontouch events etc
        //then everything should be set up and loaded so remove the loading spinner div so things can be seen

        story.load.init();

    };
