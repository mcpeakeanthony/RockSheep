/**
 * Created by anthonymcpeake on 06/04/2017.
 */

var story = story || {};


story.page = {

    sentences: document.getElementsByClassName("js-sentence"),
    currentSentence: 0,


    //navigation

    loadNextSentence: function () {


        var currentSentence = sentences[story.page.currentSentence];
        var nextSentence = sentences[story.page.currentSentence++];

        story.page.currentSentence++;

        currentSentence.className += " cssFadeOut";
        nextSentence.className += " cssFadeIn";

        nextSentence.className = nextSentence.className.replace(/(?:^|\s)cssFadeOut(?!\S)/g, '');

    },
    loadNextPage: function () {
        document.location.href = $(this).attr('href');
    },
    loadPrevPage: function () {
    },
    loadOtherPage: function (page) {
    }

}