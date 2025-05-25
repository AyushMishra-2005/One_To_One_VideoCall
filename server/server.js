import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pkg from 'agora-access-token';
const { RtcTokenBuilder, RtcRole } = pkg;
import { io, server, app } from './socketIO/server.js';


dotenv.config();

app.use(express.json())

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

app.post("/generate-token", (req, res) => {
  const {channelName, uid} = req.body;

  if(!channelName || uid === undefined){
    res.status(400).json({error : "channelName or uid is not defined"});
  }

  const role = RtcRole.PUBLISHER;
  const expireTime = 3600;
  const currentTime = Math.floor(Date.now() / 1000);
  const privilageExpireTime = currentTime + expireTime;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilageExpireTime
  );

  res.json({token, appId : APP_ID});

});

server.listen(5000, () => {
  console.log("app is running at port 5000");
});

















