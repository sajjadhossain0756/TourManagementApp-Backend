
import { Server } from 'http';
import mongoose from 'mongoose'
import app from './app';
import { envVars } from './app/config/env';
import { seedSuperAdmin } from './app/utils/seedSuperAdmin';

let server: Server;


const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL)

    console.log("connect to database!!");

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is listening to http://localhost:${envVars.PORT}`)
    })
  } catch (error) {
    console.log(error);
  }
}

(async()=>{
  await startServer();
  await seedSuperAdmin();
})()

// sigterm error;
process.on("SIGTERM", () => {
  console.log("sigterm error detected... Server shutting down...");

  if (server) {
    server.close(() => {
      process.exit(1)
    });
  } else {
    process.exit(1);
  }

  setTimeout(() => {
    process.exit(1);
  }, 3000);
})
// unhandled rejection error;
process.on("unhandledRejection", (err) => {
  console.log("unhandled Rejection detected... Server shutting down...", err);

  if (server) {
    server.close(() => {
      process.exit(1)
    });
  } else {
    process.exit(1);
  }

  setTimeout(() => {
    process.exit(1);
  }, 3000);
})
// uncaught Exception error;
process.on("uncaughtException", (err) => {
  console.log("uncaught Exception detected... Server shutting down...", err);

  if (server) {
    server.close(() => {
      process.exit(1)
    });
  } else {
    process.exit(1);
  }

  setTimeout(() => {
    process.exit(1);
  }, 3000);
})

// Promise.reject(new Error("I forgot to catch this error"));
// throw new Error("I forgot to catch this error");