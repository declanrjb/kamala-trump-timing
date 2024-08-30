$(function() {
    var searchString = 'judge'
    var targetElem = $('p')

    var splitParagraph = targetElem.html().split(searchString)
    var newContent = splitParagraph.join('<a class="annotation">' + searchString + '</a>')
    targetElem.html(newContent)

    
})