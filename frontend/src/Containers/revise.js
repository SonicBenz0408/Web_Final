import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import Title from "../Components/Title.js"
import { useState } from "react";
import Cookies from "js-cookie";

const Revise = ({client, nowUser, setNowUser, sendData, /*setRegister,*/ navigate}) => {
    
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [checkNewPassword, setCheckNewPassword] = useState("")
   
    const onFinish = (values) => {
        console.log('Success:', values)
    }
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo)
    }

    const handleChange = (func) => (event) => {
		func(event.target.value);
	}
    const sendRevise = () => {
        sendData(["revise", [{ username: nowUser, oldpassword: oldPassword, newpassword:newPassword }]])
    }
    const backToLogin = () => {
        setOldPassword("")
        setNewPassword("")
        setCheckNewPassword("")
        navigate("/login")
    }

    const backToHome = () => {
        setOldPassword("")
        setNewPassword("")
        setCheckNewPassword("")
        navigate("/")
    }

    client.onmessage = (byteString) => {
        const { data } = byteString
        const [task, payload] = JSON.parse(data)
        switch (task) {

            case "revise": {
                const { msg, status } = payload[0]
                if(status === "unmatch"){
                    message.error(msg)
                    setOldPassword("")
                    setNewPassword("")
                    setCheckNewPassword("")
                }
                else{
                    message.success(msg)
                    Cookies.remove("user")
                    setNowUser(null)
                    //setRegister(false)
                    backToLogin()
                }
                break
            }
            default: break
        }
    }
    return (
        <>
            <h1 className="login-title">修改密碼!</h1>
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
                    name="oldpassword"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your old password!',
                    },
                    ]}
                    noStyle={false}
                >
                    <Input.Password
                        prefix={<LockOutlined/>}
                        value={oldPassword}
                        type="password"
                        placeholder="請輸入舊密碼"
                        className="form-input"
                        onChange={handleChange(setOldPassword)}
                    />
                </Form.Item>
                <Form.Item
                    name="newpassword"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your new password!',
                    },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined/>}
                        value={newPassword}
                        type="password"
                        placeholder="請輸入新密碼"
                        className="form-input"
                        onChange={handleChange(setNewPassword)}
                    />
                </Form.Item>
                <Form.Item
                    name="checknewpassword"
                    rules={[
                    {
                        required: true,
                        message: 'Input your new password again!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newpassword') === value) {
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
                        value={checkNewPassword}
                        type="password"
                        placeholder="請確認密碼"
                        className="form-input"
                        onChange={handleChange(setCheckNewPassword)}
                    />
                </Form.Item>
            
                <Form.Item className="login-button-container">
                    <Button type="primary" htmlType="submit" className="login-form-button" onClick={sendRevise}>
                        更換
                    </Button>
                </Form.Item>
                <div className="signup" onClick={backToHome}>返回前頁</div>
            </Form>  
        </> 
    )
}

export default Revise