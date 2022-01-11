import { useState, useRef } from "react"
import styled from "styled-components"
import { BrowserRouter, NavLink, Switch, Route } from "react-router-dom"
import TopBar from "./topBar"
import SideBar from "./sideBar"
import MainArea from "./mainArea"

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
`
const DownWrapper = styled.div`
    width: 100%;
    height: 100%;
    background-color: rgb(18, 18, 18);
    display: flex;
}
`
const Home = ({ menuKey, setMenuKey, nowUser, setNowUser, userFavor, setUserFavor, HoloIcon, NijiIcon, OtherIcon, LiveStream, UpcomingStream, setSignedIn, navigate }) => {

    const [favorTemp, setFavorTemp] = useState([])
        
    const Main = !nowUser ?
        <div className="not-login">
            <h1>Please login first!</h1> 
        </div>
        :
        <MainArea 
            menuKey={menuKey}
            userFavor={userFavor}
            setUserFavor={setUserFavor}
            favorTemp={favorTemp}
            setFavorTemp={setFavorTemp}
            HoloIcon={HoloIcon}
            NijiIcon={NijiIcon}
            OtherIcon={OtherIcon}
            LiveStream={LiveStream}
            UpcomingStream={UpcomingStream}
        />
    
    return (
        <Wrapper>
            <TopBar setMenuKey={setMenuKey} nowUser={nowUser} setNowUser={setNowUser} setSignedIn={setSignedIn} navigate={navigate} />
            <DownWrapper>
                <SideBar nowUser={nowUser} menuKey={menuKey} setMenuKey={setMenuKey} setFavorTemp={setFavorTemp} navigate={navigate}/>
                {Main}
            </DownWrapper>
        </Wrapper>
    )
}

export default Home