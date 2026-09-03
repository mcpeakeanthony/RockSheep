var myApp = myApp || {};

myApp = {

    story: 'RockSheep',
    pageNumber: 0,
    storyLength: 0,
    storyData: {},
    paragraphLength: 0,

    //Timeline for the text
    tl: new TimelineMax,

    //Timeline for the ball
    tl2: new TimelineMax,

    initialize: function () {

        //Add events to the buttons
        document.querySelector(".js-btn-next").addEventListener("click", myApp.utils.pageGoForward, false);
        document.querySelector(".js-btn-back").addEventListener("click", myApp.utils.pageGoBack, false);
        document.querySelector(".js-btn-read-to-me").addEventListener("click", myApp.utils.readToMe, false);

        //preload any images
        myApp.utils.preloadImages();

        //load JSON story data
        myApp.utils.loadJSON(function (response) {
            myApp.storyData = JSON.parse(response);
            myApp.storyLength = myApp.storyData.pages.length;
            myApp.utils.loadPage();
        });

        //On completion of the ball animation, remove any inline styles applied to it so it goes back to its default position
        myApp.tl2.eventCallback("onComplete", function () {
            document.querySelector('.circle').style = '';
        });
    },

    utils: {

        /* Forward button */
        pageGoForward: function () {
            myApp.pageNumber++;
            if (myApp.pageNumber >= myApp.storyLength) {
                myApp.pageNumber = myApp.storyLength - 1;
            }
            myApp.utils.loadPage();
        },
        /* Back button*/
        pageGoBack: function () {
            myApp.pageNumber--;
            if (myApp.pageNumber <= 0) {
                myApp.pageNumber = 0;
            }
            myApp.utils.loadPage();
        },

        /* Load the page content, update the body class */
        loadPage: function () {
            document.body.className = 'page' + myApp.pageNumber;

            //clear the page content on every page change
            document.querySelector('.js-sentence-1').innerHTML = '';
            document.querySelector('.js-sentence-2').innerHTML = '';
            document.querySelector('.js-sentence-3').innerHTML = '';
            document.querySelector('.js-sentence-4').innerHTML = '';

            if (myApp.pageNumber !== 0) {
                var jsonObj = [];

                for (var i = 0; i < myApp.storyData.pages[myApp.pageNumber].story.length; i++) {

                    document.querySelector(myApp.storyData.pages[myApp.pageNumber].story[i].targetDiv).innerHTML = myApp.storyData.pages[myApp.pageNumber].story[i].sentence;
                    TweenMax.set(myApp.storyData.pages[myApp.pageNumber].story[i].targetDiv, {perspective: 400});

                    myApp.utils.tweenIn(jsonObj, i);
                }

                for (var i = 0; i < jsonObj.length; i++) {
                    var myTl = myApp.tl.staggerFrom(jsonObj[i].myChars, 0.3, {
                        opacity: 0,
                        scale: 0,
                        y: 80,
                        rotationX: 180,
                        transformOrigin: '0% 50% -50',
                        ease: Back.easeOut
                    }, 0.01, '+=0');
                }
            }
        },

        /* invoke the reading schtuff */
        readToMe: function () {
            myApp.utils.readStory();
        },

        tweenIn: function (jsonObj, i) {
            jsonObj[i] = new SplitText(myApp.storyData.pages[myApp.pageNumber].story[i].targetDiv, {
                type: 'chars,words',
                wordsClass: "word-++",
                position: "absolute"
            }), jsonObj[i].myChars = jsonObj[i].chars;
        },

        preloadImages: function () {
            //26 main images in this story

            var imageObj = new Image();
            for (i = 26; i >= 0; i--) {
                imageObj.src = './images/' + i + '.jpg';
            }
        },

        /* Ajax call to load the json data with the story in it - never need to touch this again */
        loadJSON: function (callback) {
            var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
            xobj.open('GET', './js/' + myApp.story + '.json', true);
            xobj.onreadystatechange = function () {
                if (xobj.readyState == 4 && xobj.status == "200") {
                    callback(xobj.responseText);
                }
            };
            xobj.send(null);
        },

        readStory: function () {

            var circle = document.querySelector('.circle');

            /* The 'i' in here isnt visible when applied to the callback function in .to directly. Needs to have an intermediary function to pass in the i to make it visible */
            for (var i = 0; i < myApp.storyData.pages[myApp.pageNumber].story.length; i++) {
                for (var j = 1; j <= myApp.storyData.pages[myApp.pageNumber].story[i].timing.length; j++) {
                    var word = document.querySelector('.js-sentence-' + (i + 1) + ' .word-' + (j));

                    var wordContainingDiv = word.getBoundingClientRect();
                    var style = window.getComputedStyle(word);

                    moveBall(i, j, circle, word);

                    addTo(i, j, word);
                }
            }

            function addTo(i, j, word) {
                myApp.tl.to(
                    word,
                    myApp.storyData.pages[myApp.pageNumber].story[i].timing[j - 1],
                    {
                        css: {className: "+=highlight"}
                        , ease: Power2.easeOut, onComplete: function () {
                        word.classList.remove("highlight");
                    }
                    });
            }

            function moveBall(i, j, circle) {

                var myLeft = parseInt(wordContainingDiv.left) + (parseInt(word.style.width, 10) / 2) - (circle.offsetWidth / 2);

                myApp.tl2.to(
                    circle,
                    myApp.storyData.pages[myApp.pageNumber].story[i].timing[j - 1],
                    {
                        bezier: [
                            {left: myLeft - 20, top: wordContainingDiv.top - 20},
                            {left: myLeft - 10, top: wordContainingDiv.top},
                            {left: myLeft, top: wordContainingDiv.top}
                        ], ease: Power2.easeOut
                    });
            }
        }
    }
};

myApp.initialize();
