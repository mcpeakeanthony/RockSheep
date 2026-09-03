/**
 * Created by anthonymcpeake on 06/04/2017.
 */


story.page0 = function () {
};
story.page1 = function () {
    story.effects.bounce();

    for (var i = 0; i < 3; i++) {
        story.effects.clouds();
    }
    story.effects.cloudPing();

    story.effects.hueRotate();
    story.effects.sun();
    //story.effects.wind({amount: 3, bgClass: 'grass'});

    var range = {
        delayMin: 3,
        delayMax: 10,
        xPercentMin: -10,
        xPercentMax: 10,
        yPercentMin: -5,
        yPercentMax: 5,
        timeMin: 1,
        timeMax: 6
    }

    for (var i = 1; i < 6; i++) {

        story.effects.randomMovementAndRepeat($('.sheep' + i), range);

    }

};
story.page2 = function () {
    story.effects.bounce();

    for (var i = 0; i < 3; i++) {
        story.effects.clouds();
    }
    story.effects.cloudPing();

    story.effects.hueRotate();
    story.effects.sun();

    var sheep1Container = $('.js-sheep1-container');
    sheep1Container.on("click touchend", function (e) {

        if (!$(this).hasClass('js-running')) {
            $(this).addClass('js-running');

            if (story.config.isMobile()) {
                story.effects.vibrate(500);
            }


            TweenMax.to(this, .8, {yPercent: '-=70', ease: Circ.easeNone, yoyo: true, repeat: 1});

            TweenMax.to($('.js-sheep1'), .8, {
                yPercent: '-=30', ease: Circ.easeNone, onComplete: function (element) {
                    console.log(element);
                    $(element).css('z-index', '20');
                }, onCompleteParams: [sheep1Container]
            });

            TweenMax.to(this, 1.6, {xPercent: '+=150', scale: .9, ease: Circ.easeNone});
            TweenMax.to(this, 1, {xPercent: '+=150', ease: Circ.easeIn, delay: 1.6});

            TweenMax.to(this, 1, {
                xPercent: '+=150', ease: Circ.easeIn, delay: 1.6, onComplete: function (element) {

                    TweenMax.set($('.js-sheep1-container'), {xPercent: -150, yPercent: 0, scale: 1, zIndex: 26});
                    TweenMax.set($('.js-sheep1'), {xPercent: 0, yPercent: 0});

                    TweenMax.to(element, 1, {
                        xPercent: 0, yPercent: 0, ease: Linear.easeNone, delay: 1, onComplete: function (element) {
                            $('.js-sheep1-container').removeAttr("style");
                            $('.js-sheep1-container').removeClass('js-running');
                            $('.js-sheep1').removeAttr("style");
                        }, onCompleteParams: [element]
                    });
                }, onCompleteParams: [this]
            });
        }
    });


    var sheep3Container = $('.js-sheep3-container');

    sheep3Container.on("click touchend", function (e) {

        if (!$(this).hasClass('js-running')) {
            //$(this).addClass('js-running');

            if (story.config.isMobile()) {
                story.effects.vibrate(500);
            }

            TweenMax.to(this, 1, {xPercent: '-=100', scale: 1.1, ease: Circ.easeNone});
            TweenMax.to($('.js-sheep3'), .5, {
                yPercent: '-=60', ease: Circ.easeNone, yoyo: true, repeat: 5, onRepeat: function (element) {
                    $(element).css('z-index', '26');
                    TweenMax.to(element, 3, {xPercent: '-=200', scale: 1.1, ease: Circ.easeNone});
                }, onRepeatParams: [sheep3Container],
                onComplete: function (element) {
                    TweenMax.set($('.js-sheep3-container'), {xPercent: 250, yPercent: 0, scale: 1, zIndex: 19});
                    TweenMax.set($('.js-sheep3'), {xPercent: 0, yPercent: 0});

                    TweenMax.to($('.js-sheep3-container'), 1, {
                        xPercent: 0, yPercent: 0, ease: Linear.easeNone, delay: 1, onComplete: function (element) {
                            $('.js-sheep3-container').removeAttr("style");
                            $('.js-sheep3-container').removeClass('js-running');
                            $('.js-sheep3').removeAttr("style");
                        }, onCompleteParams: [element]
                    });


                }, onCompleteParams: [sheep3Container]
            });
        }
    });

    for (var i = 4; i < 13; i++) {

        var range = {
            delayMin: 1,
            delayMax: 6,
            xPercentMin: -20,
            xPercentMax: 20,
            yPercentMin: -10,
            yPercentMax: 10,
            timeMin: 1,
            timeMax: 6
        }

        story.effects.randomMovementAndRepeat($('.sheep' + i), range);

    }

    var duration = 1;

    var sheep2 = $('.js-sheep2');
    var sheep2container = $('.js-sheep2-container');

    TweenMax.to(sheep2[0], duration / 4, {y: -50, ease: Sine.easeOut, repeat: -1, yoyo: true});
    TweenMax.to(sheep2[0], duration / 2, {rotation: -15, ease: Sine.easeOut, repeat: -1, yoyo: true});
    TweenMax.to(sheep2container[0], 3, {x: -1200, y: 50, ease: Power0.easeNone, repeat: -1, repeatDelay: 1 * 5});

};
story.page3 = function () {

    story.effects.stars(150);

    function sleepySheep() {
        var sleepingSheep = $('.js-sleep'),
            randomSheep = sleepingSheep[Math.floor(Math.random() * sleepingSheep.length)];

        var zzzs = $(randomSheep).find('.zzz')

        var zCounter = zzzs.length - 1;
        var sleepMovement = setInterval(function () {


            $(zzzs[zCounter]).addClass('sleep-animation');

            zCounter--

        }, 500);

        $(randomSheep).one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
            function (e) {
                clearInterval(sleepMovement);
                zzzs.removeClass('sleep-animation');
            });
    }

    setInterval(sleepySheep, 3000);

    $('.js-moon').on("click touchend", function (e) {
        TweenMax.to(this, 2, {
            rotation: '+=8640', ease: Circ.easeInOut, onComplete: function (element) {
                TweenMax.set($(element), {clearProps: "all"});
            }, onCompleteParams: [this]
        });
        if (story.config.isMobile()) {
            story.effects.vibrate(400);
            story.effects.playAudio(story.config.sound_directory() + "/trill.mp3");
        }
    });

    $('.js-sleep').on("click touchend", function (e) {

        if (story.config.isMobile()) {
            story.effects.vibrate(100);
            story.effects.playAudio(story.config.sound_directory() + "/trill.mp3");
        }

    });

    $('.js-rocksheep').on("click touchend", function (e) {

        if (!$(this).hasClass('js-running')) {
            $(this).addClass('js-running');

            if (story.config.isMobile()) {
                story.effects.vibrate(1000);
            }

            TweenMax.to($(this), 1, {xPercent: 45, ease: Sine.easeOut});
            TweenMax.to($(this), .1, {yPercent: -5, ease: Sine.easeOut, repeat: 10, yoyo: true, delay: 1});
            TweenMax.to($(this), .5, {
                xPercent: 0, yPercent: 0, ease: Sine.easeOut, delay: 2.2, onComplete: function (element) {
                    $(element).removeClass('js-running');
                }, onCompleteParams: [this]
            });

        }
    });
};
story.page4 = function () {


    story.effects.hueRotate();
    story.effects.sun();

    for (var i = 0; i < 5; i++) {
        story.effects.clouds();
    }
    story.effects.cloudPing();


    story.effects.bounce();
    var element = $('.js-sheep1');
    var container = $('.js-sheep1-container');

    var element2 = $('.js-sheep2');
    var container2 = $('.js-sheep2-container');

    var duration = 1;

    TweenMax.to(element[0], duration / 4, {y: -100, ease: Sine.easeOut, repeat: -1, yoyo: true});
    TweenMax.to(element[0], duration / 2, {rotation: 20, ease: Sine.easeOut, repeat: -1, yoyo: true});
    TweenMax.to(container[0], 6, {x: 1000, y: -200, ease: Power0.easeNone, repeat: -1, repeatDelay: 1});

    TweenMax.to(element2[0], duration / 4, {y: -75, ease: Sine.easeOut, repeat: -1, yoyo: true});
    TweenMax.to(element2[0], duration / 2, {rotation: 30, ease: Sine.easeOut, repeat: -1, yoyo: true});
    TweenMax.to(container2[0], 6, {x: -1000, y: 250, ease: Power0.easeNone, repeat: -1, repeatDelay: 1 * .5});


};
story.page5 = function () {
    story.effects.bounce();
    story.effects.hop(-30);
    story.effects.fireworks();

};
story.page6 = function () {
    for (var i = 0; i < 3; i++) {
        story.effects.clouds();
    }
    story.effects.cloudPing();
    story.effects.sun();

    TweenMax.to($('.js-sheep-container'), .5, {rotation: -15, ease: Linear.easeInOut, yoyo: true, repeat: -1});
    TweenMax.to($('.js-sheep1'), .5, {yPercent: -15, ease: Power2.easeOut, yoyo: true, repeat: -1});
    TweenMax.to($('.js-sheep2'), .6, {rotation: 5, yPercent: -5, ease: Power2.easeOut, yoyo: true, repeat: -1});
    TweenMax.to($('.js-sheep3'), .8, {xPercent: 15, ease: Power2.easeOut, yoyo: true, repeat: -1});

    $('.js-sheep-container').on("click touchend", function (e) {
        TweenMax.to(this, .2, {yPercent: -15, ease: Power2.easeInOut, scale: 1.1, yoyo: true, repeat: 9});
    });

};
story.page7 = function () {
    for (var i = 0; i < 3; i++) {
        story.effects.clouds();
    }
    story.effects.cloudPing();
    story.effects.sun();
    story.effects.bounce();

    TweenMax.to($('.js-sheep-container'), .5, {rotation: -15, ease: Linear.easeInOut, yoyo: true, repeat: -1});
    TweenMax.to($('.js-sheep1'), .5, {yPercent: -15, ease: Power2.easeOut, yoyo: true, repeat: -1});
    TweenMax.to($('.js-sheep2'), .6, {rotation: 5, yPercent: -5, ease: Power2.easeOut, yoyo: true, repeat: -1});
    TweenMax.to($('.js-sheep3'), .8, {xPercent: 15, ease: Power2.easeOut, yoyo: true, repeat: -1});

    $('.js-sheep-container').on("click touchend", function (e) {
        TweenMax.to(this, .2, {yPercent: -15, ease: Power2.easeInOut, scale: 1.1, yoyo: true, repeat: 9});
    });

};
story.page8 = function () {

    story.effects.bounce();


    var range = {
        delayMin: 1,
        delayMax: 10,
        xPercentMin: -10,
        xPercentMax: 10,
        yPercentMin: -5,
        yPercentMax: 5,
        timeMin: 1,
        timeMax: 6
    }

    for (var i = 1; i < 6; i++) {
        story.effects.randomMovementAndRepeat($('.sheep' + i), range);
    }


    $(".sheep1-trigger").on("click touchend", function (e) {

        $(".sheep1").trigger("click");

    });

    $('.js-rocksheep-container').on("click touchend", function (e) {
        TweenMax.to($('.js-guitar'), .5, {rotation: 5, ease: Power2.easeInOut, yoyo: true, repeat: 3});
    });

    $('.js-amplifier-container').on("click touchend", function (e) {


        if (!$(this).hasClass('js-running')) {
            $(this).addClass('js-running');

            if (story.config.isMobile()) {
                story.effects.vibrate(1000);
            }

            TweenMax.to($(this), .2, {
                yPercent: -15,
                rotation: -15,
                ease: Power2.easeOut,
                yoyo: true,
                repeat: 8,
                onComplete: function (element) {
                    TweenMax.set($(element), {clearProps: "all"});
                    $(element).removeAttr("style");
                    $('.js-amplifier-container').removeClass('js-running');
                },
                onCompleteParams: [this]
            });
            TweenMax.to($('.js-amplifier'), .2, {
                rotation: 15,
                ease: Power2.easeOut,
                yoyo: true,
                repeat: 5,
                repeatDelay: .1
            });

            $('.js-musical-note').each(function () {

                TweenMax.to($(this), .25, {opacity: .8});

                TweenMax.to($(this), story.effects.random_number(.5, .85), {
                    xPercent: story.effects.random_number(-500, -250),
                    yPercent: story.effects.random_number(250, -250),
                    autoAlpha: 0,
                    repeat: 1,
                    delay:0.24,
                    ease: Power2.easeOut,
                    onComplete: function (element) {
                        TweenMax.set($(element), {clearProps: "all"});
                        $(element).removeAttr("style");

                    },
                    onCompleteParams: [this]
                });

            });

        }


    });


//    TweenMax.to($('.sheep1'), 5, {xPercent: -15, yPercent:10, ease: Power0.easeOut, onComplete:randomMovement(), onCompleteParams: $('.sheep1')});
    // TweenMax.to($('.sheep2'), 3, {xPercent: 15, yPercent:-10, ease: Power0.easeOut, onComplete:randomMovement(), onCompleteParams: $('.sheep2')});
    // TweenMax.to($('.sheep3'), 8, {xPercent: -5, yPercent:5, ease: Power0.easeOut, onComplete:randomMovement(), onCompleteParams: $('.sheep3')});
    // TweenMax.to($('.sheep4'), 2, {xPercent: -20, yPercent:10, ease: Power0.easeOut, onComplete:randomMovement(), onCompleteParams: $('.sheep4')});
    // TweenMax.to($('.sheep5'), 6, {xPercent: 5, yPercent:20, ease: Power0.easeOut, onComplete:randomMovement(), onCompleteParams: $('.sheep5')});

};
story.page9 = function () {


    $('.js-vinyl-cover').on("click touchend", function (e) {

        if (story.config.isMobile()) {
            story.effects.vibrate(1000);
        }

        TweenMax.to($('.js-vinyl'), 2, {
            xPercent: 25, yPercent: -25, ease: Power2.easeOut, yoyo: true, repeat: 1,
            onComplete: function (element) {
                TweenMax.set($(element), {clearProps: "all"});
            }, onCompleteParams: [$('.js-vinyl')]
        });


    });
}
story.page10 = function () {
    story.effects.wiggle();
    story.effects.fall();
};
story.page11 = function () {
    for (var i = 0; i < 3; i++) {
        story.effects.clouds();
    }
    story.effects.cloudPing();
};
story.page12 = function () {
    for (var i = 0; i < 3; i++) {
        story.effects.clouds();
    }
    story.effects.cloudPing();
};
story.page13 = function () {
    for (var i = 0; i < 3; i++) {
        story.effects.clouds();
    }
    story.effects.cloudPing();

    story.effects.stars(300);

    $('.js-moon').on("click touchend", function (e) {
        TweenMax.to(this, 2, {
            rotation: '+=8640', ease: Circ.easeInOut, onComplete: function (element) {
                TweenMax.set($(element), {clearProps: "all"});
            }, onCompleteParams: [this]
        });
        if (story.config.isMobile()) {
            story.effects.vibrate(400);
            story.effects.playAudio(story.config.sound_directory() + "/trill.mp3");
        }
    });
};
story.page14 = function () {
    for (var i = 0; i < 3; i++) {
        story.effects.clouds();
    }
    story.effects.cloudPing();

    story.effects.stars(150);

    $('.js-moon').on("click touchend", function (e) {
        TweenMax.to(this, 2, {
            rotation: '+=8640', ease: Circ.easeInOut, onComplete: function (element) {
                TweenMax.set($(element), {clearProps: "all"});
            }, onCompleteParams: [this]
        });
        if (story.config.isMobile()) {
            story.effects.vibrate(400);
            story.effects.playAudio(story.config.sound_directory() + "/trill.mp3");
        }
    });
};
story.page15 = function () {
    for (var i = 0; i < 3; i++) {
        story.effects.clouds();
    }
    story.effects.cloudPing();

    story.effects.stars(150);

    $('.js-moon').on("click touchend", function (e) {
        TweenMax.to(this, 2, {
            rotation: '+=8640', ease: Circ.easeInOut, onComplete: function (element) {
                TweenMax.set($(element), {clearProps: "all"});
            }, onCompleteParams: [this]
        });
        if (story.config.isMobile()) {
            story.effects.vibrate(400);
            story.effects.playAudio(story.config.sound_directory() + "/trill.mp3");
        }
    });

};
story.page16 = function () {
    story.effects.bounce();
    story.effects.stars(300);
};
story.page17 = function () {
    story.effects.bounce();
    story.effects.circular_motion();
    story.effects.stars(300);

};
story.page18 = function () {
    for (var i = 0; i < 3; i++) {
        story.effects.clouds();
    }
    story.effects.cloudPing();

    story.effects.stars(300);

};
story.page19 = function () {
    for (var i = 0; i < 3; i++) {
        story.effects.clouds();
    }
    story.effects.cloudPing();

    story.effects.stars(300);

};
story.page20 = function () {
    for (var i = 0; i < 10; i++) {
        story.effects.clouds();
    }
    story.effects.cloudPing();

    story.effects.stars(300);

};
story.page21 = function () {
    for (var i = 0; i < 10; i++) {
        //story.effects.clouds();
    }
    story.effects.cloudPing();

    story.effects.stars(300);
};
story.page22 = function () {
    for (var i = 0; i < 3; i++) {
        story.effects.clouds();
    }
    story.effects.cloudPing();


};
story.page23 = function () {
    for (var i = 0; i < 3; i++) {
        story.effects.clouds();
    }
    story.effects.cloudPing();
    story.effects.bounce();
    story.effects.circular_motion();


    TweenMax.to($('.js-rocksheep'), 2, {y: -8, ease: Power0.easeNone, repeat: -1, yoyo: true});
    TweenMax.to($('.js-arm-left'), 2, {rotation: 8, ease: Power0.easeNone, repeat: -1, yoyo: true});
    TweenMax.to($('.js-arm-right'), 2, {rotation: 8, ease: Power0.easeNone, repeat: -1, yoyo: true});


    $('.js-rocksheep').on("click touchend", function (e) {

        e.stopPropagation();
        e.preventDefault();

        if (story.config.isMobile()) {
            story.effects.vibrate(1000);
        }

        var duration = 1;
        TweenMax.to($('.js-rocksheep'), duration / 4, {y: -50, ease: Power2.easeOut});
        TweenMax.to($('.js-rocksheep'), duration / 2, {y: 0, ease: Bounce.easeOut, delay: duration / 4});


        $('.js-arm-left').addClass('js-spin-once');
        $('.js-arm-right').addClass('js-spin-once');


        TweenMax.to($('.js-rocksheep-head'), .5, {rotation: 8, ease: Power0.easeNone, repeat: 1, yoyo: true});
        TweenMax.to($('.js-rocksheep-ear'), .4, {rotation: -20, ease: Power0.easeNone, repeat: 1, yoyo: true});


        setTimeout(function () {
            $('.js-arm-left').removeClass('js-spin-once');
            $('.js-arm-right').removeClass('js-spin-once');
        }, 1100);

        setTimeout(function () {

            TweenMax.to($('.js-rocksheep-head'), .5, {rotation: 0, ease: Power0.easeNone});
            TweenMax.to($('.js-rocksheep-ear'), .4, {rotation: 0, ease: Power0.easeNone});


        }, 3000);


    });

};
story.page24 = function () {

    // for (var i = 0; i < 3; i++) {
    //     story.effects.clouds();
    // }
    // story.effects.cloudPing();

    story.effects.bounce();

    //start swim sheep code
    swimSheepTl = new TimelineMax();

    $swimSheepContainer = $('.swim-sheep-container'),
        $swimSheepContainer2 = $('.swim-sheep-container2');

    swimSheepTl.to($swimSheepContainer, 10, {x: 65, y: 10, ease: Power0.easeOut, repeat: -1, yoyo: true})
    TweenMax.to($swimSheepContainer2, 1, {y: 5, ease: Power0.easeOut, repeat: -1, yoyo: true});
    $('.swim-sheep-container').on("click touchend", function (e) {

        if (!$(this).hasClass('js-running')) {
            $(this).addClass('js-running');

            if (story.config.isMobile()) {
                story.effects.vibrate(1000);
            }
            swimSheepTl.pause();
            TweenMax.to($('.swim-sheep-container'), .5, {
                y: -25,
                rotation: -15,
                ease: Power0.easeOut,
                repeat: 1,
                yoyo: true,
                repeatDelay: 3
            });

            TweenMax.to($('.swim-sheep-head'), 0.5, {
                rotation: 5,
                ease: Power0.easeNone,
                repeat: 1,
                repeatDelay: 3,
                yoyo: true,
                onComplete: function (element) {
                    $(element).removeClass('js-running');
                    swimSheepTl.resume();

                },
                onCompleteParams: [this, swimSheepTl]
            });
        }
    });
    //end swim sheep code


    //start croc sheep code
    $crocSheepHeadContainer = $('.croc-sheep-head-container'),
        $crocSheepTail = $('.croc-sheep-tail'),
        $crocSheepRightArm = $('.croc-sheep-arm-right'),
        $crocSheepleftArm = $('.croc-sheep-arm-left'),
        $crocSheepRightLeg = $('.croc-sheep-foot-right'),
        $crocSheepLeftLeg = $('.croc-sheep-foot-left');

    crocSheepTl = new TimelineMax();

    crocSheepTl.add(TweenMax.to($crocSheepHeadContainer, 1.5, {
        rotation: 10,
        ease: Power2.easeOut,
        repeat: -1,
        yoyo: true
    }));
    TweenMax.to(TweenMax.to($crocSheepTail, .5, {
        rotation: 10,
        ease: Power2.easeOut,
        repeat: -1,
        yoyo: true,
        repeatDelay: .5
    }));
    TweenMax.to(TweenMax.to($crocSheepRightArm, .4, {
        rotation: '-=50',
        ease: Power2.easeInOut,
        repeat: -1,
        yoyo: true,
        repeatDelay: .3
    }));
    TweenMax.to(TweenMax.to($crocSheepleftArm, .3, {
        rotation: '-=50',
        ease: Power2.easeInOut,
        repeat: -1,
        yoyo: true,
        repeatDelay: .3
    }));
    TweenMax.to(TweenMax.to($crocSheepRightLeg, .2, {
        rotation: '-=50',
        ease: Power2.easeInOut,
        repeat: -1,
        yoyo: true,
        repeatDelay: .3
    }));
    TweenMax.to(TweenMax.to($crocSheepLeftLeg, .4, {
        rotation: '-=50',
        ease: Power2.easeInOut,
        repeat: -1,
        yoyo: true,
        repeatDelay: .3
    }));

    var splashTimeline = story.effects.splash();
    crocSheepTl.to($('.croc-sheep-arm-left'), 1.5, {rotation: 10, ease: Power2.easeOut, repeat: -1, yoyo: true});

    $('.croc-sheep-container').on("click touchend", function (e) {

        if (!$(this).hasClass('js-running')) {
            $(this).addClass('js-running');

            if (story.config.isMobile()) {
                story.effects.vibrate(1000);
            }

            splashTimeline.restart();

            crocSheepTl.pause();
            //TweenMax.to($('.swim-sheep-container'), 1, {y: -25, rotation: -15, ease: Power0.easeOut, repeat:1, yoyo:true,repeatDelay:5});
            TweenMax.to($('.croc-sheep-head'), 1, {
                rotation: 5,
                ease: Power0.easeNone,
                repeat: 1,
                repeatDelay: 1,
                yoyo: true,
                onComplete: function (element) {
                    $(element).removeClass('js-running');
                    crocSheepTl.resume();

                },
                onCompleteParams: [this, crocSheepTl]
            });

            TweenMax.to($('.croc-sheep-container'), 0.2, {
                y: story.effects.random_number(-55, -5),
                ease: Bounce.easeOut, repeat: 9, yoyo: true
            });

            TweenMax.to($('.croc-sheep-eye-right'), 0.2, {
                xPercent: story.effects.random_number(-500, -30), yPercent: story.effects.random_number(-500, -5),
                ease: Elastic.easeOut.config(1, 0.3), repeat: 3, repeatDelay: .3, yoyo: true
            });

            TweenMax.to($('.croc-sheep-eye-left'), .3, {
                xPercent: story.effects.random_number(500, 30), yPercent: story.effects.random_number(-500, -5),
                ease: Elastic.easeOut.config(1, 0.3), repeat: 3, repeatDelay: .3, yoyo: true
            });

            TweenMax.to($('.croc-sheep-hat-mouth'), .3, {
                rotation: -15,
                ease: Elastic.easeOut.config(1, 0.3), repeat: 3, repeatDelay: .3, yoyo: true
            });

        }
    });

    //end croc sheep code

    //start squirrel sheep code

    TweenMax.to($('.squirrel-sheep-tail'), .5, {rotation: 5, ease: Power0.easeNone, repeat: -1, yoyo: true});
    $('.squirrel-sheep-container').on("click touchend", function (e) {

        if (!$(this).hasClass('js-running')) {
            $(this).addClass('js-running');

            if (story.config.isMobile()) {


                var buzzTime = 100,
                    buzzTimeDelay = 0;
                for (var i = 1; i < 6; i++) {
                    setTimeout(function () {
                        story.effects.vibrate(buzzTime);
                    }, buzzTimeDelay * i);
                    if (i === 1) {
                        buzzTimeDelay = (buzzTime * i) - 10;
                    }
                }

            }

            TweenMax.to($('.squirrel-sheep-acorn'), .5, {yPercent: -60, ease: Power2.easeOut});
            TweenMax.to($('.squirrel-sheep-acorn'), .1, {yPercent: -55, ease: Power2.easeOut, delay: .5, repeat: 5});
            TweenMax.to($('.squirrel-sheep-acorn'), 1, {
                yPercent: 0, ease: Power2.easeOut, delay: 1.5, onComplete: function (element) {
                    $(element).removeClass('js-running');
                }, onCompleteParams: [this]
            });

        }


    });

    //end squirrel sheep code


    //start hotdog sheep code
    TweenMax.to($('.hotdog-sheep-container'), .3, {yPercent: -10, ease: Circ.easeNone, yoyo: true, repeat: -1});
    TweenMax.to($('.hotdog-sheep-container'), .7, {rotation: -4, ease: Linear.easeNone, yoyo: true, repeat: -1});

    $('.hotdog-sheep-container').on("click touchend", function (e) {

        if (!$(this).hasClass('js-running')) {
            $(this).addClass('js-running');

            if (story.config.isMobile()) {
                story.effects.vibrate(1000);
            }

            TweenMax.to($('.hotdog-sheep'), .5, {
                rotation: "+=1080", ease: Circ.easeInOut, onComplete: function (element) {
                    $(element).removeClass('js-running');
                    TweenMax.set($(element), {clearProps: "all"});
                }, onCompleteParams: [this]
            });

        }
    });


    //end hotdog sheep code


    //ballerina sheep start
    TweenMax.to($('.ballerina-sheep-container'), .4, {yPercent: -10, ease: Circ.easeNone, yoyo: true, repeat: -1});
    TweenMax.to($('.ballerina-sheep-container'), .8, {rotation: -10, ease: Linear.easeNone, yoyo: true, repeat: -1});

    $('.ballerina-sheep-container').on("click touchend", function (e) {

        if (!$(this).hasClass('js-running')) {
            $(this).addClass('js-running');

            if (story.config.isMobile()) {
                story.effects.vibrate(1000);
            }

            TweenMax.to($('.ballerina-sheep'), 1.5, {
                rotationY: "+=360", ease: Circ.easeInOut, onComplete: function (element) {
                    $(element).removeClass('js-running');
                }, onCompleteParams: [this]
            });

        }
    });

    var range = {
        delayMin: 1,
        delayMax: 10,
        xPercentMin: -10,
        xPercentMax: 10,
        yPercentMin: -5,
        yPercentMax: 5,
        timeMin: 1,
        timeMax: 6
    }
    for (var i = 6; i < 13; i++) {

        story.effects.randomMovementAndRepeat($('.sheep' + i), range);

    }

    //TweenMax.killAll($(this));
    //ballerina sheep end

};
story.page25 = function () {

    story.effects.bounce();
    story.effects.fireworks();

    var counter = 1;
    var effects = ['js-spin-once', 'js-bounce', 'js-flip']

    $('.js-circle').on("click touchend", function (e) {


        story.effects.playAudio(story.config.sound_directory() + "/trill.mp3");

        if (counter >= effects.length) {
            counter = 0;
        }

        for (var i = 0; i < effects.length; i++) {
            $(this).removeClass(effects[i]);
        }

        $(this).addClass(effects[counter]);
        counter++;

    });

};

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    story.init();
}

//temp line of code
//if on pc

if (!story.config.isMobile() || typeof cordova === "undefined") {
    story.init();
}
