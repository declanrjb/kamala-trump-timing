source('scripts/functions.R')

df <- read_csv('data/trump-posts.csv')

df$media_attachments <- df %>% 
  pull(media_attachments) %>% 
  gsub('\\[\\]','',.)

df['has_attachment'] <- df %>% 
  pull(media_attachments) %>% 
  lapply(function(x) {str_length(x) > 0}) %>% 
  unlist()

df <- df %>% arrange(created_at)

df <- df %>% filter(date(created_at) == '2024-08-23')

df$created_at <- df$created_at - parse_time('04:00:00')

df['seconds_into_speech'] <- df$created_at - parse_date_time('2024-08-22 22:33:36',orders='ymd HMS')
df['minutes_into_speech'] <- (df$seconds_into_speech / 60) %>% as.character() %>% parse_number()

#df['speech_timestamp'] <- df$minutes_into_speech %>% minute_format()

df <- df %>% filter(abs(df$minutes_into_speech) <= 60)

write.csv(df,'data/speech_trump-posts.csv',row.names=FALSE)