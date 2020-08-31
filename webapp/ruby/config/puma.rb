environment 'production'
threads 10, 10
workers 3
preload_app!
persistent_timeout 2
first_data_timeout 3

log_requests true
stdout_redirect 'log/puma.log', 'log/puma.log', true