import apiCall from '../utils/apiCall'
import config from '../config'

export default (socket, next)=>{
    if(socket.request.cookies.token){
        const call = new apiCall(socket.request.cookies.token, socket.request.cookies.refreshToken)
        call(config.api.methods.getUserData)
            .then(({response})=>{
                global.apiCall = call
                const room = `users/id${response.id}`
                socket.join(room)
                const {id} = socket.client.conn
                console.log(`client ${id} joined to room - ${room}`)
                next()
            })
    }
}