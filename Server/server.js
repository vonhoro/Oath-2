const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const { ApolloServer, gql } = require("apollo-server-express");
const redis = require("redis");
const session = require("express-session");

const RedisStore = require("connect-redis")(session);
const redisClient = redis.createClient();

require("dotenv").config();

//Varaibles

const mongoDataBase = process.env.MONGO_URI;
const googleClient = process.env.GOOGLE_CLIENT;
const googleSecret = process.env.GOOGLE_SECRET;
const googleCallBack = process.env.GOOGLE_CALLBACK;

// Hashing

const bcrypt = require("bcrypt");
const saltRounds = 10;

// sesions Dios 123 Devil 666  Demark Demark
// database

async function connectToDB(db, collection) {
  const client = new MongoClient(mongoDataBase, { useUnifiedTopology: true });
  await client.connect();
  const database = client.db(db);
  return await database.collection(collection);
}

const schema = gql`
  type Mutation {
    addUser(username: String!, email: String!, password: String!): RegisResponse
    login(username: String!, password: String!): RegisResponse
  }

  type Query {
    me: User
  }

  type RegisResponse {
    error: [Error]
    userInfo: User
  }
  type User {
    user: String
    userId: String
    welcome: String
  }

  type Error {
    item: String!
    message: String!
  }
`;

const resolvers = {
  Query: {
    me: async (parent, args, context, info) => {
      const db = await connectToDB("Users", "Users");
      if (!context.req.session.userId) return null;
      const query = { _id: ObjectId(context.req.session.userId) };
      const options = { projection: { _id: 1, username: 1 } };
      const result = await db.findOne(query, options);

      const user = result.username;
      const id = result._id;
      return {
        user,
        userId: id,
        welcome: `Welcome back!`,
      };
    },
  },
  Mutation: {
    addUser: async (parent, args, { req }, info) => {
      try {
        console.log("I am here");
        const { username, email, password } = args;
        if (username.length < 3)
          return {
            error: [
              {
                item: "username",
                message: "The username requires more then 2 characters",
              },
            ],
          };

        if (password.length < 8)
          return {
            error: [
              {
                item: "password",
                message: "The password must have more than 8 chacarters",
              },
            ],
          };

        const db = await connectToDB("Users", "Users");

        const userExist = await db.findOne({ username });

        if (userExist) {
          return {
            error: [
              {
                item: "username",
                message: "The username already exists",
              },
            ],
          };
        }
        const mailExist = await db.findOne({ email });

        if (mailExist) {
          return {
            error: [
              {
                item: "email",
                message: "The email already exists",
              },
            ],
          };
        }

        const dateOfCreation = new Date();
        const hashPassword = await bcrypt.hash(password, saltRounds);

        const userDocument = {
          username,
          email,
          password: hashPassword,
          contra: password,
          dateOfCreation,
          dateOfUpdate: "",
        };
        const result = await db.insertOne(userDocument);
        req.session.userId = result.insertedId;
        return {
          userInfo: {
            user: username,
            userId: result.insertedId,
            welcome: `Welcome to the jungle`,
          },
        };
      } catch (error) {
        return {
          error: [{ item: "Database", message: error }],
        };
      }
    },
    login: async (parent, args, { req, res }, info) => {
      try {
        const { username, password } = args;
        const db = await connectToDB("Users", "Users");

        const query = { $or: [{ username }, { email: username }] };
        const options = { projection: { _id: 1, username: 1, password: 1 } };
        const hash = await db.findOne(query, options);

        if (!hash) {
          return {
            error: [
              {
                item: "username",
                message: "The username doesn't exist",
              },
            ],
          };
        }
        const match = await bcrypt.compare(password, hash.password);

        if (!match)
          return {
            error: [
              {
                item: "password",
                message: "Wrong password",
              },
            ],
          };

        req.session.userId = hash._id;

        return {
          userInfo: {
            user: hash.username,
            userId: hash._id,
            welcome: `Welcome back!`,
          },
        };
      } catch (error) {
        return {
          error: [{ item: "Database", message: error }],
        };
      }
    },
  },
};

// Middle ware

const app = express();
const passport = require("passport");
const Strategy = require("passport-google-oauth20").Strategy;
//Google Auth

passport.use(
  new Strategy(
    {
      clientID: googleClient,
      clientSecret: googleSecret,
      callbackURL: googleCallBack,
    },
    async (accessToken, refreshToken, profile, cb) => {
      const db = await connectToDB("Users", "Users");
      const userData = profile._json;
      const mailExist = await db.findOne({ email: userData.email });

      if (mailExist) {
        const goodId = mailExist._id;
        const newProfile = { ...profile, mongoID: goodId };
        return cb(null, newProfile);
      } else {
        const dateOfCreation = new Date();

        const userData = profile._json;
        const userDocument = {
          username: userData.given_name,
          email: userData.email,
          password: "googleUser",
          contra: "googleUser",
          dateOfCreation,
          dateOfUpdate: "",
        };
        const result = await db.insertOne(userDocument);

        const goodId = result.insertedId;

        const newProfile = { ...profile, mongoID: goodId };
        return cb(null, newProfile);
      }
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(
  session({
    name: "id",
    store: new RedisStore({ client: redisClient, disableTouch: true }),

    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, //1 year
      sameSite: "lax",
      secure: false, //change to true when deployed
    },
    saveUninitialized: false,
    secret: "keyboard cat",
    resave: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/Login",
  }),
  function (req, res) {
    // Successful authentication, redirect home.

    req.session.userId = req.user.mongoID;
    res.redirect("http://localhost:3000");
  }
);

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
});

server.applyMiddleware({ app, cors: corsOptions });
app.listen({ port: 8000 }, () => {
  console.log("conection on");
});
