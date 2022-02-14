import React, { useContext, useState, useEffect } from 'react'
import { useWebRTC } from '../hooks/useWebRTC';
import { UserContext } from "../UserContext";
import styles from './Room.module.css';

const Room = () => {
    const { user, roomId } = useContext(UserContext);
    const { clients, provideRef, handleMute } = useWebRTC(roomId, user);
    const [mute, setMute] = useState(true);

    useEffect(() => {
        handleMute(mute, user.id);
    }, [mute])

    const handleMuteClick = (clietId) => {
        if (clietId !== user.id) {
            return;
        }
        setMute((prev) => !mute);
    }
    return (
        <div className={styles.clientsList}>
            {clients.map((client) => {
                return (
                    <div className={styles.client} key={client.id}>
                        <div className={styles.userHead}>
                            <audio
                                autoPlay
                                ref={(instance) =>
                                    provideRef(instance, client.id)
                                }
                            ></audio>
                            <img className={styles.userAvatar} src={client.avatar} alt="avatar" />
                            <button className={styles.micBtn} onClick={() => { handleMuteClick(client.id) }} >
                                {
                                    client.muted ?
                                        <img src="/images/mic-mute.png" alt="mic-mute-icon" />
                                        :
                                        <img src="/images/mic.png" alt="mic-mute-icon" />
                                }
                            </button>
                        </div>
                        <h4>{client.name}</h4>
                    </div>
                );
            })}
        </div>
    )
}

export default Room