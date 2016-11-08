import config from '../config'

const {getConversation, postMessage} = config.api.methods

export default (socket, next)=>{
    socket.on('send message', ({body, data})=>{
        if(!data.conversationId) return;
        apiCall(typeof (getConversation) == 'function' ? getConversation(data.conversationId) : getConversation)
            .then(({response:{conversations:{users}}})=>{
                apiCall(typeof (postMessage) == 'function' ? postMessage(data.conversationId): postMessage, 'POST', {
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