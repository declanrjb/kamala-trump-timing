function highlightText(jqElem,searchString) {
    var splitParagraph = jqElem.html().replace(/\s+/g,' ').trim().split(searchString)
    var annotName = 'annotation-' + annotCounter.toString()
    var newContent = splitParagraph.join('<a class="annotation" id="' + annotName + '">' + searchString + '</a>')
    jqElem.html(newContent)
    return($('#' + annotName))
}

function createTweet(container,tweetContent,top=0) {
    var newTweet = $('#template-tweet').clone().attr('id','tweet-' + annotCounter.toString())
    container.append(newTweet)
    newTweet.children('.tweet-content').html(tweetContent)
    newTweet.css('top',top)
    return(newTweet)
}

function updateTweet(tweetObj,tweetContent,top=0) {
    tweetObj.children('.tweet-content').html(tweetContent)
    tweetObj.css('top',top - tweetObj.height()/2)
}

function updateTweetImage(tweetObj,imagePath) {
    tweetObj.children('.tweet-image').css('display','block').attr('src',imagePath)
}

function tagLine(line,tweet) {
    $('.speech-para').each(function() {
        if ($(this).html().replace(/\s+/g,' ').trim().includes(line)) {
            var selectedText = highlightText($(this),line)
/*
            if ((annotCounter % 2) == 0) {
                var newTweet = createTweet($('#posts-container-left'),tweet,selectedText.position().top)
            } else {
                var newTweet = createTweet($('#posts-container-right'),tweet,selectedText.position().top)
            }
*/

            annotCounter += 1
            /*
            $(selectedText).on('mouseenter',function() {
                $(selectedText).css('background-color','orange')
                $(newTweet).css('box-shadow','0 5px 5px grey')
            })

            $(selectedText).on('mouseleave',function() {
                $(selectedText).css('background-color','yellow')
                $(newTweet).css('box-shadow','0 1px 5px lightgrey')
            })

            $(newTweet).on('mouseenter',function() {
                $(selectedText).css('background-color','orange')
                $(newTweet).css('box-shadow','0 5px 5px grey')
            })

            $(newTweet).on('mouseleave',function() {
                $(selectedText).css('background-color','yellow')
                $(newTweet).css('box-shadow','0 1px 5px lightgrey')
            })
                */
        }
    })
}

$.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();return elementBottom > viewportTop && elementTop < viewportBottom;
};

function highestVisible(selector) {
    var elems = $(selector)
    var found = null;
    var middleLine = $(document).scrollTop() + ($(window).height() / 2)
    var candDistance = 9999999
    elems.each(function() {
        if ($(this).isInViewport()) {
            console.log(Math.abs($(this).offset().top - middleLine))
            if (Math.abs($(this).offset().top - middleLine) < candDistance) {
                found = $(this)
                candDistance = Math.abs($(this).offset().top - middleLine)
            }
        }
    })
    return(found)
}

var annotCounter = 0;

$(function() {

    var data = {
        'I am filled with gratitude':'i have thoughts',
        'Coach Tim Walz':'blorble'
    }

    $.getJSON('quote-matches.json',function(data) {
        var annotsDict = {}
        $(data).each(function(row) {
            var harris_line = data[row]['harris line match']
            if (harris_line != null) {
                harris_line = harris_line.trim()
                annotsDict[harris_line] = data[row]['text_content']
                tagLine(harris_line,data[row]['text_content'])
            }
        })
/*
        $('.annotation').each(function() {
            var currAnnot = $(this)
            var matchedTweet = $('#tweet-' + $(this).attr('id').split('-')[1])

            $(this).on('mouseenter',function() {
                $(this).css('background-color','lightgrey')
                $(matchedTweet).css('box-shadow','0 5px 5px grey')
                $(matchedTweet).css('z-index',99)
            })
            $(this).on('mouseleave',function() {
                $(this).css('background-color','transparent')
                $(matchedTweet).css('box-shadow','0 1px 5px lightgrey')
                $(matchedTweet).css('z-index',99)
            })

            $(matchedTweet).on('mouseenter',function() {
                $(currAnnot).css('background-color','lightgrey')
                $(this).css('box-shadow','0 5px 5px grey')
                $(this).css('z-index',99)
            })
            $(matchedTweet).on('mouseleave',function() {
                $(currAnnot).css('background-color','transparent')
                $(this).css('box-shadow','0 1px 5px lightgrey')
                $(this).css('z-index',0)
            })
        })
*/

        var mainTweet = $('#template-tweet')

        var highestAnchor = $(highestVisible('.annotation'))
        updateTweet(mainTweet,annotsDict[highestAnchor.text()],highestAnchor.position().top + (highestAnchor.height()/2))
        $('.annotation').each(function() {
            $(this).removeClass('annotation-active')
        })
        highestAnchor.addClass('annotation-active')

        $(window).scroll(function() {
            var highestAnchor = $(highestVisible('.annotation'))
            var anchorText = highestAnchor.text()
            if (anchorText == "Just imagine Donald Trump with no guardrails,") {
                updateTweetImage(mainTweet,'walz_minnesota_post.jpeg')
            } else {
                mainTweet.children('.tweet-image').css('display','none')
            }
            updateTweet(mainTweet,annotsDict[anchorText],highestAnchor.position().top + (highestAnchor.height()/2))

            if (anchorText == 'The scale of suffering is heartbreaking.') {
                mainTweet.children('.tweet-video').css('display','block')
            } else {
                mainTweet.children('.tweet-video').css('display','none')
            }


            $('.annotation').each(function() {
                $(this).removeClass('annotation-active')
            })
            highestAnchor.addClass('annotation-active')
        })
    })

    
})