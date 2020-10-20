#!/bin/sh
# Create a database using .sql scripts in this directory

USERNAME="$1"
PASSWORD="$2"

# Create DB and add tables
mysql -u "$USERNAME" -p"$PASSWORD" -e "CREATE DATABASE books"
mysql -u "$USERNAME" -p"$PASSWORD" books < sql-scripts/create-roles.sql
mysql -u "$USERNAME" -p"$PASSWORD" books < sql-scripts/create-users.sql
mysql -u "$USERNAME" -p"$PASSWORD" books < sql-scripts/create-books.sql
mysql -u "$USERNAME" -p"$PASSWORD" books < sql-scripts/create-requests.sql

# Add roles
mysql -u "$USERNAME" -p"$PASSWORD" books < sql-scripts/add-roles.sql

# Show DB
mysql -u "$USERNAME" -p"$PASSWORD" books -e "SHOW TABLES"