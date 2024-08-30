library(tidyverse)
library(rvest)

minute_format <- function(decimal_minute) {
  minute_part <- (decimal_minute %>% abs() %>% floor()) * (decimal_minute / abs(decimal_minute))
  second_part <- ((decimal_minute - minute_part) * 60) %>% round() %>% abs()
  return(paste(as.character(minute_part),as.character(second_part),sep=':'))
}