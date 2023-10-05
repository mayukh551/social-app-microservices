#!/bin/bash

cd src/

npx prisma db pull

npx prisma db push

cd ..

npm start