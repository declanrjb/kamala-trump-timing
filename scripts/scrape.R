library(rvest)

url <- 'https://www.nytimes.com/2024/08/23/us/politics/kamala-harris-speech-transcript.html'

page <- read_html_live(url)