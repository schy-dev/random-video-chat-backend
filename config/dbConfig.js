
module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "yourpassword",
  DB: "video_chat",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
