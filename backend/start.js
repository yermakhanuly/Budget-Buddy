require('dotenv').config();
const app = require('./src/index');

const port = process.env.PORT || 5005;

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});


process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
}); 