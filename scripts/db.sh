#!/bin/bash
mysql -uroot -ppassword -h 127.0.0.1 --port=33067 < api/db/tables.sql
