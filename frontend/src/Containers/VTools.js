import { useState, useRef } from "react"
import styled from "styled-components"
import SignIn from "./signIn"
import { NavLink, Routes, Route, useNavigate } from "react-router-dom"
import Home from "./homePage"
import Regist from "./regist"

const Wrapper = styled.div`
    height: 100vh ;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: default;
`

const VTools = () => {

    const client = new WebSocket("ws://localhost:4000")

    const [nowUser, setNowUser] = useState(null)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [signedIn, setSignedIn] = useState(false)
    const [register, setRegister] = useState(false)
    
    const navigate = useNavigate()
    
    const sendData = async (data) => {
        await client.send(JSON.stringify(data))
    }

    const signInScene = <SignIn
        client={client}
        username={username}
        password={password}
        nowUser={nowUser}
        sendData={sendData}
        setSignedIn={setSignedIn}
        setUsername={setUsername}
        setPassword={setPassword}
        setRegister={setRegister}
        setNowUser={setNowUser}
        navigate={navigate}
    />

    const homeScene = <Home
        nowUser={nowUser}
    />
    const registScene = <Regist
        client={client}
        sendData={sendData}
        setUsername={setUsername}
        setRegister={setRegister}
        navigate={navigate}
    />

    return (
        <Wrapper>
            <Routes>
                <Route exact path="/" element={homeScene} />
                <Route path="/login" element={signInScene} />
                <Route path="/register" element={registScene} />       
            </Routes>
        </Wrapper>
    )
}

export default VTools
