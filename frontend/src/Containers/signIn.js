import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import Title from "../Components/Title.js"
import { useState } from "react";


const SignIn = ({ username, password, nowUser, sendData,/* setSignedIn,*/ setUsername, setPassword,/* setRegister,*/ setNowUser, navigate}) => {
    
    const [keep, setKeep] = useState(false)
    const [keepUsername, setKeepUsername] = useState("")

    const onFinish = (values) => {
        console.log('Success:', values)
    }
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo)
    }

    const handleChange = (func) => (event) => {
		func(event.target.value);
	}

    const handleKeep = (func) => (event) => {
        func(event.target.checked)
    }
    const sendLogin = async () => {
        if(username && password){
            await sendData(["login", [{ username, password }]]);
            if(keep) setKeepUsername(username)
        }
    }

    const logout = () => {
        //setSignedIn(false)
        setNowUser(null)
        navigate("/")
    }

    const gotoRegist = () => {
        //setRegister(true)
        navigate("/register")
    }
    const backToHome = () => {
        setUsername("")
        setPassword("")
        navigate("/")
    }
    return (
        !nowUser ?
        <>
            <h1 className="login-title">歡迎各位VT豚</h1>
            <Form
                name="login"
                className="login-form"
                layout="vertical"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Title>
                    <h1>Log in to your account</h1>
                </Title>
                <Form.Item
                    name="username"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your Username!',
                    },
                    ]}
                    noStyle={false}
                >
                    <Input prefix={<UserOutlined/>} defaultValue={keepUsername} value={username} placeholder="帳號" className="form-input" onChange={handleChange(setUsername)}/>
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your Password!',
                    },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined/>}
                        value={password}
                        type="password"
                        placeholder="密碼"
                        className="form-input"
                        onChange={handleChange(setPassword)}
                    />
                </Form.Item>
            
                <Form.Item className="login-button-container">
                    <Button type="primary" htmlType="submit" className="login-form-button" onClick={sendLogin}>
                        登入
                    </Button>
                    <div className="regis-word">
                        還沒有帳號?
                        <span onClick={gotoRegist}>註冊一個</span>
                    </div>
                    
                </Form.Item>
            </Form>  
        </> 
        :
        <>
            <h1>你要登出嗎？</h1>
            <div className="log-out-or-not-container">
                <Button type="primary" className="log-out-or-not" onClick={logout}>是</Button>        
                <Button type="primary" className="log-out-or-not" onClick={backToHome}>否</Button>  
            </div>      
        </>
    )
}

export default SignIn