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
    const [menuKey, setMenuKey] = useState("home")
    
    const [userFavor, setUserFavor] = useState([])

    const [HoloIcon, setHoloIcon] = useState([
        {"湊あくあ": ["https://yt3.ggpht.com/ytc/AKedOLTbU5ET3bgn0Iuz1jUBNjgSe9EW8kLxIhDUrtJlPw=s88-c-k-c0x00ffffff-no-rj", "https://www.youtube.com/channel/UC1opHUrw8rvnsadT-iGp7Cg"]},
        {"白上フブキ": ["https://yt3.ggpht.com/ytc/AKedOLQmM8F8S-7GTcF5Lw7fBALF8FQC9yNKTb_nFHev2w=s88-c-k-c0x00ffffff-no-rj", "https://www.youtube.com/channel/UCdn5BQ06XqgXoAxIhbqw5Rg"]}
    ])
    const [NijiIcon, setNijiIcon] = useState([{"月ノ美兎": ["https://yt3.ggpht.com/ytc/AKedOLSGyQadwaaYuZy1zy33pdrj0yQLP_WVQziEbUwOJg=s88-c-k-c0x00ffffff-no-rj", "https://www.youtube.com/channel/UCD-miitqNY3nyukJ4Fnf4_A"]}])
    const [OtherIcon, setOtherIcon] = useState([{"kson ONAIR": ["https://yt3.ggpht.com/dJpEqyfOP0apT4ra7q_X1PBkRDryWkpqzGxOpcrVFIc9vumapjqgOPDJwyexmjDIupQd5BBllsw=s88-c-k-c0x00ffffff-no-rj", "https://www.youtube.com/channel/UC9ruVYPv7yJmV0Rh0NKA-Lw"]}])

    const [HoloStream, setHoloStream] = useState([])
    const [NijiStream, setNijiStream] = useState([])
    const [OtherStream, setOtherStream] = useState([])

    const navigate = useNavigate()
    
    const sendData = async (data) => {
        await client.send(JSON.stringify(data))
    }
    
    client.onmessage = (byteString) => {
        const { data } = byteString
        const [task, payload] = JSON.parse(data)

        switch (task) {
            case "icon": {
                setHoloIcon([])
                setNijiIcon([])
                setOtherIcon([])
            }
            case "upstream": {
                setHoloStream([])
                setNijiStream([])
                setOtherStream([])
            }
            case "favor": {
                setUserFavor(payload)
            }

            default: break
        }
    }

    const signInScene = <SignIn
        client={client}
        username={username}
        password={password}
        nowUser={nowUser}
        menuKey={menuKey}
        setMenuKey={setMenuKey}
        sendData={sendData}
        setUserFavor={setUserFavor}
        setSignedIn={setSignedIn}
        setUsername={setUsername}
        setPassword={setPassword}
        setRegister={setRegister}
        setNowUser={setNowUser}
        navigate={navigate}
    />

    const homeScene = <Home
        menuKey={menuKey}
        setMenuKey={setMenuKey}
        nowUser={nowUser}
        setNowUser={setNowUser}
        userFavor={userFavor}
        setUserFavor={setUserFavor}
        HoloIcon={HoloIcon}
        NijiIcon={NijiIcon}
        OtherIcon={OtherIcon}
        navigate={navigate}
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
                <Route path="/home" element={homeScene} />
                <Route path="/login" element={signInScene} />
                <Route path="/register" element={registScene} />       
            </Routes>
        </Wrapper>
    )
}

export default VTools
