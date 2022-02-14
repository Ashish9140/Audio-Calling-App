import React, { useContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { UserContext } from "../UserContext";
import { v4 as uuidv4 } from 'uuid';
import styles from './TextInput.module.css';
import axios from 'axios'


const TextInput = () => {
    const { user, setUser, roomId, setRoomId } = useContext(UserContext);

    useEffect(() => {
        setRoomId('');
    }, [])

    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const history = useHistory();


    const joinRoom = async () => {
        if (name !== "" && roomId !== "" && image) {
            const res = await axios({
                method: "post",
                url: "/api/upload/file",
                data: JSON.stringify({ avatar: image }),
                headers: { "Content-Type": "application/json" },
            });
            const value = {
                id: uuidv4(),
                name: name,
                avatar: `/${res.data.url}`
            }
            setUser(value);
            history.push('/call');
        } else {
            alert("Put All The Fields");
        }
    };

    function capturImage(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            setImage(reader.result);
        }
    }

    return (
        <div className="joinChatContainer">
            <div>
                <h3>Join A Call</h3>
                <div className={styles.avtarWrap}>
                    <img className={styles.avtarImg} src={image ? image : '/images/monkey.png'} alt="avatar" />
                </div>
                <div>
                    <input onChange={capturImage} type="file" id="avtarInput" className={styles.avtarInput} />
                    <label htmlFor="avtarInput" className={styles.avtarLabel}>choose a different photo</label>
                </div>
                <input
                    type="text"
                    placeholder="Username...."
                    value={name}
                    onChange={(event) => {
                        setName(event.target.value);
                    }}
                />
                <input
                    type="text"
                    placeholder="Room ID...."
                    value={roomId}
                    onChange={(event) => {
                        setRoomId(event.target.value);
                    }}
                />
                <div>
                    <button onClick={joinRoom}>Join A Room</button>
                </div>
            </div>
        </div>
    )
}

export default TextInput;