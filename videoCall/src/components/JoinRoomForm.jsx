import React from 'react'
import { useState } from 'react'
import axios from 'axios';


import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container
} from '@mui/material';
import { useSocketContext } from '../context/socketContext';


function JoinRoomForm({ onJoin }) {

  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    const uid = Math.floor(Math.random() * 100000);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/generate-token",
        {
          channelName: roomId,
          uid
        }
      )

      const { token, appId } = data;

      if (token) {
        onJoin({ uid, token, roomId, appId });
      }

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div style={{height : "100vh" , width : "100vw", display : "flex", justifyContent : "center", alignItems : "center"}}>
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h5" component="h1" align="center" gutterBottom>
            Join Call
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Room ID"
              variant="outlined"
              fullWidth
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 1 }}
            >
              Join Call
            </Button>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}

export default JoinRoomForm