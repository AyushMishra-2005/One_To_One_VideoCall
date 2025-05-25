let IS_PROD = true;

const server = IS_PROD?  "https://one-to-one-videocall.onrender.com" : "http://localhost:5000";

export default server;