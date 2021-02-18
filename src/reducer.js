export default (state, action) => {
    switch (action.type) {
        case 'JOINED':
            return {
                ...state,
                joined: true,
                userName: action.payload.userName,
                roomId: action.payload.roomId,
                password: action.payload.password,
            }
        case 'LEAVE':
            return {
                ...state,
                joined: false,
                userName: null,
                roomId: null,
                password: null,
            }
        case 'SET_USERS':
            return {
                ...state,
                users: action.payload,
            }
        case 'SET_MESSAGES':
            return {
                ...state,
                messages: action.payload,
            }    
        case 'NEW_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload],
            }
        case 'SET_DATA':
            return {
                ...state,
                users: action.payload.users,
                messages: action.payload.messages,
            }  
        default:
            return state;
    }
}
