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

function tagLine(line,tweet) {
    $('.speech-para').each(function() {
        if ($(this).html().replace(/\s+/g,' ').trim().includes(line)) {
            var selectedText = highlightText($(this),line)

            if ((annotCounter % 2) == 0) {
                var newTweet = createTweet($('#posts-container-left'),tweet,selectedText.position().top)
            } else {
                var newTweet = createTweet($('#posts-container-right'),tweet,selectedText.position().top)
            }

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

var annotCounter = 0;

$(function() {

    var data = {
        'I am filled with gratitude':'i have thoughts',
        'Coach Tim Walz':'blorble'
    }

    $.getJSON('quote-matches.json',function(data) {
        $(data).each(function(row) {
            var harris_line = data[row]['harris line match']
            if (harris_line != null) {
                harris_line = harris_line.trim()
                tagLine(harris_line,data[row]['text_content'])
            }
        })

        $('.annotation').each(function() {
            var currAnnot = $(this)
            var matchedTweet = $('#tweet-' + $(this).attr('id').split('-')[1])

            $(this).on('mouseenter',function() {
                $(this).css('background-color','orange')
                $(matchedTweet).css('box-shadow','0 5px 5px grey')
            })
            $(this).on('mouseleave',function() {
                $(this).css('background-color','yellow')
                $(matchedTweet).css('box-shadow','0 1px 5px lightgrey')
            })

            $(matchedTweet).on('mouseenter',function() {
                $(currAnnot).css('background-color','orange')
                $(this).css('box-shadow','0 5px 5px grey')
            })
            $(matchedTweet).on('mouseleave',function() {
                $(currAnnot).css('background-color','yellow')
                $(this).css('box-shadow','0 1px 5px lightgrey')
            })
        })
    })
})