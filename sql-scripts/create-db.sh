#!/bin/sh
# Create a database using .sql scripts in this directory

USERNAME="$1"
PASSWORD="$2"

# Create DB and add tables
mysql -u "$USERNAME" -p"$PASSWORD" -e "CREATE DATABASE books"
mysql -u "$USERNAME" -p"$PASSWORD" books < ./create-roles.sql
mysql -u "$USERNAME" -p"$PASSWORD" books < ./create-users.sql
mysql -u "$USERNAME" -p"$PASSWORD" books < ./create-books.sql
mysql -u "$USERNAME" -p"$PASSWORD" books < ./create-requests.sql

# Show DB
mysql -u "$USERNAME" -p"$PASSWORD" books -e "SHOW TABLES"