import apiCall from '../utils/apiCall'
import config from '../config'

export default (socket, next)=>{
    if(socket.request.cookies.token){
        const apiCall = new apiCall(socket.request.cookies.token, socket.request.cookies.refreshToken)
        apiCall(config.api.methods.getUserData)
            .then(({response})=>{
                const room = `users/id${response.id}`
                socket.join(room)
                const {id} = socket.client.conn
                console.log(`client ${id} joined to room - ${room}`)
                next()
            })
            .catch(error=>console.error(`client ${socket.id}`, error))
    }
}