import axios from 'axios';
import React from 'react';
import Chat from './components/Chat';
import JoinBlock from './components/JoinBlock';
import reducer from './reducer'
import socket from './socket'

function App() {
  const [state, dispatch] = React.useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
    password: null,
    users: [],
    messages: [],
  });

  const onLogin = async (obj) => {
    dispatch({
      type: 'JOINED',
      payload: obj,
    });
    socket.emit('ROOM:JOIN',obj);
    const {data} = await axios.get(`/rooms/${obj.roomId}`);
    dispatch({
      type: 'SET_DATA',
      payload: data,
    })
  }
  const onLeave = async (roomId) => {
    dispatch({
      type: 'LEAVE',
    });
    socket.emit('ROOM:LEAVE');
    const {data} = await axios.get(`/rooms/${roomId}`);
    dispatch({
      type: 'SET_DATA',
      payload: data,
    })
  }


  const setUsers = users => {
    dispatch({
      type: 'SET_USERS',
      payload: users,
    })
  }
  const addMessage = message => {
    dispatch({
        type: 'NEW_MESSAGE',
        payload: message,
      })
  }
  React.useEffect(() => {
    socket.on('ROOM:SET_USERS', setUsers)
    socket.on('ROOM:NEW_MESSAGE', addMessage)
  }, []);
 

  return (
    <div className='wrapper'>
      <div className='container'>
        {!state.joined ? <JoinBlock onLogin={onLogin} />: <Chat {...state} onAddMessage={addMessage} onLeave={onLeave} />}
      </div>
    </div>
  );
}

export default App;
