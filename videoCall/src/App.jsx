import { useState } from 'react'
import './App.css'
import VideoRoom from './components/VideoRoom';
import JoinRoomForm from './components/JoinRoomForm';

function App() {
  const [callInfo, setCallInfo] = useState(null);
  return (
    <div>
      {callInfo ? <VideoRoom {...callInfo} /> : <JoinRoomForm onJoin={setCallInfo} />}
    </div>
  );
}

export default App
