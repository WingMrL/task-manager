import React from 'react';

import { Input, Button, message, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './JoinContent.less';
import axios from 'axios';
import config from '../../../../config/config';
import { addUser } from '../../../actions/userActions';
import { setCurrentTeam } from '../../../actions/currentTeamActions';
// import '../../../assets/style.less';



class JoinContent extends React.Component {

    state = {
        applyReason: '',
        userName: '',
        alreadyJoinIn: false
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.user && nextProps.user.userName !== this.state.userName ) {
            this.setState({
                applyReason: `我是 ${nextProps.user.userName}`,
                userName: nextProps.user.userName,
            });
        }
    }
    
    
    componentWillMount() {
        const { user, history, dispatch } = this.props;
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if(token === null || userId === null) {
            history.push(`/user/sign_up`, [history.location.search]);
        } else {
            const data = {
                params: {
                    token,
                    userId
                }
            };
            axios.get(`${config.serverHost}/api/user/getUser`, data)
                .then((result) => {
                    if(result.data.code === 0) {
                        dispatch(addUser(result.data.user));
                    } else if(result.data.code === -98) {
                        history.push(`/user/sign_up`, [history.location.search]);
                    } else if(result.data.code === -1) {
                        console.log('请求参数错误!');
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            let joinId = history.location.search.slice(3);
            axios.get(`${config.serverHost}/api/team/getTeamByJoinId`, {
                    params: {
                        joinId,
                        userId
                    }
                })
                .then((result) => {
                    let { data } = result;
                    if(data.code === 0) {
                        dispatch(setCurrentTeam(data.team));
                    } else if(data.code === -4) {
                        console.log(`${data.msg}: ${data.code}`);
                        history.push(`/404`);
                    } else if(data.code === -5) {
                        this.setState({
                            alreadyJoinIn: true
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        if(user) {
            this.setState({
                applyReason: `我是 ${user.userName}`,
                userName: user.userName,
            });
        }
    }

    handleApplyReaseOnChange = (e) => {
        this.setState({
            applyReason: e.target.value,
        });
    }

    handleApplyBtnOnClick = (e) => {
        let { applyReason } = this.state;
        const { user, currentTeam, history } = this.props;
        if(applyReason == '') {
            message.error('请填写申请原因！', 3);
            return;
        }
        let teamId = ''
        let userId = '';
        if(user) {
            userId = user._id;
        }
        if(currentTeam) {
            teamId = currentTeam._id;
        }
        let token = localStorage.getItem('token');
        let data = {
            token,
            applyReason,
            teamId,
            userId,
        };
        axios.post(`${config.serverHost}/api/apply/applyJoinIn`, data)
            .then((result) => {
                let { data } = result;
                if(data.code === 0) {
                    history.push(`/teams`);
                } else if(data.code === -98) {
                    history.push(`/user/sign_in`);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        const { currentTeam } = this.props;
        const { applyReason, alreadyJoinIn } = this.state;
        let teamName = '';
        if(currentTeam) {
            teamName = currentTeam.teamName;
        }
        return (
                alreadyJoinIn ?
                <div className={`join-content-container`}>
                    <Icon type="smile-o" className={`large-icon`}/>
                    <h2 className={`joined-team-title`}>您已加入「{teamName}」</h2>
                    <Link to={`/teams`} className={`link-to-teams`}>进入「创建/管理团队」</Link>
                </div>
            :
                <div className={`join-content-container`}>
                    <h2 className={`join-team-title`}>加入「{teamName}」</h2>
                    <p className={`hint-text`}>你需要发送认证申请，等管理员通过</p>
                    <Input
                        type="textarea"
                        rows={4}
                        className={`reason`}
                        value={applyReason}
                        onChange={this.handleApplyReaseOnChange}
                        />
                    <Button
                        type="primary"
                        size="large"
                        className={`apply-join-btn`}
                        onClick={this.handleApplyBtnOnClick}
                        >申请加入</Button>
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

JoinContent = connect(mapStateToProps)(JoinContent);

export default JoinContent;