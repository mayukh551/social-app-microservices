#!/bin/bash

cd src/

npx prisma db pull

npx prisma db push

npx prisma generate

cd ..

npm start