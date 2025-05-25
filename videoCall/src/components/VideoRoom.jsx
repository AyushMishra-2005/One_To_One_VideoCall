import React, { useEffect, useState } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng'
import VideoCallUI from './NewVideoPlayer';
import { useRef } from 'react';
import { useSocketContext } from '../context/socketContext';



function VideoRoom({ uid, token, roomId, appId }) {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const client = useRef(null);
  const { socket } = useSocketContext();

  const handleUserJoined = async (user, mediaType) => {
    await client.current.subscribe(user, mediaType);

    if (mediaType === 'video') {
      setUsers((previouUsers) => [...previouUsers, user]);
    }

    if (mediaType === 'audio') {
      user.audioTrack.play();
    }

  }

  const handleUserLeft = (user) => {
    setUsers((previouUsers) =>
      previouUsers.filter((u) => u.uid !== user.uid)
    );
  }


  const leaveCall = () => {
    localTracks.forEach((track) => {
      track.stop();
      track.close();
    });

    if (client.current) {
      client.current.unpublish(localTracks).finally(() => {
        client.current.leave();
      });
    }
    setUsers([]);
  };


  socket.on('call-ended', () => {
    leaveCall();
    window.location.reload();
  });

  const handleEndCall = () => {
    socket.emit("call-ended");
    localTracks.forEach(track => {
      track.stop();
      track.close();
    });

    if (client.current) {
      client.current.unpublish(localTracks).finally(() => {
        client.current.leave();
      })
    }

    window.location.reload();
  }

  useEffect(() => {

    const init = async () => {

      socket.emit("join-room", roomId);

      const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      client.current = agoraClient;

      agoraClient.on('user-published', handleUserJoined);
      agoraClient.on('user-left', handleUserLeft);

      await agoraClient.join(appId, roomId, token, uid);
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

      setLocalTracks([audioTrack, videoTrack]);
      setUsers(prev => [...prev, { uid, videoTrack, audioTrack }]);

      await agoraClient.publish([audioTrack, videoTrack]);
    }

    init();



    return () => {
      localTracks.forEach(track => {
        track.stop();
        track.close();
      });

      if (client.current) {
        client.current.off('user-published', handleUserJoined);
        client.current.off('user-left', handleUserLeft);
        client.current.unpublish(localTracks).finally(() => {
          client.current.leave();
        });
      }
    }
  }, [appId, token, roomId, uid]);


  return (
    <div>
      {
        localTracks.length > 0 && (
          <VideoCallUI
            users={users}
            localUser={{ uid }}
            onMute={(muted) => {
              if (localTracks[0]) {
                localTracks[0].setEnabled(!muted);
              }
            }}
            onVideoToggle={(off) => {
              if (localTracks[1]) {
                localTracks[1].setEnabled(!off);
              }
            }}
            onEndCall={handleEndCall}
          />
        )
      }
    </div>
  )
}

export default VideoRoom