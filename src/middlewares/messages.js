import apiCall from '../utils/apiCall'
import config from '../config'

const {getConversation, postMessage} = config.api.methods

export default (socket, next)=>{
    const call = new apiCall(socket.request.cookies.token, socket.request.cookies.refreshToken)
    socket.on('send message', ({body, data})=>{
        if(!data.conversationId) return;
        call(typeof (getConversation) == 'function' ? getConversation(data.conversationId) : getConversation)
            .then(({response:{users}})=>{
                call(typeof (postMessage) == 'function' ? postMessage(data.conversationId): postMessage, 'POST', {
                    params: {
                        messageForm:{
                            text: body
                        }
                    }
                })
                    .then(({response})=>{
                        for(let i in users){
                            if(users.hasOwnProperty(i)){
                                const room = `users/id${users[i].id}`
                                socket.server.sockets.to(room).emit('new message', {body, data: {...data, response}})
                            }
                        }
                    })
            })
    })
    next()
}