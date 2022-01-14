import { useState, useRef, useEffect } from "react"
import { message } from "antd";
import styled from "styled-components"
import SignIn from "./signIn"
import { Routes, Route, useNavigate } from "react-router-dom"
import Home from "./homePage"
import Regist from "./regist"
import Cookies from "js-cookie"
import Revise from "./revise";

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

    const [nowUser, setNowUser] = useState(null)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    //const [signedIn, setSignedIn] = useState(false)
    //const [register, setRegister] = useState(false)
    const [menuKey, setMenuKey] = useState("home")

    const [userFavor, setUserFavor] = useState([])

    const [HoloIcon, setHoloIcon] = useState([])
    const [NijiIcon, setNijiIcon] = useState([])
    const [OtherIcon, setOtherIcon] = useState([])
    const [WholeIcon, setWholeIcon] = useState([])

    const [Stream, setStream] = useState([])
    const [LiveStream, setLiveStream] = useState([])
    const [UpcomingStream, setUpcomingStream] = useState([])
        
    const navigate = useNavigate()

    const sendData = async (data) => {
        await ws.current.send(JSON.stringify(data))
    }
    
    useEffect(async () => {
        
        ws.current = new WebSocket("ws://vtdd.herokuapp.com/:4001")
        //ws.current = new WebSocket("ws://localhost:4000")
        ws.current.onopen = async () => {
            console.log("connected")
            
            await sendData(["icon", {}])
            await sendData(["upstream", {}])
            
            console.log("initialization over")
        }

        ws.current.onmessage = async (byteString) => {
            const { data } = byteString
            const [task, payload] = JSON.parse(data)
            switch (task) {
                case "icon": {
                    setHoloIcon(payload[0]["allData"]["Hololive"])
                    setNijiIcon(payload[0]["allData"]["彩虹社"])
                    setOtherIcon(payload[0]["allData"]["其他"])
                    let wholeTemp = {}
                    payload[0]["allData"]["Hololive"].forEach(e => {
                        wholeTemp[Object.keys(e)[0]] = Object.values(e)[0]
                    })
                    payload[0]["allData"]["彩虹社"].forEach(e => {
                        wholeTemp[Object.keys(e)[0]] = Object.values(e)[0]
                    })
                    payload[0]["allData"]["其他"].forEach(e => {
                        wholeTemp[Object.keys(e)[0]] = Object.values(e)[0]
                    })
                    setWholeIcon(wholeTemp)

                    console.log("icon update")

                    const cookieUser = Cookies.get("user")
                    if(cookieUser){
                        await sendData(["favor", [{ username: cookieUser }]])
                        setNowUser(cookieUser)
                    }
                    break
                }
                case "upstream": {
                    setStream(payload[0]["upstream"])
                    break
                    //updateFavorStream()
                }
                case "favor": {
                    setUserFavor(payload[0]["favor"])
                    console.log("favorupdate")
                    break
                }
                case "login": {
                    const { msg, status, loginUser } = payload[0]
    
                    if(status === "not exist"){
                        message.warning(msg, 2)
                        setUsername("")
                        setPassword("")
                    }
                    else if(status === "failed"){
                        message.error(msg, 2)
                        setPassword("")
                    }
                    else{
                        message.success(msg, 2)
                        //setSignedIn(true)
                        setNowUser(loginUser)
                        Cookies.set('user', loginUser, { expires: 1 })
                        await sendData(["favor", [{ username: loginUser }]])
                        setMenuKey("home")
                        navigate("/")
                    }
                    break
                }
                case "regist": {
                    const { msg, status } = payload[0]
                    if(status === "exist"){
                        message.warning(msg)
                        setUsername("")
                        setPassword("")
                    }
                    else if(status === "error"){
                        message.error(msg)
                        setUsername("")
                        setPassword("")
                    }
                    else{
                        message.success(msg)
                        //setRegister(false)
                    }
                    break
                }
                default: break
            }
        }
        
    }, [navigate])

    useEffect(() => {
        function compare(a, b) {
            if (a[0]["timetonum"] < b[0]["timetonum"]) {
              return -1;
            }
            if (a[0]["timetonum"] < b[0]["timetonum"]) {
              return 1;
            }
            return 0;
        }

        const updateFavorStream = () => {
            const nameList = Object.keys(Stream)
            let tempLive = []
            let tempUpcoming = []
            nameList.forEach(element => {
                if(userFavor.find(e => e === element)){
                    Stream[element].live.forEach(n => {
                        n[0]["name"] = element
                    })
                    tempLive = [...tempLive, ...Stream[element].live]
    
                    Stream[element].upcoming.forEach(n => {
                        n[0]["name"] = element
                    })
                    tempUpcoming = [...tempUpcoming, ...(Stream[element].upcoming)]
                }
            })
            tempUpcoming.sort(compare)
            setLiveStream(tempLive)
            setUpcomingStream(tempUpcoming)
        }
        updateFavorStream()
    }, [userFavor, Stream])

    const signInScene = <SignIn
        username={username}
        password={password}
        nowUser={nowUser}
        sendData={sendData}
        setUserFavor={setUserFavor}
        //setSignedIn={setSignedIn}
        setUsername={setUsername}
        setPassword={setPassword}
        //setRegister={setRegister}
        setNowUser={setNowUser}
        navigate={navigate}
    />

    const homeScene = <Home
        sendData={sendData}
        menuKey={menuKey}
        setMenuKey={setMenuKey}
        nowUser={nowUser}
        setNowUser={setNowUser}
        userFavor={userFavor}
        setUserFavor={setUserFavor}
        HoloIcon={HoloIcon}
        NijiIcon={NijiIcon}
        OtherIcon={OtherIcon}
        WholeIcon={WholeIcon}
        LiveStream={LiveStream}
        UpcomingStream={UpcomingStream}
        navigate={navigate}
        //setSignedIn={setSignedIn}
    />
    const registScene = <Regist
        client={ws.current}
        sendData={sendData}
        setUsername={setUsername}
        //setRegister={setRegister}
        navigate={navigate}
    />

    const reviseScene = <Revise
        client={ws.current}
        nowUser={nowUser}
        setNowUser={setNowUser}
        sendData={sendData}
        navigate={navigate}
    />
    return (
        <Wrapper>
            <Routes>
                <Route exact path="/" element={homeScene} />
                <Route path="/home" element={homeScene} />
                <Route path="/login" element={signInScene} />
                <Route path="/register" element={registScene} />  
                <Route path="/revise" element={reviseScene} />
            </Routes>
        </Wrapper>
    )
}

export default VTools
