import React from 'react';

import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
const FormItem = Form.Item;
import { Link } from 'react-router-dom';
import './SignUpContent.less';
import logo from '../../assets/images/index/task-manager.png';
import axios from 'axios';
import config from '../../../config/config';

class SignUpContent extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                axios.post(`${config.serverHost}/api/user/signup`, {
                    user: values
                }).then((result) => {
                    if(result.data.code == 0) {
                        
                    } else if(result.data.code == 1) {
                        message.error(`该邮箱已注册!`);
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
            <div className={`signup-content-container`}>
                <Link to={`/`}><img src={logo} alt='logo' className={`img-logo`}/></Link>

                <Form onSubmit={this.handleSubmit} className="signup-form">
                    <FormItem>
                        {getFieldDecorator('teamName', {
                            rules: [{ 
                                required: true, 
                                message: '请输入你的团队名称!' 
                            }],
                        })(
                            <Input prefix={<Icon type="team" style={{ fontSize: 13 }} />} placeholder="团队名称" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('userName', {
                            rules: [{ 
                                required: true, 
                                message: '请输入你的名字!' 
                            }],
                        })(
                            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="你的名字" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('eMail', {
                            rules: [{ 
                                required: true, 
                                message: '请输入你常用的邮箱地址!' 
                            }, {
                                pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                                message: '请输入正确的邮箱地址!',
                            }],
                        })(
                            <Input prefix={<Icon type="mail" style={{ fontSize: 13 }} />} placeholder="邮箱，如10001@qq.com" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ 
                                required: true, 
                                message: '请设置一个登陆密码!',
                            }, { 
                                min: 6,
                                message: '至少包含6位密码',
                            }, { 
                                max: 16,
                                message: '至多包含16位密码',
                            }, {
                                validator: (rule, value, callback) => {
                                    let errors = [];
                                    if(value.slice(-1) == ' ') {
                                        errors.push(new Error('密码不能包含空格'));
                                    }
                                    callback(errors);
                                },
                                message: '密码不能包含空格',
                            }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码，至少包含6位密码" />
                        )}
                    </FormItem>
                    <FormItem>
                        {/*{getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>Remember me</Checkbox>
                        )}*/}
                        {/*<a className={`login-form-forgot`} href="">Forgot password</a>*/}
                        <Button type="primary" htmlType="submit" className={`login-form-button`}>
                            注 册
                        </Button>
                        已有 TM 账户？ <Link to={`/user/sign_in`}>直接登陆</Link>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

SignUpContent = Form.create()(SignUpContent);

export default SignUpContent;