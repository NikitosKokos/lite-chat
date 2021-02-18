import React from 'react';
import socket from '../socket';

const Chat = ({users, messages, userName, roomId, onAddMessage, password,onLeave}) => {
    const [messageValue, setMessageValue] = React.useState('');
    const [menuActive, setMenuActive] = React.useState(false);
    const messagesRef = React.useRef(null);

    const onSendMessage = () => {
        if(messageValue.trim()){
            socket.emit('ROOM:NEW_MESSAGE', {
                userName,
                roomId,
                text: messageValue,
            })
            onAddMessage({
                userName,
                text: messageValue,
            })
        }
        setMessageValue('');
    }

    React.useEffect(() => {
        messagesRef.current.scrollTo(0,99999);
    }, [messages]);

    return (
        <div className='chat'>
            <div className='chat-body'>
                <div className={`chat-users ${menuActive ? 'active': ''}`}>
                    <div onClick={() => setMenuActive(!menuActive)} className="burger-wrapper"><div className={`burger ${menuActive ? 'active': ''}`}><span></span></div></div>
                    <div className="chat-users-body">
                        <div className='chat-title'>Room: <span>{roomId}</span></div>
                        <div className='chat-title'>Password: <span>{password}</span></div>
                        <div className='chat-title'>Online <span>({users.length})</span>:</div>
                        <ul>
                            {users.map((name, index) => <li key={name + index}>{name}</li>)}
                        </ul>
                    </div>
                </div>
                <div className="chat-main">
                    <div className="chat-header">
                        <div className='chat-leave' onClick={onLeave}>
                            <svg width="385" height="385" viewBox="0 0 385 385" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0)">
                            <path d="M112.793 90.2344V60.1563C112.793 26.9851 139.778 0 172.949 0H324.092C357.263 0 384.248 26.9851 384.248 60.1562L384.248 324.844C384.248 358.015 357.263 385 324.092 385H172.949C139.778 385 112.793 358.015 112.793 324.844V294.766C112.793 286.459 119.525 279.727 127.832 279.727C136.139 279.727 142.871 286.459 142.871 294.766V324.844C142.871 341.428 156.365 354.922 172.949 354.922H324.092C340.676 354.922 354.17 341.428 354.17 324.844L354.17 60.1562C354.17 43.5722 340.676 30.0781 324.092 30.0781H172.949C156.365 30.0781 142.871 43.5722 142.871 60.1563V90.2344C142.871 98.5411 136.139 105.273 127.832 105.273C119.525 105.273 112.793 98.5411 112.793 90.2344ZM10.26 218.334L43.9364 252.01C49.811 257.885 59.3338 257.885 65.2055 252.01C71.0801 246.138 71.0801 236.616 65.2055 230.744L41.2517 206.787H221.826C230.133 206.787 236.865 200.055 236.865 191.748C236.865 183.441 230.133 176.709 221.826 176.709H41.2517L65.2055 152.752C71.0801 146.881 71.0801 137.358 65.2055 131.486C62.2682 128.549 58.4203 127.08 54.5724 127.08C50.7216 127.08 46.8737 128.549 43.9364 131.486L10.26 165.162C-4.4001 179.823 -4.4001 203.674 10.26 218.334V218.334Z" fill="#0B032D"/>
                            </g>
                            <defs>
                            <clipPath id="clip0">
                            <rect width="385" height="385" fill="white" transform="translate(385 385) rotate(180)"/>
                            </clipPath>
                            </defs>
                            </svg>
                        </div>
                        <div className="messages-title">Lite Chat</div>
                    </div>
                    <div className="chat-messages">
                        
                        <div ref={messagesRef} className="messages">
                            {
                                messages.map((message, index) => <div key={message.userName + index} className={`message ${(userName === message.userName) && 'message_my'}`}>
                                {/* <input disabled value={message.text} /> */}
                                <p>{message.text}</p>
                                <span>{message.userName}</span>
                            </div>)
                            }
                        </div>
                        <form 
                            action='#'
                            onSubmit={(e => e.preventDefault())}
                        >
                            <textarea 
                            className='form-control' 
                            value={messageValue}
                            onChange={e => setMessageValue(e.target.value)}
                            rows="3"></textarea>
                            <button 
                            onClick={onSendMessage}
                            className="btn btn-primary"
                            >Send</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat;
