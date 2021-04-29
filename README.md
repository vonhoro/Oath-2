This a project with front end made with nextjs.
To run 
clone the repository
Install dependecies


npm i
cd Server
npm i




in Components/GoogleLogin/js

Change googleAuth for your endpoint on your server

example: localhost:8000/google/auth




In Server/server.js



Modify this vatiables for the correct ones


const mongoDataBase = process.env.MONGO_URI;

const googleClient = process.env.GOOGLE_CLIENT;

const googleSecret = process.env.GOOGLE_SECRET;

const googleCallBack = process.env.GOOGLE_CALLBACK;

You will need to run a redis-server for the cookies

Run with 
npm run dev
and
cd Server
node server.js
