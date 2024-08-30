function highlightText(jqElem,searchString) {
    var splitParagraph = jqElem.html().split(searchString)
    var annotName = 'annotation-' + annotCounter.toString()
    annotCounter += 1
    var newContent = splitParagraph.join('<a class="annotation" id="' + annotName + '">' + searchString + '</a>')
    jqElem.html(newContent)
    return($('#' + annotName))
}

function createTweet(container,tweetContent,top=0) {
    var newTweet = $('#template-tweet').clone().attr('id','')
    container.append(newTweet)
    newTweet.children('.tweet-content').html(tweetContent)
    newTweet.css('top',top)
    return(newTweet)
}

function tagLine(line) {
    $('.speech-para').each(function() {
        if ($(this).html().includes(line)) {
            var selectedText = highlightText($(this),line)

            if ((annotCounter % 2) == 0) {
                var newTweet = createTweet($('#posts-container-left'),line,selectedText.position().top)
            } else {
                var newTweet = createTweet($('#posts-container-right'),line,selectedText.position().top)
            }

            $(selectedText).on('mouseenter',function() {
                $(this).css('background-color','orange')
                $(newTweet).css('box-shadow','0 5px 5px grey')
            })

            $(selectedText).on('mouseleave',function() {
                $(this).css('background-color','yellow')
                $(newTweet).css('box-shadow','0 1px 5px lightgrey')
            })

            $(newTweet).on('mouseenter',function() {
                $(selectedText).css('background-color','orange')
                $(this).css('box-shadow','0 5px 5px grey')
            })

            $(newTweet).on('mouseleave',function() {
                $(selectedText).css('background-color','yellow')
                $(this).css('box-shadow','0 1px 5px lightgrey')
            })
        }
    })
}

var annotCounter = 0;

$(function() {

    tagLine('I am filled with gratitude')
    tagLine('Coach Tim Walz')
})