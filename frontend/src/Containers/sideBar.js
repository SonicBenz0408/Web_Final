import { Menu } from "antd"
import styled from "styled-components"
import { HomeOutlined, HeartOutlined, ProfileOutlined } from "@ant-design/icons"
import { useState } from "react"

const Wrapper = styled.div`
    width: 200px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: rgb(54,54,54);
    transition: .5s;
    margin-top: 75px ;
    position: fixed ;
`

const SideBar = ({ nowUser, menuKey, setMenuKey, setFavorTemp, navigate }) => {
    
    const handleMenuClick = (event) => {
        if(event.key === "favor") toFavor()
        else toNotFavor(event.key)
    }

    const toNotFavor = (to) => {
        if (menuKey === "favor"){
            setFavorTemp([])
        }
        setMenuKey(to)
        //navigate(`/home/${to}`)
    }
    const toFavor = () => {
        setMenuKey("favor")
        //navigate("/home/favor")
    } 

    const submenu = nowUser ? 
    <>
        <Menu.Item className="side-bar-item" key="favor" icon={<HeartOutlined className="side-bar-icon" />} onClick={handleMenuClick}>
            我的最愛
        </Menu.Item>

        <Menu.Item className="side-bar-item" key="channelist" icon={<ProfileOutlined className="side-bar-icon" />} onClick={handleMenuClick}>
            頻道列表
        </Menu.Item>
    </> :
    <></>

    return (
        <Wrapper>
            <Menu
                className="side-menu"
                selectedKeys={[menuKey]}
                defaultSelectedKeys={["home"]}
                mode="inline"
                theme="dark"    
            >
                <Menu.Item className="side-bar-item" key="home" icon={<HomeOutlined className="side-bar-icon"/>} onClick={handleMenuClick}>
                    首頁
                </Menu.Item>
                
                {submenu}

            </Menu>
        </Wrapper>
        
    )
}

export default SideBar