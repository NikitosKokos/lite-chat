import axios from 'axios';
import React, { useState } from 'react';

function JoinBlock({onLogin}) {
    const [roomId, setRoomId] = React.useState('');
    const [userName, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [isLoading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');


    const onEnter = async () => {
        if(!roomId || !userName || !password){
            setError('INPUT_FILL');
        }else{
            setError('');
            setLoading(true);
            const {data} = await axios.get(`/rooms/${roomId}/password`);
            if(data.password === null){
                await axios.post('/rooms', {
                    roomId
                });
                await axios.post(`/rooms/${roomId}/password`,{
                    password,
                });
                onLogin({
                    roomId,
                    userName,
                    password
                });
            }else{
                if(data.password === password){
                    await axios.post('/rooms', {
                        roomId
                    });
                    await axios.post(`/rooms/${roomId}/password`,{
                        password,
                    });
                    onLogin({
                        roomId,
                        userName,
                        password
                    });                    
                }else{
                    setError('PASS');
                }    
            }
            setLoading(false);    
        }
    }
    
    let errorMess = '';
    switch (error) {
        case 'INPUT_FILL':
            errorMess = 'Input must be filled';
            break;
        case 'PASS':
            errorMess = 'Wrong password or room id';
            break;
        default:
            errorMess = '';
            break;
    }

    return (
        <div className='join-wrapper'>
                <div className="join-block">
                    <input 
                        type="text" 
                        placeholder='Room ID' 
                        value={roomId}
                        disabled={isLoading}
                        onChange={e => setRoomId(e.target.value)}/>
                        <input 
                        type="password" 
                        placeholder='Room password' 
                        value={password}
                        disabled={isLoading}
                        onChange={e => setPassword(e.target.value)}/>
                    <input 
                        type="text" 
                        placeholder='Your name' 
                        value={userName} 
                        disabled={isLoading}
                        onChange={e => setUserName(e.target.value)}/>
                    <div className="errors">
                        {errorMess}
                    </div>
                    <button disabled={isLoading} onClick={onEnter} className="btn btn-success">
                        {isLoading ? 'ENTERING...': 'ENTER'}
                    </button>
                </div>
        </div>
    )
}

export default JoinBlock
