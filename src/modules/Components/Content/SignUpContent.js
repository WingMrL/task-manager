import React from 'react';

import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
const FormItem = Form.Item;
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './SignUpContent.less';
import logo from '../../../assets/images/index/task-manager.png';
import axios from 'axios';
import config from '../../../../config/config';
import { signIn } from '../../../actions/hasSignInActions';
import { setCurrentTeam } from '../../../actions/currentTeamActions';

class SignUpContent extends React.Component {

    
    componentWillMount() {
        let { state } = this.props.location;
        let { dispatch, history } = this.props;
        let joinId = '';
        if(state) {
            joinId = state[0].slice(3);
            axios.get(`${config.serverHost}/api/team/getTeamByJoinId`, {
                    params: {
                        joinId
                    }
                })
                .then((result) => {
                    let { data } = result;
                    if(data.code === 0) {
                        dispatch(setCurrentTeam(data.team));
                    } else if(data.code === -4) {
                        console.log(`${data.msg}: ${data.code}`);
                        history.push(`/404`);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
    

    handleSubmit = (e) => {
        let { history, dispatch, location, currentTeam } = this.props;
        let { state } = location;
        let joinId = '';
        if(currentTeam) {
            joinId = currentTeam.joinId;
        }
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(values.teamName === undefined) {
                    values.joinId = joinId;
                }
                // console.log('Received values of form: ', values);
                axios.post(`${config.serverHost}/api/user/signup`, {
                    user: values
                }).then((result) => {
                    if(result.data.code == 0) {
                        // console.log(result.data);
                        // history.push(`/teams`);
                        localStorage.setItem('token', result.data.token);
                        localStorage.setItem('userId', result.data.user._id);
                        dispatch(signIn());
                        if(state) {
                            history.push(`/join?t=${joinId}`);
                        } else {
                            history.push(`/teams`);
                        }
                    } else if(result.data.code == 1) {
                        message.error(`该邮箱已注册!`);
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
        });
    }

    handleLinkToSignInOnClick = (e) => {
        let { history } = this.props;
        let { state } = this.props.location;
        if(state) {
            e.preventDefault();
            let search = state[0].slice(3);
            history.push(`/user/sign_in`, [search]);
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { currentTeam } = this.props;
        const { state } = this.props.location;
        let teamName = '';
        if(currentTeam) {
            teamName = currentTeam.teamName;
        }
        return (
            <div className={`signup-content-container`}>
                <Link to={`/`}><img src={logo} alt='logo' className={`img-logo`}/></Link>

                <Form onSubmit={this.handleSubmit} className="signup-form">
                    {
                        state === undefined ?
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
                        :
                        <div className={`team-info`}>
                            <h2 className={`title`}>加入「{teamName}」</h2>
                            <p className={`hint-text`}>你需要注册TM账户</p>
                        </div>
                    }
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
                        <Button type="primary" htmlType="submit" className={`signup-form-button`}>
                            注 册
                        </Button>
                        已有 TM 账户？ <Link to={`/user/sign_in`} onClick={this.handleLinkToSignInOnClick}>直接登陆</Link>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    let { currentTeam } = state;
    return {
        currentTeam,
        ...ownProps,
    };
};

SignUpContent = Form.create()(SignUpContent);
SignUpContent = connect(mapStateToProps)(SignUpContent);

export default SignUpContent;