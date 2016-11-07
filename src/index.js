import socketio from 'socket.io'
import cookieParser from 'socket.io-cookie-parser'
import authorization from './middlewares/authorization'
import messages from './middlewares/messages'

const io = socketio.listen(8888)

const middleware = [
    cookieParser(),
    authorization,
    messages
]

for(let i in middleware){
    io.use(middleware[i])
}
