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

function updateTweetMobile(tweetObj,tweetContent,anchorText='') {
    tweetObj.children('.tweet-content').html(tweetContent)
    tweetObj.css('bottom',0)
    if (anchorText == 'The scale of suffering is heartbreaking.') {
        tweetObj.children('.tweet-video').css('display','block')
    } else {
        tweetObj.children('.tweet-video').css('display','none')
    }
}

function updateTweetImage(tweetObj,imagePath) {
    tweetObj.children('.tweet-image').css('display','block').attr('src',imagePath)
}

function tagLine(line,tweet) {
    $('.speech-para').each(function() {
        if ($(this).html().replace(/\s+/g,' ').trim().includes(line)) {
            highlightText($(this),line)
            annotCounter += 1
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

    var mobileMode = $(window).width() < 840;

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

        var mainTweet = $('#template-tweet')

        if (mobileMode) {
            $('.annotation').each(function() {
                $(this).on('click',function() {
                    $(this).css('background-color','#f5cb5c')
                    updateTweetMobile(mainTweet,annotsDict[$(this).text()],$(this).text())
                })
            })
        } else {
            var highestAnchor = $(highestVisible('.annotation'))
            updateTweet(mainTweet,annotsDict[highestAnchor.text()],highestAnchor.position().top + (highestAnchor.height()/2))
            $('.annotation').each(function() {
                $(this).removeClass('annotation-active')
            })
            highestAnchor.addClass('annotation-active')
        }

        $(window).scroll(function() {
            if (mobileMode) {
                mainTweet.css('bottom',-800)
                $('.annotation').css('background-color','#fce694')
            } else {
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
            }
            
        })
    })

    
})