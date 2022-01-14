import styled from "styled-components"
import { message, Select } from "antd"
import { useState } from "react"
import { HeartFilled } from "@ant-design/icons"
const { Option } = Select


const Wrapper = styled.div`
    box-sizing: border-box;
    padding: 20px;
    width: 100%;
    height: 100% ;
    margin-top: 75px;
    overflow-y: scroll;
`

const LiveWrapper = styled.div`
    padding: 5px 10px;
`
const UpcomingWrapper = styled.div`
    padding: 5px 10px;
`
const ChannellistWrapper = styled.div`
    margin: 20px 0 0 0;
    padding: 10px 10px;
`

const StreamWrapper = styled.div`
    display: flex;
    box-sizing: border-box;
    width: 100%;
    padding: 5px;
    margin: 5px 0;
    cursor: pointer;
    transition: .2s;
    &:hover{
        background-color: rgb(60,60,60);
    }
    &:active{
        background-color: rgb(90, 90, 90);
    }
`


const ControlWrapper = styled.div`
    display: flex;
    align-items: center;
    box-sizing: border-box;
    color: rgb(255, 154, 200);
    width: 100%;
    height: 60px;
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
    width: 190px;
    height: 200px;
    background-color: #333;
    border: 2px solid #ddd;
    border-radius: 10px;
    margin: 15px;    
`




const MainArea = ({ sendData, menuKey, nowUser, userFavor, setUserFavor, favorTemp, setFavorTemp, HoloIcon, NijiIcon, OtherIcon, WholeIcon, LiveStream, UpcomingStream }) => {
    const [favorChoose, setFavorChoose] = useState("請選擇公司")
    const [channelChoose, setChannelChoose] = useState("請選擇公司")

    const handleChange = (value) => {
        setFavorChoose(value)
    }
    const channelChange = (value) => {
        setChannelChoose(value)
    }
    const changeTemp = (value) => {
        let index = favorTemp.indexOf(value)
        if(index > -1){
            setFavorTemp([...favorTemp.slice(0, index), ...favorTemp.slice(index+1, favorTemp.length)])
        }
        else{
            setFavorTemp([...favorTemp, value])
        }
    }
    const handleTempChange = (event) => {
        changeTemp(event.target.value)
    }

    const favorSave = async () => {
        if(favorTemp.length === userFavor.length){
            let arrayA = favorTemp.sort()
            let arrayB = userFavor.sort()
            let same = true
            for(let i=0 ; i < arrayA.length ; i++){
                if(arrayA[i] !== arrayB[i]){
                    same = false
                    break
                }
            }
            if(same){
                message.warning("並未修改!", 1)
                return
            }
        }
        await sendData(["subscribe", [{ username: nowUser, favor: favorTemp }]])
        setUserFavor(favorTemp)
        message.success("儲存成功!", 1)
        
    }

    const favorReset = () => {
        setFavorTemp(userFavor)
        message.success("重置完成!", 1)
    }
    const aimIcon = (favorChoose === "Hololive") ? HoloIcon
        : (favorChoose === "彩虹社") ? NijiIcon
        : (favorChoose === "其他") ? OtherIcon
        : []
    const aimIcon2 = (channelChoose === "Hololive") ? HoloIcon
    : (channelChoose === "彩虹社") ? NijiIcon
    : (channelChoose === "其他") ? OtherIcon
    : []

    const favorScene = (favorChoose !== "請選擇公司") ? 
    <>
        <div className="company-title">{favorChoose}<span>87</span></div>
        {aimIcon.map((icon) => 
            <InfoWrapper>
                <input className="invisible-input" type="checkbox" value={Object.keys(icon)[0]} id={Object.keys(icon)[0]} checked={favorTemp.find(e => e === Object.keys(icon)[0]) !== undefined} onChange={handleTempChange}/>
                <label className="info-check" htmlFor={Object.keys(icon)[0]}>
                    <div className="add">Add</div>
                    <div className="checkbox"></div>
                </label>
                <a target="_blank" rel="noreferrer" href={Object.values(icon)[0][1]}>
                    <img className="icon" src={Object.values(icon)[0][0]} alt=""/>
                </a>
                <div className="channel-name">{Object.keys(icon)[0]}</div>
            </InfoWrapper>)}
    </> : <></>

    //白癡要加的部分
    const listscene = (channelChoose === "請選擇公司") ?
    <>
        {HoloIcon.map((icon) =>
            <a href={Object.values(icon)[0][1]} target="_blank" rel="noreferrer">
                <div class="listitem">
                    <img src={Object.values(icon)[0][0]} alt=""/>
                    <div class="text">
                        <div class="channelname">{Object.keys(icon)[0]}</div>
                        <div class="company" style={{fontSize:10}}>{Object.values(icon)[0][2]}</div>
                    </div>
                    {(userFavor.indexOf(Object.keys(icon)[0]) === -1)? <></> : <HeartFilled className="has_add_favor" />}
                </div>
            </a>
        )}
        {NijiIcon.map((icon) =>
            <a href={Object.values(icon)[0][1]} target="_blank" rel="noreferrer">
                <div class="listitem">
                    <img src={Object.values(icon)[0][0]} alt=""/>
                    <div class="text">
                        <div class="channelname">{Object.keys(icon)[0]}</div>
                        <div class="company" style={{fontSize:10}}>{Object.values(icon)[0][2]}</div>
                    </div>
                    {(userFavor.indexOf(Object.keys(icon)[0]) === -1)? <></> : <HeartFilled className="has_add_favor" />}
                </div>
            </a>
        )}
        {OtherIcon.map((icon) =>
            <a href={Object.values(icon)[0][1]} target="_blank" rel="noreferrer">
                <div class="listitem">
                    <img src={Object.values(icon)[0][0]} alt=""/>
                    <div class="text">
                        <div class="channelname">{Object.keys(icon)[0]}</div>
                        <div class="company" style={{fontSize:10}}>{Object.values(icon)[0][2]}</div>
                    </div>
                    {(userFavor.indexOf(Object.keys(icon)[0]) === -1)? <></> : <HeartFilled className="has_add_favor" />}
                </div>
            </a>
        )}
    </> : (channelChoose === "已加入最愛") ? <>
        {HoloIcon.map((icon) => (userFavor.indexOf(Object.keys(icon)[0]) !== -1)?
            <a href={Object.values(icon)[0][1]} target="_blank" rel="noreferrer">
                <div class="listitem">
                    <img src={Object.values(icon)[0][0]} alt=""/>
                    <div class="text">
                        <div class="channelname">{Object.keys(icon)[0]}</div>
                        <div class="company" style={{fontSize:10}}>{Object.values(icon)[0][2]}</div>
                    </div>
                    <HeartFilled className="has_add_favor" />
                </div>
            </a> : <></>
        )}
        {NijiIcon.map((icon) => (userFavor.indexOf(Object.keys(icon)[0]) !== -1)?
            <a href={Object.values(icon)[0][1]} target="_blank" rel="noreferrer">
                <div class="listitem">
                    <img src={Object.values(icon)[0][0]} alt=""/>
                    <div class="text">
                        <div class="channelname">{Object.keys(icon)[0]}</div>
                        <div class="company" style={{fontSize:10}}>{Object.values(icon)[0][2]}</div>
                    </div>
                    <HeartFilled className="has_add_favor" />
                </div>
            </a> : <></>
        )}
        {OtherIcon.map((icon) => (userFavor.indexOf(Object.keys(icon)[0]) !== -1)?
            <a href={Object.values(icon)[0][1]} target="_blank" rel="noreferrer">
                <div class="listitem">
                    <img src={Object.values(icon)[0][0]} alt=""/>
                    <div class="text">
                        <div class="channelname">{Object.keys(icon)[0]}</div>
                        <div class="company" style={{fontSize:10}}>{Object.values(icon)[0][2]}</div>
                    </div>
                    <HeartFilled className="has_add_favor" />
                </div>
            </a> : <></>
        )}
    </> 
    : <>
        {aimIcon2.map((icon) =>
            <a href={Object.values(icon)[0][1]} target="_blank" rel="noreferrer">
                <div class="listitem">
                    <img src={Object.values(icon)[0][0]} alt=""/>
                    <div class="text">
                        <div class="channelname">{Object.keys(icon)[0]}</div>
                        <div class="company" style={{fontSize:10}}>{Object.values(icon)[0][2]}</div>
                    </div>
                    {(userFavor.indexOf(Object.keys(icon)[0]) === -1)? <></> : <HeartFilled className="has_add_favor" />}
                </div>
            </a>
        )}
    </>
    //白癡要加的部分



    const home = 
    <>
        <div className="main-title">直播中<span>{LiveStream.length}</span></div>
        <LiveWrapper>
            {LiveStream.map((stream) => 
                <a target="_blank" rel="noreferrer" href={stream[0].url}><StreamWrapper>
                    <img className="thumbnail" src={stream[0].img} alt="" />
                    <div className="text-part">
                        <div className="stream-title">{stream[0].title}</div>
                        <div className="stream-status">直播中</div>
                        <div className="channel-small">
                            <a target="_blank" rel="noreferrer" href={WholeIcon[stream[0].name][1]}><img className="channel-small-pic" src={WholeIcon[stream[0].name][0]} alt="" /></a>
                            <a target="_blank" rel="noreferrer" href={WholeIcon[stream[0].name][1]} className="channel-small-name">{stream[0].name}</a>
                        </div>
                    </div>
                </StreamWrapper></a>
            )}
        </LiveWrapper>
        <div className="main-title">即將開始<span>{UpcomingStream.length}</span></div>
        <UpcomingWrapper>
            {UpcomingStream.map((stream) => 
                <a target="_blank" rel="noreferrer" href={stream[0].url}><StreamWrapper>
                    <img className="thumbnail" src={stream[0].img} alt="" />
                    <div className="text-part">
                        <div className="stream-title">{stream[0].title}</div>
                        <div className="stream-status">即將開始</div>
                        <div className="channel-small">
                            <a target="_blank" rel="noreferrer" href={WholeIcon[stream[0].name][1]}><img className="channel-small-pic" src={WholeIcon[stream[0].name][0]} alt="" /></a>
                            <a target="_blank" rel="noreferrer" href={WholeIcon[stream[0].name][1]} className="channel-small-name">{stream[0].name}</a>
                        </div>
                    </div>
                </StreamWrapper></a>
            )}  
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

            <button className="favor-button" onClick={favorSave}>儲存</button>
            <button className="favor-button" onClick={favorReset}>重置</button>
        </ControlWrapper>
        <ChannelWrapper>
            {favorScene}
        </ChannelWrapper>
    </>

    const channelList = <>
        <ControlWrapper style={{justifyContent: 'space-between'}}>
            <div style={{fontSize:16}}>{(channelChoose==="請選擇公司") ? "所有頻道" : channelChoose}</div>
            <Select defaultValue="請選擇公司" value={channelChoose} style={{ width: 120}} onChange={channelChange}>
                <Option value="請選擇公司">請選擇公司</Option>
                <Option value="已加入最愛">已加入最愛</Option>
                <Option value="Hololive">Hololive</Option>
                <Option value="彩虹社">彩虹社</Option>
                <Option value="其他">其他</Option>
            </Select>
        </ControlWrapper>
        <ChannellistWrapper>
            {listscene}
        </ChannellistWrapper>
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