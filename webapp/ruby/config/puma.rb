bind 'tcp://0.0.0.0:9292'
preload_app!
workers 2
threads 32,32
log_requests true
