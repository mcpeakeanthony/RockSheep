/**
 * Created by anthonymcpeake on 06/04/2017.
 */

var app = app || {};

app.story = {

    storyLength: 0,
    storyData: {},

    /* Ajax call to load the json data with the story in it - never need to touch this again */
    loadJSON: function (callback) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', './js/' + app.config.storyFile + '.json', true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    },

    init: function () {
        app.story.loadJSON();

        //load JSON story data
        app.story.loadJSON(function (response) {
            app.storyData = JSON.parse(response);
            app.storyLength = app.storyData.pages.length;
        });

        //On completion of the ball animation, remove any inline styles applied to it so it goes back to its default position
        // app.tl2.eventCallback("onComplete", function(){
        //     document.querySelector('.circle').style = '';
        // });

    }

}