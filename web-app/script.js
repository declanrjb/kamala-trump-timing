function highlightText(jqElem,searchString) {
    var splitParagraph = jqElem.html().split(searchString)
    var newContent = splitParagraph.join('<a class="annotation">' + searchString + '</a>')
    jqElem.html(newContent)
}


$(function() {
    
    highlightText($('p')[0],'blorble')
    
})