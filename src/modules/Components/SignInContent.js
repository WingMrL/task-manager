import React from 'react';

import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;
import { Link } from 'react-router-dom';
import './SignInContent.less';
import logo from '../../assets/images/index/task-manager.png';

class SignInContent extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
        if (!err) {
            console.log('Received values of form: ', values);
        }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className={`signin-content-container`}>
                <Link to={`/`}><img src={logo} alt='logo' className={`img-logo`}/></Link>

                <Form onSubmit={this.handleSubmit} className="signin-form">
                    <FormItem>
                        {getFieldDecorator('eMail', {
                            rules: [{ required: true, message: '请输入你的登陆邮箱!' }],
                        })(
                            <Input prefix={<Icon type="mail" style={{ fontSize: 13 }} />} placeholder="登陆邮箱" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入你的登陆密码!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>下次自动登陆</Checkbox>
                        )}
                        {/*<a className={`login-form-forgot`} href="">Forgot password</a>*/}
                        <Button type="primary" htmlType="submit" className={`signin-form-button`}>
                            登 陆
                        </Button>
                        没有 TM 账号？ <Link to={`/user/sign_up`}>立即注册</Link>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

SignInContent = Form.create()(SignInContent);

export default SignInContent;