import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import Title from "../Components/Title.js"
import { useState } from "react";

const Regist = ({client, sendData, setUsername, /*setRegister,*/ navigate}) => {
    
    const [regUsername, setRegUsername] = useState("")
    const [regPassword, setRegPassword] = useState("")
    const [checkPassword, setCheckPassword] = useState("")
   
    const onFinish = (values) => {
        console.log('Success:', values)
    }
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo)
    }

    const handleChange = (func) => (event) => {
		func(event.target.value);
	}
    const sendRegist = () => {
        sendData(["regist", [{ username:regUsername, password:regPassword }]])
    }
    const backToLogin = () => {
        setRegUsername("")
        setRegPassword("")
        setCheckPassword("")
        navigate("/login")
    }

    client.onmessage = (byteString) => {
        const { data } = byteString
        const [task, payload] = JSON.parse(data)
        switch (task) {

            case "regist": {
                const { msg, status } = payload[0]
                if(status === "exist"){
                    message.warning(msg)
                    setRegUsername("")
                    setRegPassword("")
                    setCheckPassword("")
                }
                else if(status === "error"){
                    message.error(msg)
                    setRegUsername("")
                    setRegPassword("")
                    setCheckPassword("")
                }
                else{
                    message.success(msg)
                    setUsername(regUsername)
                    setRegUsername("")
                    setRegPassword("")
                    setCheckPassword("")
                    //setRegister(false)
                    navigate("/login")
                }
                break
            }
            default: break
        }
    }
    return (
        <>
            <h1 className="login-title">???????????????!</h1>
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
                    <h1>Create your account</h1>
                </Title>
                <Form.Item
                    name="regusername"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your Username!',
                    },
                    ]}
                    noStyle={false}
                >
                    <Input prefix={<UserOutlined/>} value={regUsername} placeholder="????????????" className="form-input" onChange={handleChange(setRegUsername)}/>
                </Form.Item>
                <Form.Item
                    name="regpassword"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your Password!',
                    },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined/>}
                        value={regPassword}
                        type="password"
                        placeholder="???????????????"
                        className="form-input"
                        onChange={handleChange(setRegPassword)}
                    />
                </Form.Item>
                <Form.Item
                    name="checkpassword"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your Password!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('regpassword') === value) {
                            //if(value) setChecked(true)
                            //else setChecked(false)
                            return Promise.resolve();
                          }
                          //setChecked(false)
                          return Promise.reject(new Error('Passwords do not match!'));
                        },
                      }),
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined/>}
                        value={checkPassword}
                        type="password"
                        placeholder="???????????????"
                        className="form-input"
                        onChange={handleChange(setCheckPassword)}
                    />
                </Form.Item>
            
                <Form.Item className="login-button-container">
                    <Button type="primary" htmlType="submit" className="login-form-button" onClick={sendRegist}>
                        ??????
                    </Button>
                </Form.Item>
                <div className="signup" onClick={backToLogin}>????????????</div>
            </Form>  
        </> 
    )
}

export default Regist