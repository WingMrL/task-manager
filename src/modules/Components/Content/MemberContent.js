import React from 'react';

import { Card, Checkbox, message } from 'antd';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './MemberContent.less';
import axios from 'axios';
import config from '../../../../config/config';
import moment from 'moment';
import WhoAndWhen from './WhoAndWhen';
import { setUserTasks, toggleTaskShowInUserTasks } from '../../../actions/userTaskActions';
import { setCurrentTeam } from '../../../actions/currentTeamActions';
// import '../../../assets/style.less';



class MemberContent extends React.Component {

    state = {
        user: null,
    }
    
    componentWillMount() {
        this.getUser();
    }

    handleTaskNavOnClick = (e) => {
        e.preventDefault();
    }

    getUser = () => {
        const { history, dispatch, getTasksUserId } = this.props;
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if(token === null || userId === null) {
            history.push(`/user/sign_in`);
        } else {

            const data = {
                params: {
                    token,
                    userId: getTasksUserId,
                }
            };
            axios.get(`${config.serverHost}/api/user/getUserTasks`, data)
                .then((result) => {
                    if(result.data.code == 0) {
                        // debugger;
                        dispatch(setUserTasks(result.data.user.tasks));
                        this.setState({
                            user: result.data.user,
                        });
                        // console.log('getusertasks');
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

    getTeam = () => {
        const url = `${config.serverHost}/api/team/getTeam`;
        const { history, dispatch, currentTeam } = this.props;
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if(token === null || userId === null) {
            history.push(`/user/sign_in`);
        } else {
            if(currentTeam._id) {
                const data = {
                    params: {
                        teamId: currentTeam._id,
                        token
                    }
                };
                axios.get(url, data)
                    .then((result) => {
                        if(result.data.code === 0) {
                            let { team } = result.data;
                            dispatch(setCurrentTeam(team));
                        } else if(result.data.code === -98) {
                            history.push(`/user/sign_in`);
                        } else if(result.data.code === -1) {
                            console.log(`${result.data.msg}: ${result.data.code}`)
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
    }

    getTodo = (v) => {
        const { user } = this.props;

        // debugger;
        if(v.task.executor == null) {
            return;
        }

        let who = v.task.executor.userName;
        let when = '没有截止日期';
        if(v.task.deadLine) {
            when = v.task.deadLine;
        }
        let members = v.task.project.members; // 成员 UserModal

        return (<Card key={v._id} className={`task`}>
            <Checkbox
                checked={v.task.finished}
                onChange={e => this.toggleTaskFinish(v._id)}
                >
            </Checkbox>
            <Link 
                to={`/projects/${v.task.project._id}/tasks/${v._id}`}  
                className={`link`}>
                {v.task.taskName}
            </Link>
            <WhoAndWhen 
                who={who}
                when={when}
                members={members}
                taskId={v._id}
                clickable={!v.task.finished}
                style={{
                    marginLeft: 10,
                }}
                project={v.task.project}
                whoAndWhenSettingVisible={v.show}
                handleWhoAndWhenOnClick={this.handleWhoAndWhenOnClick}
                handleSettingWhoAndWhen={this.handleSettingWhoAndWhen}
                />
        </Card>);
    }

    /**
     * @description 完成/未完成 当前任务
     * @param taskId 当前任务id
     * 
     * @memberof ProjectContent
     */
    toggleTaskFinish = (taskId) => {
        const { history, projectId } = this.props;
        if(taskId) {
            let token = localStorage.getItem('token');
            axios.post(`${config.serverHost}/api/task/toggleTaskFinish`, {
                token,
                taskId,
            })
            .then((result) => {
                let { data } = result;
                if(data.code == 0) {
                    this.getTeam();
                } else if(data.code == -98) {
                    history.push(`/user/sign_in`);
                } else if(data.code == -1) {
                    console.log(`${data.msg}: ${data.code}`);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }

    /**
     * @description  显示/不显示任务设置面板（指派人和截止时间）
     * @memberof MemberContent
     */
    handleWhoAndWhenOnClick = (id) => {
        const { dispatch } = this.props;
        // 显示/不显示任务设置面板（指派人和截止时间）
        dispatch(toggleTaskShowInUserTasks(id));
    }

    /**
     * @description 设置日期和指派人
     * @param settingWho 指派人
     * @param settingWhen 截止时间
     * @param id 任务id
     * 
     * @memberof ProjectContent
     */
    handleSettingWhoAndWhen = (settingWho, settingWhen, id, project) => {
        const { history, dispatch } = this.props;

        let executorId; //执行者id
        project.members.forEach((v) => {
            if(v.userName == settingWho) {
                executorId = v._id;
            }
        });

        let token = localStorage.getItem('token');
        axios.post(`${config.serverHost}/api/task/changeExecutorAndDeadLine`, {
                taskId: id,
                executorId,
                deadLine: settingWhen == '没有截止日期' ? undefined : settingWhen,
                token
            })
            .then((result) => {
                let { data } = result;
                if(data.code == 0) {
                    this.getUser();
                } else if (data.code == -98) {
                    history.push(`/user/sign_in`);
                } else if (data.code == -1) {
                    console.log(`${data.msg}: ${data.code}`);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    handleToggleManagerOnChange = (e) => {
        // console.log(e.target.checked);
        const { user } = this.state;
        const { currentTeam } = this.props;
        const token = localStorage.getItem('token');
        axios.post(`${config.serverHost}/api/user/changeRole`, {
                token,
                teamId: currentTeam._id,
                userId: user._id,
                isChangeToManager: e.target.checked,
            }).then((result) => {
                let { data } = result;
                if(data.code == 0) {
                    this.getTeam();
                } else if(data.code == -98) {
                    history.push(`/user/sign_in`);
                } else if(data.code == -1 || data.code == -4) {
                    console.log(`${data.msg}: ${data.code}`);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    render() {
        const { userTasks, currentTeam } = this.props;
        const { user } = this.state;

        const currentSignInUser = this.props.user; //已经登陆的当前用户
        
        let userName = '';
        let userEmail = '';
        let userHeadImgUrl = '';
        if(user) {
            userName = user.userName;
            userEmail = user.eMail;
            userHeadImgUrl = user.headImgUrl;
        }

        let isManager = false;
        let managerCheckboxShow = false;
        let managersId;
        let normalMembersId; 
        if(user && currentTeam) {
            managersId = currentTeam.managers.map(v => v._id);
            normalMembersId = currentTeam.normalMembers.map(v => v._id);
            // 当前登陆的用户是 管理员 或者 超级管理员
            if( managersId.indexOf(currentSignInUser._id) > -1 || currentSignInUser._id == currentTeam.superManager._id ) {
                managerCheckboxShow = true;
            }
            // 如果 要管理的用户 是 超级管理员 或者 当前登陆的用户是 成员（非管理员）
            if(user._id == currentTeam.superManager._id || normalMembersId.indexOf(currentSignInUser._id) > -1) {
                managerCheckboxShow = false;
            } else if (managersId.indexOf(user._id) > -1) {
                isManager = true;
            } else {
                isManager = false;
            }
        }

        let todayTasksList = []; //今天的任务
        let pastDueTasksList = []; //已逾期任务
        let willDoTasksList = []; //接下来的做任务
        let featureTasksList = []; // 将来的任务,即没有日期的任务
        let finishedTasksList = []; // 已经完成的任务
        if(userTasks.length > 0) {
            userTasks.forEach((v) => {
                if(v.task.finished) {
                    finishedTasksList.push(this.getTodo(v));
                } else {
                    if(moment().format('YYYY-MM-DD') == v.task.deadLine) {
                        todayTasksList.push(this.getTodo(v));
                    } else if (v.task.deadLine == undefined) {
                        featureTasksList.push(this.getTodo(v));
                    } else if (moment().format('YYYY-MM-DD') > v.task.deadLine) {
                        pastDueTasksList.push(this.getTodo(v));
                    } else if (moment().format('YYYY-MM-DD') < v.task.deadLine) {
                        willDoTasksList.push(this.getTodo(v));
                    }
                }
            });
        }
        // console.log(todayTasksList, willDoTasksList, featureTasksList, finishedTasksList);

        return (
            <div className={`member-content-container`}>
                <div className={`header`}>
                    <div className={`user-container`}>
                        <img 
                            className={`head-img`}
                            alt={`头像`}
                            src={`${config.serverHost}/${userHeadImgUrl}`}
                            />
                        <div className={`container`}>
                            <h2 className={`user-name`}>{userName}</h2>
                            <p className={`email`}>{userEmail}</p>
                        </div>
                    </div>
                    <Checkbox 
                        className={`manager-control`}
                        onChange={this.handleToggleManagerOnChange}
                        checked={isManager}
                        style={{
                            display: managerCheckboxShow ? 'block' : 'none',
                        }}
                        >
                        管理员
                    </Checkbox>
                </div>
                <span className={`hr hr-top`}></span>
                <div className={`nav-link-bar`}>
                    <Link 
                        to={`/`}
                        onClick={this.handleTaskNavOnClick}
                        className={`link`}
                        >
                        任务
                    </Link>
                </div>
                <span className={`hr`}></span>
                <p className={`mark`}>已逾期</p>
                {pastDueTasksList}
                <p className={`mark`}>今天</p>
                {todayTasksList}
                <p className={`mark`}>接下来</p>
                {willDoTasksList}
                <p className={`mark`}>将来</p>
                {featureTasksList}
                <p className={`mark`}>已经完成</p>
                {finishedTasksList}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { userTasks, currentTeam, user } = state;
    return {
        userTasks,
        user,
        currentTeam,
        ...ownProps,
    };
};

MemberContent = connect(mapStateToProps)(MemberContent);

export default MemberContent;