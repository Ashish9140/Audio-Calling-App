import { io } from 'socket.io-client'

export const socketInit = () => {
    return io();
}