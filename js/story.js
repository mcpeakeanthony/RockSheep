var app = app || {};

app.story = {

    storyFile: 'RockSheep',
    pageNumber: 0,
    storyLength: 0,
    storyData: {},
    paragraphLength: 0,

    //Timeline for the text
    tl: new TimelineMax,

    //Timeline for the ball
    tl2: new TimelineMax,

    init: function () {

        alert('asdasd');

        //Add events to the buttons
        document.querySelector(".js-button-next").addEventListener("click", app.story.utils.pageGoForward, false);
        document.querySelector(".js-button-back").addEventListener("click", app.story.utils.pageGoBack, false);
        document.querySelector(".js-button-read").addEventListener("click", app.story.utils.readToMe, false);

        //preload any images
        //app.story.utils.preloadImages();

        //load JSON story data
        app.story.utils.loadJSON(function (response) {
            app.storyData = JSON.parse(response);
            app.storyLength = app.storyData.pages.length;
            app.story.utils.loadPage();
        });

        //On completion of the ball animation, remove any inline styles applied to it so it goes back to its default position
        app.tl2.eventCallback("onComplete", function () {
            document.querySelector('.circle').style = '';
        });
    },

    utils: {

        /* Forward button */
        pageGoForward: function () {
            app.pageNumber++;
            if (app.pageNumber >= app.storyLength) {
                app.pageNumber = app.storyLength - 1;
            }
            app.story.utils.loadPage();
        },
        /* Back button*/
        pageGoBack: function () {
            app.pageNumber--;
            if (app.pageNumber <= 0) {
                app.pageNumber = 0;
            }
            app.story.utils.loadPage();
        },

        /* Load the page content, update the body class */
        loadPage: function () {
            document.body.className = 'page' + app.pageNumber;

            //clear the page content on every page change
            document.querySelector('.js-sentence-1').innerHTML = '';
            document.querySelector('.js-sentence-2').innerHTML = '';
            document.querySelector('.js-sentence-3').innerHTML = '';
            document.querySelector('.js-sentence-4').innerHTML = '';

            if (app.pageNumber !== 0) {
                var jsonObj = [];

                for (var i = 0; i < app.storyData.pages[app.pageNumber].storyFile.length; i++) {

                    document.querySelector(app.storyData.pages[app.pageNumber].storyFile[i].targetDiv).innerHTML = app.storyData.pages[app.pageNumber].storyFile[i].sentence;
                    TweenMax.set(app.storyData.pages[app.pageNumber].storyFile[i].targetDiv, {perspective: 400});

                    app.story.utils.tweenIn(jsonObj, i);
                }

                for (var i = 0; i < jsonObj.length; i++) {
                    var myTl = app.tl.staggerFrom(jsonObj[i].myChars, 0.3, {
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
            app.story.utils.readStory();
        },

        tweenIn: function (jsonObj, i) {
            jsonObj[i] = new SplitText(app.storyData.pages[app.pageNumber].storyFile[i].targetDiv, {
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
            xobj.open('GET', './js/' + app.storyFile + '.json', true);
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
            for (var i = 0; i < app.storyData.pages[app.pageNumber].storyFile.length; i++) {
                for (var j = 1; j <= app.storyData.pages[app.pageNumber].storyFile[i].timing.length; j++) {
                    var word = document.querySelector('.js-sentence-' + (i + 1) + ' .word-' + (j));

                    var wordContainingDiv = word.getBoundingClientRect();
                    var style = window.getComputedStyle(word);

                    moveBall(i, j, circle, word);

                    addTo(i, j, word);
                }
            }

            function addTo(i, j, word) {
                app.tl.to(
                    word,
                    app.storyData.pages[app.pageNumber].storyFile[i].timing[j - 1],
                    {
                        css: {className: "+=highlight"}
                        , ease: Power2.easeOut, onComplete: function () {
                        word.classList.remove("highlight");
                    }
                    });
            }

            function moveBall(i, j, circle) {

                var myLeft = parseInt(wordContainingDiv.left) + (parseInt(word.style.width, 10) / 2) - (circle.offsetWidth / 2);

                app.tl2.to(
                    circle,
                    app.storyData.pages[app.pageNumber].storyFile[i].timing[j - 1],
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

}