import { Route, Routes } from "react-router-dom"
import styled from "styled-components"
import { Dropdown, Menu, Select } from "antd"
import { useState } from "react"
import Checkbox from "antd/lib/checkbox/Checkbox"
const { Option } = Select

const Wrapper = styled.div`
    box-sizing: border-box;
    padding: 20px;
    width: 100%;
    height: 100% ;
    padding-top: 90px;
    margin-left: 200px ;
    overflow-y: scroll;
`

const LiveWrapper = styled.div`
    padding: 5px 10px;
`
const UpcomingWrapper = styled.div`
    padding: 5px 10px;
`

const ControlWrapper = styled.div`
    display: flex;
    box-sizing: border-box;
    color: rgb(255, 154, 200);
    width: 100%;
    background-color: rgb(30, 30, 30);
    border: 1px solid #fff;
    padding: 10px 25px;
    border-radius: 5px;
`

const ChannelWrapper = styled.div`
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
`

const InfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 150px;
    height: 200px;
    border: 3px solid #fff;
    border-radius: 10px;
    margin: 15px;    
`


const MainArea = ({ menuKey, userFavor, setUserFavor, favorTemp, setFavorTemp, HoloIcon, NijiIcon, OtherIcon, liveList, upcomingList }) => {
    const [favorChoose, setFavorChoose] = useState("請選擇公司")

    const handleChange = (value) => {
        setFavorChoose(value)
    }
    const handleTempChange = (value) => {
        setFavorTemp([...favorTemp, value])
    }

    const aimIcon = (favorChoose === "Hololive") ? HoloIcon
        : (favorChoose === "彩虹社") ? NijiIcon
        : (favorChoose === "其他") ? OtherIcon
        : []
        
    const favorScene = (favorChoose !== "請選擇公司") ? 
    <>
        <div className="company-title">{favorChoose}<span>87</span></div>
        {console.log(aimIcon)}
        {aimIcon.map((icon) => 
            <InfoWrapper>
                <input className="invisible-input" type="checkbox" value={Object.keys(icon)[0]} checked={favorTemp.find(element => element === Object.keys(icon)[0])} id={Object.keys(icon)[0]} />
                <label className="info-check" for={Object.keys(icon)[0]}>
                    <div class="add">Add</div>
                    <div class="checkbox"></div>
                </label>
                <a target="_blank" href={Object.values(icon)[0][1]}>
                    <img className="icon" src={Object.values(icon)[0][0]}/>
                </a>
                <div className="channel-name">{Object.keys(icon)[0]}</div>
            </InfoWrapper>)}
    </> : <></>
/*
<div className="info-control">
    <div className="add">Add</div>
    <Checkbox
        className="info-checkbox"
        value={Object.keys(icon)[0]}
        defaultChecked={userFavor.find(element => element === Object.keys(icon)[0])}
        onChange={handleTempChange}
    >
    </Checkbox>
</div>
*/
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
        <ControlWrapper>
            <Select defaultValue="請選擇公司" value={favorChoose} style={{ width: 120 }} onChange={handleChange}>
                <Option value="請選擇公司">請選擇公司</Option>
                <Option value="Hololive">Hololive</Option>
                <Option value="彩虹社">彩虹社</Option>
                <Option value="其他">其他</Option>
            </Select>

            <button className="favor-button">儲存</button>
            <button className="favor-button">重置</button>
        </ControlWrapper>
        <ChannelWrapper>
            {favorScene}
        </ChannelWrapper>
    </>

    const channelList = <>
        <button>hihi</button>
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