import React from 'react';

import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
const FormItem = Form.Item;
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './SignInContent.less';
import logo from '../../../assets/images/index/task-manager.png';
import axios from 'axios';
import config from '../../../../config/config';
import { signIn } from '../../../actions/hasSignInActions';

class SignInContent extends React.Component {

    handleSubmit = (e) => {
        let { history, dispatch } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                axios.post(`${config.serverHost}/api/user/signin`, {
                    user: values
                }).then((result) => {
                    if(result.data.code == 0) {
                        // console.log(history.push)
                        localStorage.setItem('token', result.data.token);
                        localStorage.setItem('userId', result.data.user._id);
                        dispatch(signIn());
                        history.push(`/teams`);
                    } else if(result.data.code == -2) {
                        message.error(`此邮箱尚未注册！`, 3);
                    } else if(result.data.code == -3) {
                        message.error(`邮箱或者密码不正确！`, 3);
                    }
                }).catch((err) => {
                    console.log(err);
                });
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
SignInContent = connect()(SignInContent);

export default SignInContent;