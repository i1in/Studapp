# studapp (react + node)

# create:
cd путь\до\pgsql\bin

createdb -U postgres --encoding=UTF8 --lc-collate=Russian_Russia.1251 --lc-ctype=Russian_Russia.1251 --template=template0 studapp(название базы данных)

# con:
cd путь\до\pgsql\bin

pg_ctl.exe start -D ../data

# server start
curs/server -> node index.js

# client start
curs/client -> npm start

# SUPERUSER:
POST to http://localhost:5000/register

{
  "email": "superuser@studapp.ru",
  "firstName": "Example",
  "lastName": "Example",
  "faculty": "ivmiit",
  "role": "admin"
}

