import { Form, Input, Button, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import Title from "../Components/Title.js"


const SignIn = ({client, username, password, nowUser, sendData, setSignedIn, setUsername, setPassword, setRegister, setNowUser, navigate}) => {
    
    const onFinish = (values) => {
        console.log('Success:', values)
    }
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo)
    }

    const handleChange = (func) => (event) => {
		func(event.target.value);
	}

    client.onmessage = (byteString) => {
        const { data } = byteString
        console.log(data)
        const [task, payload] = JSON.parse(data)
        console.log(task)
        console.log(payload)
        switch (task) {
            case "login": {
                const { msg, status } = payload[0]
                console.log(msg)
                console.log(status)

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
                    setSignedIn(true)
                    setNowUser(username)
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
                    setRegister(false)
                }
                break
            }
            default: break
        }
    }

    const sendLogin = async () => {
        if(username && password) await sendData(["login", [{ username, password }]]);
    }

    
    const logout = () => {
        setSignedIn(false)
        setNowUser(null)
        navigate("/")
    }

    const gotoRegist = () => {
        setRegister(true)
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
                    <Input prefix={<UserOutlined/>} value={username} placeholder="帳號" className="form-input" onChange={handleChange(setUsername)}/>
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
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>記住我的帳號</Checkbox>
                    </Form.Item>
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