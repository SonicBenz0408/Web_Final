import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import Title from "../Components/Title.js"
import axios from "../api/api";

const SignIn = ({username, password, setSignedIn, setUsername, setPassword, setRegister, setNowUser}) => {
    
    const onFinish = (values) => {
        console.log('Success:', values)
    }
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo)
    }

    const handleChange = (func) => (event) => {
		func(event.target.value);
	}

    const logIn = async () => {
        const {
        data: { msg, status }, 
        } = await axios.post('/api/login', { 
            username, 
            password,
        })
        
        if(status === "not exist"){
            window.alert(msg)
            setUsername("")
            setPassword("")
        }
        else if(status === "failed"){
            window.alert(msg)
            setPassword("")
        }
        else{
            setSignedIn(true)
            setNowUser(username)
        }
    }

    const regist = async () => {
        console.log(username)
        console.log(password)
        const {
        data: { msg, status }, 
        } = await axios.post('/api/register', { 
            username, 
            password,
        })
        
        if(status === "exist"){
            window.alert(msg)
            setUsername("")
            setPassword("")
        }
        else if(status === "error"){
            window.alert(msg)
            setUsername("")
            setPassword("")
        }
        else{
            setRegister(false)
        }
    }

    return (
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
                >
                    <Input prefix={<UserOutlined />} value={username} placeholder="帳號" className="form-input" onChange={handleChange(setUsername)}/>
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
                    <Input
                        prefix={<LockOutlined />}
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
                    <Button type="primary" htmlType="submit" className="login-form-button" onClick={logIn}>
                        登入
                    </Button>
                    <Button className="or">
                        Or
                    </Button>
                    <Button type="primary" className="login-form-button" onClick={regist}>
                        註冊
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default SignIn