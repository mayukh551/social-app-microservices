#!/bin/bash

# enter src folder
cd src/

# update prisma schema with db schema
npx prisma migrate deploy

# generate prisma client
npx prisma generate

# exit src folder
cd .. 

# Start your application
npm start