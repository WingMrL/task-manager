import React from 'react';

import { Upload, Button, message, Input, Modal, Form, Icon} from 'antd';
const FormItem = Form.Item;

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './MemberSettingContent.less';
import axios from 'axios';
import config from '../../../../config/config';
import defaultRequest from '../../../utils/request';
import { addUser, removeUser } from '../../../actions/userActions';
import { logOut } from '../../../actions/hasSignInActions';
import { removeCurrentTeam } from '../../../actions/currentTeamActions';
// import '../../../assets/style.less';



/**
 * @description 个人设置页面
 * 
 * @class MemberSettingContent
 * @extends {React.Component}
 */
class MemberSettingContent extends React.Component {
    
    state = {
        userName: '', // 用户名字
        modifyPasswordModalVisible: false, // 修改密码的对话框是否显示
    }

    
    componentWillMount() {
        const { user } = this.props;
        if(user) {
            this.setState({
                userName: user.userName,
            });
        }
    }
    

    /**
     * @description 退出团队
     * @memberof MemberSettingContent
     */
    handleQuitTeam = (e) => {
        e.preventDefault();
        const { user, currentTeam } = this.props;

    }

    /**
     * @description 上传前的处理
     * @memberof MemberSettingContent
     */
    handleHeadImgBeforeUpload = (file) => {
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
            message.error('请上传少于 1 MB 的图片!', 3);
        }
        // console.log(file);
        return isLt1M;
    }

    /**
     * @description 自定义上传
     * @memberof MemberSettingContent
     */
    handleCustomRequest = (obj) => {
        const { user } = this.props;
        const token = localStorage.getItem('token');
        let file = obj.file;
        obj.data = {
            filename: file.name,
            type: file.type,
            token,
            userId: user._id,
        }
        defaultRequest(obj);
    }


    /**
     * @description 上传图片的onChange事件
     * @memberof MemberSettingContent
     */
    handleUploadHeadImgOnChange = (info) => {
        if (info.file.status === 'done') {
            const { user } = this.props;
            message.success(`${info.file.name} 上传成功！`);
            this.getUser(user._id);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败！`);
        }
    }

    /**
     * @description 请求user
     * @memberof MemberSettingContent
     */
    getUser = (userId) => {
        if(userId) {
            const { dispatch } = this.props;
            const token = localStorage.getItem('token');
            axios.get(`${config.serverHost}/api/user/getUser`, {
                    params: {
                        token,
                        userId,
                    }
                })
                .then((result) => {
                    if(result.data.code === 0) {
                        dispatch(addUser(result.data.user));
                    } else if(result.data.code === -98) {
                        history.push(`/user/sign_in`);
                    } else if(result.data.code === -1) {
                        console.log('请求参数错误!');
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    /**
     * @description 用户名称input的onChange事件
     * @memberof MemberSettingContent
     */
    handleUserNameInputOnChange = (e) => {
        this.setState({
            userName: e.target.value,
        })
    }

    /**
     * @description “修改密码”Link点击事件
     * @memberof MemberSettingContent
     */
    handleModifyPasswordLinkOnClick = (e) => {
        e.preventDefault();
        this.setState({
            modifyPasswordModalVisible: true,
        });
    }

    /**
     * @description "修改密码"对话框onCancel
     * @memberof MemberSettingContent
     */
    handleModifyPasswordModalOnCancel = (e) => {
        this.setState({
            modifyPasswordModalVisible: false,
        });
    }


    /**
     * @description 提交“修改代码”
     * @memberof MemberSettingContent
     */
    handleModifyPasswordSubmit = (e) => {
        e.preventDefault();
        const { user, history, dispatch } = this.props;
        const token = localStorage.getItem('token');
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                if(values.newPassword !== values.repeatNewPassword) {
                    message.error(`新密码或者重复密码不匹配！`, 3);
                    return;
                }
                axios.post(`${config.serverHost}/api/user/changePassword`, {
                        token,
                        userId: user._id,
                        oldPassword: values.oldPassword,
                        newPassword: values.newPassword,
                    }).then((result) => {
                        let { data } = result;
                        if(data.code == 0) {
                            dispatch(logOut());
                            dispatch(removeUser());
                            dispatch(removeCurrentTeam());
                            localStorage.removeItem('token');
                            localStorage.removeItem('userId');
                            history.push(`/user/sign_in`);
                        } else if(data.code == -6) {
                            message.error(`原始密码不正确！`, 3);
                        } else if(data.code == -98) {
                            history.push(`/user/sign_in`);
                        } else if(data.code == -1 || data.code == -4) {
                            console.log(`${data.msg}: ${data.code}`);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        });
    }

    /**
     * @description 保存设置点击事件
     * @memberof MemberSettingContent
     */
    handleSaveSettingOnClick = (e) => {
        const { userName } = this.state;
        if(userName == '') {
            message.error(`用户名称不能为空！`, 3);
            return;
        }
        const token = localStorage.getItem('token');
        const { user, history } = this.props;
        axios.post(`${config.serverHost}/api/user/changeUserName`, {
                token,
                userId: user._id,
                userName,
            }).then((result) => {
                let { data } = result;
                if(data.code == 0) {
                    message.success(`保存成功!`, 3);
                    this.getUser(user._id);
                } else if(data.code == -1 || data.code == -4) {
                    console.log(`${data.msg}: ${data.code}`);
                } else if(data.code == -98) {
                    history.push(`/user/sign_in`);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }


    render() {
        const { user, currentTeam } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { userName, modifyPasswordModalVisible} = this.state;
        let headImgUrl = '';
        let userEMail = '';
        let isSuperManager = false;
        if(user && currentTeam) {
            headImgUrl = user.headImgUrl;
            userEMail = user.eMail;
            if(user._id == currentTeam.superManager._id) {
                isSuperManager = true;
            }
        }
        return (
            <div className={`member-setting-content-container`}>
                <div className={`header`}>
                    <h2 className={`title`}>个人设置</h2>
                    {
                        isSuperManager ?
                        null
                        :
                        <Link 
                            onClick={this.handleQuitTeam}
                            className={`quit-team`}
                            to={`/`}>
                            退出团队
                        </Link>
                    }
                </div>
                <div className={`head-img-container`}>
                    <img src={`${config.serverHost}/${headImgUrl}`} alt={`头像`} className={`head-img`}/>
                    <div className={`upload-container`}>
                        <Upload
                            name={`headimg`}
                            showUploadList={false}
                            action={`${config.serverHost}/api/user/headimg`}
                            accept={`.png, .jpg`}
                            beforeUpload={this.handleHeadImgBeforeUpload}
                            customRequest={this.handleCustomRequest}
                            onChange={this.handleUploadHeadImgOnChange}
                            >
                            <Button>选择新头像</Button>
                        </Upload>
                        <span className={`hint-text`}>你可以选择 png/jpg 图片作为头像</span>
                    </div>
                </div>
                <div className={`user-name`}>
                    <span className={`left`}>名字</span>
                    <Input
                        value={userName}
                        className={`right`}
                        size="large"
                        placeholder="用户名称"
                        onChange={this.handleUserNameInputOnChange}
                        ></Input>
                </div>
                <div className={`user-email`}>
                    <span className={`left`}>邮箱</span>
                    <Input
                        defaultValue={userEMail}
                        className={`right`}
                        size="large"
                        disabled={true}
                        ></Input>
                </div>
                <div className={`user-password`}>
                    <span className={`left`}>密码</span>
                    <Link
                        to={`/`}
                        className={`right`}
                        onClick={this.handleModifyPasswordLinkOnClick}
                        >
                        修改密码
                    </Link>
                </div>
                <Button 
                    type="primary"
                    className={`save-setting-btn`}
                    onClick={this.handleSaveSettingOnClick}
                    >保存设置</Button>

                <Modal
                    title={`修改密码`}
                    visible={modifyPasswordModalVisible}
                    onCancel={this.handleModifyPasswordModalOnCancel}
                    wrapClassName={`modify-password-modal`}
                    footer={null}
                    >
                    <Form onSubmit={this.handleModifyPasswordSubmit} className="modify-password-form">
                        <FormItem>
                            {getFieldDecorator('oldPassword', {
                                rules: [{ 
                                    required: true, 
                                    message: '请输入原始登陆密码!',
                                }, { 
                                    min: 6,
                                    message: '至少包含6位密码',
                                }, { 
                                    max: 16,
                                    message: '至多包含16位密码',
                                }, {
                                    validator: (rule, value, callback) => {
                                        let errors = [];
                                        if(value && value.slice(-1) == ' ') {
                                            errors.push(new Error('密码不能包含空格'));
                                        }
                                        callback(errors);
                                    },
                                    message: '密码不能包含空格',
                                }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入原始登陆密码" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('newPassword', {
                                rules: [{ 
                                    required: true, 
                                    message: '请输入一个新的登陆密码!',
                                }, { 
                                    min: 6,
                                    message: '至少包含6位密码',
                                }, { 
                                    max: 16,
                                    message: '至多包含16位密码',
                                }, {
                                    validator: (rule, value, callback) => {
                                        let errors = [];
                                        if(value && value.slice(-1) == ' ') {
                                            errors.push(new Error('密码不能包含空格'));
                                        }
                                        callback(errors);
                                    },
                                    message: '密码不能包含空格',
                                }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="新的密码，至少包含6位密码" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('repeatNewPassword', {
                                rules: [{ 
                                    required: true, 
                                    message: '请重复上面登陆密码!',
                                }, { 
                                    min: 6,
                                    message: '至少包含6位密码',
                                }, { 
                                    max: 16,
                                    message: '至多包含16位密码',
                                }, {
                                    validator: (rule, value, callback) => {
                                        let errors = [];
                                        if(value && value.slice(-1) == ' ') {
                                            errors.push(new Error('密码不能包含空格'));
                                        }
                                        callback(errors);
                                    },
                                    message: '密码不能包含空格',
                                }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="重复上面新的密码" />
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className={`signup-form-button`}>
                                修改密码    
                            </Button>
                            <Button
                                onClick={this.handleModifyPasswordModalOnCancel}
                                className={`cancel`}
                                >
                                取消
                            </Button>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { user, currentTeam } = state;
    return {
        user,
        currentTeam,
        ...ownProps,
    };
};

MemberSettingContent = Form.create()(MemberSettingContent);
MemberSettingContent = connect(mapStateToProps)(MemberSettingContent);

export default MemberSettingContent;