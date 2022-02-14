const socketUserMapping = {};
const ACTIONS = require('./action');

function SocketConnection(io) {
    io.on('connection', (socket) => {
        console.log('new connection', socket.id);

        // join perticular room
        socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
            socketUserMapping[socket.id] = user;

            // new Map
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
            clients.forEach((clientId) => {
                io.to(clientId).emit(ACTIONS.ADD_PEER, {
                    peerId: socket.id,
                    createOffer: false,
                    user,
                });

                socket.emit(ACTIONS.ADD_PEER, {
                    peerId: clientId,
                    createOffer: true,
                    user: socketUserMapping[clientId],
                });
            });
            socket.join(roomId);
        });


        // Handle relay Ice
        socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
            io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
                peerId: socket.id,
                icecandidate,
            });
        });


        // Handle relay sdp ( session description )
        socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
            io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
                peerId: socket.id,
                sessionDescription,
            });
        });



        // handle mute
        socket.on(ACTIONS.MUTE, ({ roomId, userId }) => {
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
            clients.forEach((clientId) => {
                io.to(clientId).emit(ACTIONS.MUTE, userId)
            });
        })
        // handle unmute
        socket.on(ACTIONS.UNMUTE, ({ roomId, userId }) => {
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
            clients.forEach((clientId) => {
                io.to(clientId).emit(ACTIONS.UNMUTE, userId)
            });
        })


        // Leaving the room
        const leaveRoom = ({ roomId }) => {
            const { rooms } = socket;
            // console.log(rooms);

            Array.from(rooms).forEach((roomId) => {
                const clients = Array.from(
                    io.sockets.adapter.rooms.get(roomId) || []
                );

                clients.forEach((clientId) => {
                    io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
                        peerId: socket.id,
                        userId: socketUserMapping[socket.id]?.id,
                    });

                    socket.emit(ACTIONS.REMOVE_PEER, {
                        peerId: clientId,
                        userId: socketUserMapping[clientId]?.id,
                    });
                });

                socket.leave(roomId);
            });

            delete socketUserMapping[socket.id];
        };
        socket.on(ACTIONS.LEAVE, leaveRoom);
        socket.on('disconnecting', leaveRoom);
    });

}

module.exports = SocketConnection;