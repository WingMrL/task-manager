import React from 'react';

import { Checkbox, Modal, Input, message, Button } from 'antd';
// const CheckboxGroup = Checkbox.Group;

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './TaskContent.less';
import axios from 'axios';
import moment from 'moment';
import config from '../../../../config/config';
import WhoAndWhen from './WhoAndWhen';
import { setCurrentTask } from '../../../actions/currentTaskActions';
import { setCurrentTeam } from '../../../actions/currentTeamActions';
// import '../../../assets/style.less';




/**
 * @description 任务详情页
 * 
 * @class TaskContent
 * @extends {React.Component}
 */
class TaskContent extends React.Component {

    state = {
        whoAndWhenSettingVisible: false, // 面板的隐藏或者显示
        taskEditModalVisible: false, // 任务编辑Modal是否显示
        taskDeleteModalVisible: false, // 任务删除Modal是否显示
        modalInputTaskName: '', // 任务编辑modal的input的任务名称
        modalInputTaskDescription: '', //任务编辑modal的input的任务描述
        sendCommentEditing: false, // 是不是正在编辑评论
        commentValue: '', //评论的内容
    }
    
    componentWillMount() {
        this.getTask();
        this.getTeam(this.props.teamId);
    }

    /**
     * @description 获取当前任务
     * @memberof TaskContent
     */
    getTask = () => {
        const { taskId, history, dispatch } = this.props;
        const token = localStorage.getItem('token');
        if(taskId) {
            axios.get(`${config.serverHost}/api/task/getTask`, {
                params: {
                    token,
                    taskId,
                }
            })
            .then((result) => {
                let { data } = result;
                if(data.code == 0) {
                    dispatch(setCurrentTask(data.task));
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
    }

    getTeam = (teamId) => {
        const url = `${config.serverHost}/api/team/getTeam`;
        const { history, dispatch } = this.props;
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if(token === null || userId === null) {
            history.push(`/user/sign_in`);
        } else {
            if(teamId) {
                const data = {
                    params: {
                        teamId,
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

    /**
     * @description 指派和日期点击事件
     * @memberof TaskContent
     */
    handleWhoAndWhenOnClick = () => {
        this.setState((prevState) => {
            return {
                whoAndWhenSettingVisible: !prevState.whoAndWhenSettingVisible,
            }
        });
    }

    /**
     * @description 设置日期和指派人
     * @param settingWho 指派人
     * @param settingWhen 截止时间
     * @param id 任务id
     * @memberof ProjectContent
     */
    handleSettingWhoAndWhen = (settingWho, settingWhen, id) => {
        const { currentProject, history, dispatch, projectId } = this.props;

        let executorId; //执行者id
        currentProject.members.forEach((v) => {
            if(v.userName == settingWho) {
                executorId = v._id;
            }
        });

        if(id) {
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
                        this.getTask();
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
    }

    /**
     * @description "编辑"
     * @memberof TaskContent
     */
    handleEditTaskNameAndDesc = (e) => {
        e.preventDefault();
        const { currentTask } = this.props;
        this.setState({
            taskEditModalVisible: true,
            modalInputTaskName: currentTask.taskName,
            modalInputTaskDescription: currentTask.description,
        });
    }


    /**
     * @description "任务名称"onChange
     * @memberof TaskContent
     */
    handleModalTaskNameOnChange = (e) => {
        this.setState({
            modalInputTaskName: e.target.value,
        });
    }

    /**
     * @description "任务描述"onChange
     * @memberof TaskContent
     */
    handleModalTaskDescriptionOnChange = (e) => {
        this.setState({
            modalInputTaskDescription: e.target.value,
        });
    }

    /**
     * @description “任务编辑”模态框“确定”事件
     * @memberof TaskContent
     */
    handleTaskEditModalOnOk = (e) => {
        const { modalInputTaskName, modalInputTaskDescription } = this.state;
        const { history, taskId } = this.props;
        // console.log('-----'+modalInputTaskName);
        if(modalInputTaskName == '') {
            message.error(`任务名称不能为空！`, 3);
            return;
        }

        if(taskId) {
            const token = localStorage.getItem('token');
            axios.post(`${config.serverHost}/api/task/editTaskNameAndTaskDescription`, {
                taskName: modalInputTaskName,
                taskDescription: modalInputTaskDescription,
                taskId,
                token,
            }).then((result) => {
                let { data } = result;
                if(data.code == 0) {
                    this.getTask();
                    this.setState({
                        taskEditModalVisible: false,
                    });
                } else if(data.code == -1) {
                    console.log(`${data.msg}: ${data.code}`);
                } else if(data.code == -98) {
                    history.push(`/user/sign_in`);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
        
    }

    /**
     * @description “任务编辑”模态框“取消”事件
     * @memberof TaskContent
     */
    handleTaskEditModalOnCancel = (e) => {
        this.setState({
            taskEditModalVisible: false,
        });
    }


    /**
     * @description 点击“点击发表评论”的input
     * @memberof TaskContent
     */
    handleClickToSendCommentInputOnClick = (e) => {
        e.preventDefault();
        this.setState({
            sendCommentEditing: true,
        })
    }


    /**
     * @description 评论输入框隐藏
     * @memberof TaskContent
     */
    handleSendCommentCancel = (e) => {
        this.setState({
            sendCommentEditing: false,
        });
    }

    /**
     * @description 评论输入框onChange
     * @memberof TaskContent
     */
    handleCommentValueOnChange = (e) => {
        this.setState({
            commentValue: e.target.value,
        });
    }

    /**
     * @description “发表评论”按钮点击
     * @memberof TaskContent
     */
    handleSendCommentBtnOnClick = (e) => {
        const { commentValue } = this.state;
        const { taskId, user } = this.props;
        if(commentValue == '') {
            message.error(`评论的内容不能为空！`, 3);
            return ;
        }
        if(taskId) {
            let token = localStorage.getItem('token');
            axios.post(`${config.serverHost}/api/comment/addComment`, {
                token,
                taskId,
                commentValue,
                from: user._id,
            }).then((result) => {
                let { data } = result;
                if(data.code == 0) {
                    this.getTask();
                    this.setState({
                        sendCommentEditing: false,
                        commentValue: '',
                    });
                } else if(data.code == -98) {
                    history.push('/user/sign_in');
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
     * @description 完成任务的toggle
     * @memberof TaskContent
     */
    handleFinishCheckboxOnChange = (e) => {
        const { taskId } = this.props;
        if(taskId) {
            let token = localStorage.getItem('token');
            axios.post(`${config.serverHost}/api/task/toggleTaskFinish`, {
                token,
                taskId,
            })
            .then((result) => {
                let { data } = result;
                if(data.code == 0) {
                    this.getTask();
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
     * @description 删除任务点击事件
     * @memberof TaskContent
     */
    handleDeleteTask = (e) => {
        e.preventDefault();
        this.setState({
            taskDeleteModalVisible: true,
        });
    }

    /**
     * @description 确定删除
     * @memberof TaskContent
     */
    handleTaskDeleteOnOk = (e) => {
        const { taskId, projectId, history } = this.props;
        if(taskId) {
            const token = localStorage.getItem('token');
            axios.post(`${config.serverHost}/api/task/deleteTask`, {
                token,
                taskId,
            }).then((result) => {
                let { data } = result;
                if(data.code == 0) {
                    history.push(`/projects/${projectId}`);
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
    }

    /**
     * @description 删除取消
     * @memberof TaskContent
     */
    handleTaskDeleteOnCancel = (e) => {
        this.setState({
            taskDeleteModalVisible: false,
        });
    }

    render() {
        const { taskId, projectId, currentProject, currentTask, user } = this.props;
        const { whoAndWhenSettingVisible, 
                taskEditModalVisible, 
                taskDeleteModalVisible,
                modalInputTaskName, 
                modalInputTaskDescription,
                commentValue,
                sendCommentEditing } = this.state;

        let projectName = '';
        let members = [];
        if(currentProject) {
            projectName = currentProject.projectName;
            members = currentProject.members;
        }

        let taskName = '';
        let taskDescription = '';
        let finished = false;
        let who = '未指派';
        let when = '没有截止日期';
        let commentList = [];
        if(currentTask) {
            taskName = currentTask.taskName;
            finished = currentTask.finished;
            taskDescription = currentTask.description;
            if(currentTask.executor) {
                who = currentTask.executor.userName;
            }
            if(currentTask.deadLine) {
                when = currentTask.deadLine;
            }
            currentTask.comments.forEach((v) => {
                let time = moment(v.meta.updateAt).format("M月D日 H:m:s");
                commentList.push(
                    <div key={v._id} className={`comment-container`}>
                        <img 
                            src={`${config.serverHost}/${v.from.headImgUrl}`} 
                            alt={`评论者的头像`}
                            className={`head-img`}
                            />
                        
                        <div className={`info-container`}>
                            <span className={`userName`}>{v.from.userName}</span>
                            <span className={`date`}>{time}</span>
                            <pre className={`content`}>{v.content}</pre>
                        </div>
                    </div>
                );
            });
        }

        let userHeadImg = '';
        if(user) {
            userHeadImg = user.headImgUrl;
        }
        
        return (
            <div className={`task-content-container`}>
                <Link 
                    className={`project-name-title`}
                    to={`/projects/${projectId}`}
                    >
                    项目：{projectName}
                </Link>
                <div className={'task-container'}>
                    <Checkbox 
                        checked={finished}
                        onChange={this.handleFinishCheckboxOnChange}
                        ></Checkbox>
                    <h3 className={`task-name ${finished ? 'task-name-finished' : ''}`}>{taskName}</h3>
                    <WhoAndWhen
                        who={who}
                        when={when}
                        members={members}
                        taskId={taskId}
                        clickable={!finished}
                        style={{
                            marginLeft: '10px',
                        }}
                        whoAndWhenSettingVisible={whoAndWhenSettingVisible}
                        handleWhoAndWhenOnClick={this.handleWhoAndWhenOnClick}
                        handleSettingWhoAndWhen={this.handleSettingWhoAndWhen}
                        />
                </div>
                <div className={`add-description-container`}>
                    <Link 
                        to={`/`} 
                        onClick={this.handleEditTaskNameAndDesc}
                        style={{
                            color: finished ? '#ccc' : '#71a7ce',
                        }}
                        disabled={finished}
                        >
                        编辑
                    </Link>
                    <Link 
                        to={`/`} 
                        onClick={this.handleDeleteTask}
                        style={{
                            color: '#cc8065',
                            marginLeft: 20,
                        }}
                        >
                        删除
                    </Link>
                </div>
                <pre className={`task-description`}>{taskDescription}</pre>
                <span className={`split-bar`}></span>
                { commentList }
                <div className={`send-comment-container`}>
                    <img src={`${config.serverHost}/${userHeadImg}`} alt={`头像`} className={`head-img`}/>
                    {
                        sendCommentEditing ?
                        <div className={`comment-editer`}>
                            <Input 
                                className={`editer`}
                                type="textarea"
                                rows={4}
                                onChange={this.handleCommentValueOnChange}
                                value={commentValue}
                                />
                            <Button
                                type="primary"
                                onClick={this.handleSendCommentBtnOnClick}
                                >发表评论</Button>
                            <Button
                                className={`cancel-btn`}
                                onClick={this.handleSendCommentCancel}
                                >取消</Button>
                        </div>
                        :
                        <div className={`click-to-input-container`}>
                            <Input
                                className="click-to-input-input" 
                                placeholder="点击发表评论"
                                onClick={this.handleClickToSendCommentInputOnClick}
                                />
                        </div>
                    }
                </div>
                <Modal
                    title="任务编辑"
                    visible={taskEditModalVisible}
                    onOk={this.handleTaskEditModalOnOk}
                    onCancel={this.handleTaskEditModalOnCancel}
                    wrapClassName={`task-edit-modal`}
                    >
                    <span>任务名称</span>
                    <Input
                        value={modalInputTaskName}
                        onChange={this.handleModalTaskNameOnChange}
                        />
                    <span>任务描述</span>
                    <Input 
                        type="textarea"
                        value={modalInputTaskDescription}
                        onChange={this.handleModalTaskDescriptionOnChange}
                        rows={4}
                        />
                </Modal>
                <Modal
                    title="删除任务确定"
                    visible={taskDeleteModalVisible}
                    onOk={this.handleTaskDeleteOnOk}
                    onCancel={this.handleTaskDeleteOnCancel}
                    wrapClassName={`task-delete-modal`}
                    >
                    <p className={`text`}>任务删除同时会把评论删除且不能恢复，确定？</p>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { currentProject, currentTask, user } = state;
    return {
        user,
        currentProject,
        currentTask,
        ...ownProps,
    };
};

TaskContent = connect(mapStateToProps)(TaskContent);

export default TaskContent;