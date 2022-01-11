import { useState, useRef, useEffect } from "react"
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

    const ws = useRef(null) 

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:4000")
        ws.current.onopen = async () => {
            console.log("connected")
            await sendData(["icon", {}])
            console.log("initialization over")
        }

        ws.current.onmessage = (byteString) => {
            const { data } = byteString
            const [task, payload] = JSON.parse(data)
            console.log(payload)
            switch (task) {
                case "icon": {
                    setHoloIcon(payload[0]["Hololive"])
                    setNijiIcon(payload[0]["彩虹社"])
                    setOtherIcon(payload[0]["其他"])
                    console.log("icon update")
                }
                case "upstream": {
                    setStream(payload)
                    updateFavorStream()
                }
                case "favor": {
                    setUserFavor(payload)
                    //sendData(["upstream", {}])
                }
    
                default: break
            }
        }
    }, [])

    const [nowUser, setNowUser] = useState(null)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [signedIn, setSignedIn] = useState(false)
    const [register, setRegister] = useState(false)
    const [menuKey, setMenuKey] = useState("home")
    const [init, setInit] = useState(false)

    const [userFavor, setUserFavor] = useState([])

    const [HoloIcon, setHoloIcon] = useState([
        {"湊あくあ": ["https://yt3.ggpht.com/ytc/AKedOLTbU5ET3bgn0Iuz1jUBNjgSe9EW8kLxIhDUrtJlPw=s88-c-k-c0x00ffffff-no-rj", "https://www.youtube.com/channel/UC1opHUrw8rvnsadT-iGp7Cg"]},
        {"白上フブキ": ["https://yt3.ggpht.com/ytc/AKedOLQmM8F8S-7GTcF5Lw7fBALF8FQC9yNKTb_nFHev2w=s88-c-k-c0x00ffffff-no-rj", "https://www.youtube.com/channel/UCdn5BQ06XqgXoAxIhbqw5Rg"]}
    ])
    const [NijiIcon, setNijiIcon] = useState([{"月ノ美兎": ["https://yt3.ggpht.com/ytc/AKedOLSGyQadwaaYuZy1zy33pdrj0yQLP_WVQziEbUwOJg=s88-c-k-c0x00ffffff-no-rj", "https://www.youtube.com/channel/UCD-miitqNY3nyukJ4Fnf4_A"]}])
    const [OtherIcon, setOtherIcon] = useState([{"kson ONAIR": ["https://yt3.ggpht.com/dJpEqyfOP0apT4ra7q_X1PBkRDryWkpqzGxOpcrVFIc9vumapjqgOPDJwyexmjDIupQd5BBllsw=s88-c-k-c0x00ffffff-no-rj", "https://www.youtube.com/channel/UC9ruVYPv7yJmV0Rh0NKA-Lw"]}])

    const [Stream, setStream] = useState([])
    const [LiveStream, setLiveStream] = useState([])
    const [UpcomingStream, setUpcomingStream] = useState([])


    

    const navigate = useNavigate()
    
    const sendData = async (data) => {
        console.log(data)
        await ws.current.send(JSON.stringify(data))
    }
    
    const updateFavorStream = () => {
        const nameList = Object.keys(Stream)
        const tempLive = []
        const tempUpcoming = []
        nameList.forEach(element => {
            if(userFavor.find(e => e === element)){
                Stream[element].live.forEach(n => {
                    n["name"] = element
                })
                tempLive = [...tempLive, Stream[element].live]
                Stream[element].upcoming.forEach(n => {
                    n["name"] = element
                })
                tempUpcoming = [...tempUpcoming, Stream[element].upcoming]
            }
        })
        
        setLiveStream(tempLive)
        setUpcomingStream(tempUpcoming)
    }

    const signInScene = <SignIn
        client={ws.current}
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
        LiveStream={LiveStream}
        UpcomingStream={UpcomingStream}
        navigate={navigate}
        setSignedIn={setSignedIn}
    />
    const registScene = <Regist
        client={ws.current}
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
