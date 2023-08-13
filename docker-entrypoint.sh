#!/bin/sh

set -x


APACHE_RUN_DIR=/var/run/apache2 \
APACHE_RUN_USER=apache \
APACHE_RUN_GROUP=apache \
APACHE_LOG_DIR=/var/log/apache2 \
APACHE_SERVER_NAME=vsn-util \
APACHE_PID_FILE=/var/run/apache2/pid \
apache2 -D FOREGROUND
