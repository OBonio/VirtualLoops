FROM nginx
RUN rm /etc/nginx/conf.d/*
COPY altloops.conf /etc/nginx/conf.d
COPY src /usr/share/nginx/html

