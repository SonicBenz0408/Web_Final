import { useState, useRef } from "react"
import styled from "styled-components"
import SignIn from "./signIn"
import { BrowserRouter, NavLink, Switch, Route } from "react-router-dom"
import axios from "../api/api"

const Wrapper = styled.div`
    height: 100vh ;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: default;
`

function App() {

    const [nowUser, setNowUser] = useState(null)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [signedIn, setSignedIn] = useState(false)
    const [register, setRegister] = useState(false)

    const signInScene = <SignIn
        username={username}
        password={password}
        setSignedIn={setSignedIn}
        setUsername={setUsername}
        setPassword={setPassword}
        setRegister={setRegister}
        setNowUser={setNowUser}
    />

    const scene = signInScene

    return (
        <Wrapper>
            {scene}        
        </Wrapper>
    )
}

export default App
