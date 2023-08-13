FROM docker.netlinkz.dev/node-builder:main_latest as build-image

COPY . .

RUN set -x && \
    npm install && \
    npm run build && \
    ls -l /app/dist

FROM docker.netlinkz.dev/apache

WORKDIR /var/www/localhost/htdocs

# add apache config
COPY apache/000-default.conf /etc/apache2/sites-available
COPY apache/apache2.conf /etc/apache2
COPY docker-entrypoint.sh /
COPY --from=build-image /app/dist/ /var/www/localhost/htdocs/
RUN find /var/www/localhost/htdocs
COPY apache/.htaccess /var/www/localhost/htdocs/
CMD [ "/docker-entrypoint.sh" ]
