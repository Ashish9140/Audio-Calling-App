import React, { useState } from 'react'
import { UserContext } from "./UserContext";
import TextInput from "./components/TextInput";
import Room from "./pages/Room";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

function App() {
    const [user, setUser] = useState({
        id: '',
        name: '',
        avatar: ''
    });
    const [roomId, setRoomId] = useState('');

    return (
        <UserContext.Provider value={{ user, setUser, roomId, setRoomId }}>
            <Router>
                <Switch>
                    <Route exact path="/" component={TextInput} />
                    {roomId && <Route exact path="/call" component={Room} />}
                </Switch>
            </Router>
        </UserContext.Provider>
    );
}

export default App;