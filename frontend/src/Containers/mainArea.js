import { Route, Routes } from "react-router-dom"
import styled from "styled-components"

const Wrapper = styled.div`
    box-sizing: border-box;
    padding: 20px;
    width: 100%;
    height: 100%;
    margin-top: 75px;
    margin-left: 200px ;
    overflow-y: scroll;
`

const LiveWrapper = styled.div`
    padding: 5px 10px;
`
const UpcomingWrapper = styled.div`
    padding: 5px 10px;
`
const MainArea = ({ menuKey, liveList, upcomingList, favorList, setFavorList }) => {
    
    const home = 
    <>
        <div className="main-title">直播中<span>6</span></div>
        <LiveWrapper>

        </LiveWrapper>
        <div className="main-title">即將開始<span>30</span></div>
        <UpcomingWrapper>

        </UpcomingWrapper>
    </>

    const favor = <>
    
    </>

    const channelList = <>
    
    </>

    const scene = (menuKey === "home") ? home 
        : (menuKey === "favor") ? favor 
        : channelList  
        
    return (
        <Wrapper>
            {scene}
        </Wrapper>
    )
}


export default MainArea