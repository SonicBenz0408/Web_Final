import styled from "styled-components"
import { Dropdown, Menu } from "antd"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { NavLink } from "react-router-dom";
const Wrapper = styled.div`
    width: 100% ;
    height: 75px ;
    background-color: rgb(0,111,185); 
    position: fixed;
    display: flex;
    align-items: center;
    z-index: 1;
`

const TopBar = ({ setMenuKey, nowUser, setNowUser, setSignedIn, navigate }) => {
    
    const logout = () => {
        setSignedIn(false)
        setNowUser(null)
        navigate("/login")
    }

    const toHome = () => {
        setMenuKey("home")
    }

    const loginMenu = (
        <NavLink to="/login"><Menu.Item>
            登入
        </Menu.Item></NavLink>
    )
    const hasLoginMenu = (
        <>
            <p>{nowUser}</p>
            <Menu.Item key="revisePw">
                <p>修改密碼</p>
            </Menu.Item>
            <Menu.Item key="logout" onClick={logout}>
                <p>登出</p>
            </Menu.Item>
        </>
    )
    const submenu = (nowUser ? 
        hasLoginMenu
        :
        loginMenu)
    
    const menu = (
        <Menu className="user-menu">
            {submenu}
        </Menu>
    )
    
    return(
        <Wrapper>
            <div className="logo" onClick={toHome}>
                <img className="logo-img" src="https://i.imgur.com/1hkHkcZ.png" alt="" />
                <div>夸黑退散</div>
            </div>
            <Dropdown overlay={menu} trigger="click" className="youraccount">
                <AccountCircleIcon className="user-icon" fontSize=""/>
            </Dropdown>
        </Wrapper>
    )

}

export default TopBar