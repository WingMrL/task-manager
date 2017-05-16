import React from 'react';

import { Icon, Card, Input, Button, message, Checkbox  } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './ProjectContent.less';
import axios from 'axios';
import WhoAndWhen from './WhoAndWhen';
import config from '../../../../config/config';
import { setCurrentProject } from '../../../actions/currentProjectActions';
import { setCurrentTasks, toggleTaskShowInCurrentTasks } from '../../../actions/currentTasksActions';
// import '../../../assets/style.less';



/**
 * @description 项目列表的内容
 * 
 * @class ProjectContent
 * @extends {React.Component}
 */
class ProjectContent extends React.Component {

    state = {
        newTaskName: '',
        addingNewTask: false,
        whoAndWhenSettingVisible: false,
        when: '没有截止日期',
        who: '未指派',
    }

    handleAddNewTaskOnClick = () => {
        this.setState({
            addingNewTask: true,
        });
    }

    handleTaskNameInputOnChange = (e) => {
        this.setState({
            newTaskName: e.target.value,
        });
    }

    handleAddNewTaskCancel = (e) => {
        this.resetNewTaskState();

        this.setState({
            addingNewTask: false,
        });
    }

    handleWhoAndWhenOnClick = (id) => {
        const { dispatch } = this.props;
       if(id) {
            // 显示/不显示任务设置面板（指派人和截止时间）
            dispatch(toggleTaskShowInCurrentTasks(id));
       } else {
            this.setState((prevState) => {
                return {
                    whoAndWhenSettingVisible: !prevState.whoAndWhenSettingVisible,
                }
            });
       }
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
                    this.getProject(projectId);
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
     * @description 清空新建项目面板的信息
     * 
     * @memberof ProjectContent
     */
    resetNewTaskState = () => {
        this.setState({
            newTaskName: '',
            when: '没有截止日期',
            who: '未指派',
        });
    }

    /**
     * @description 获取当前项目的详细信息
     * @param projectId 当前项目的id
     * 
     * @memberof ProjectContent
     */
    getProject = (projectId) => {
        const url = `${config.serverHost}/api/project/getProject`;
        const { history, dispatch } = this.props;

        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if(token === null || userId === null) {
            history.push(`/user/sign_in`);
        } else {
            if(projectId) {
                const data = {
                    params: {
                        projectId,
                        token
                    }
                };
                axios.get(url, data)
                    .then((result) => {
                        if(result.data.code === 0) {
                            let { project } = result.data;
                            dispatch(setCurrentProject(project));
                            dispatch(setCurrentTasks(project.tasks));
                        } else if(result.data.code === -98) {
                            history.push(`/user/sign_in`);
                        } else if(result.data.code === -4) {
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
     * @description 添加新任务
     * 
     * @memberof ProjectContent
     */
    handleAddNewTaskOk = (e) => {
        const { newTaskName, when, who } = this.state;
        const { projectId, currentProject, history } = this.props;

        if(newTaskName == '') {
            message.error(`任务名称不能为空！`, 3);
            return;
        }

        let deadLine ;
        let userId ;
        if( when != '没有截止日期') {
            deadLine = when;
        }
        if( who != '未指派') {
            currentProject.members.forEach((v) => {
                if(v.userName == who) {
                    userId = v._id;
                }
            });
        }
        
        let token = localStorage.getItem('token');

        axios.post(`${config.serverHost}/api/task/newTask`, {
                token,
                projectId,
                deadLine,
                taskName: newTaskName,
                executorId: userId,
            })
            .then((result) => {
                let { data } = result;
                if(data.code == 0) {
                    // 更新redux state
                    this.getProject(projectId);
                    this.setState({
                        addingNewTask: false,
                    });
                    this.resetNewTaskState();
                } else if(data.code == -98) {
                    history.push(`/user/sign_in`);
                }
                
            })
            .catch((err) => {
                console.log(err);
            });
    }

    /**
     * @description 设置日期和指派人
     * @param settingWho 指派人
     * @param settingWhen 截止时间
     * @param id 任务id
     * 
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
                        this.getProject(projectId);
                    } else if (data.code == -98) {
                        history.push(`/user/sign_in`);
                    } else if (data.code == -1) {
                        console.log(`${data.msg}: ${data.code}`);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            this.setState({
                who: settingWho,
                when: settingWhen
            });
        }
    }

    render() {
        const { history, currentProject, currentTasks } = this.props;
        const { newTaskName, addingNewTask, whoAndWhenSettingVisible, who, when } = this.state;
        let unfinishTasks = 0; //未完成的任务数量
        let projectName = ''; // 项目的名称
        let projectMembersNum = 0; //项目的成员数量
        let projectId = ''; // 项目的id
        let members = []; // 成员 UserModal
        let unfinishedTasksList = []; // 未完成的任务列表
        let finishedTaskList = []; // 已完成的任务列表
        if(currentProject) {
            projectName = currentProject.projectName;
            projectMembersNum = currentProject.members.length;
            projectId = currentProject._id;
            members = currentProject.members;
        }
        if(currentTasks) {
            currentTasks.forEach((v) => {
                
                let who = '未指派';
                let when = '没有截止日期';
                if(v.task.executor) {
                    members.forEach((member) => {
                        if(member._id == v.task.executor) {
                            who = member.userName;
                        }
                    });
                }
                if(v.task.deadLine) {
                    when = v.task.deadLine;
                }
                if(v.task.finished) {
                    finishedTaskList.push(
                        <Card key={v._id} className={`task`}>
                            <Checkbox
                                checked={v.task.finished}
                                onChange={e => this.toggleTaskFinish(v._id)}
                                >
                            </Checkbox>
                            <Link 
                                to={`/projects/${projectId}/tasks/${v._id}`}  
                                className={`link`}
                                >
                                {v.task.taskName}
                            </Link>
                            <WhoAndWhen 
                                who={who}
                                when={when}
                                members={members}
                                taskId={v._id}
                                clickable={false}
                                style={{
                                    marginLeft: 10,
                                }}
                                whoAndWhenSettingVisible={v.show}
                                handleWhoAndWhenOnClick={this.handleWhoAndWhenOnClick}
                                handleSettingWhoAndWhen={this.handleSettingWhoAndWhen}
                                />
                        </Card>
                    );
                } else {
                    unfinishTasks ++; // 统计未完成任务
                    unfinishedTasksList.push(
                        <Card key={v._id} className={`task`}>
                            <Checkbox
                                checked={v.task.finished}
                                onChange={e => this.toggleTaskFinish(v._id)}
                                >
                            </Checkbox>
                            <Link 
                                to={`/projects/${projectId}/tasks/${v._id}`}  
                                className={`link`}>
                                {v.task.taskName}
                            </Link>
                            <WhoAndWhen 
                                who={who}
                                when={when}
                                members={members}
                                taskId={v._id}
                                style={{
                                    marginLeft: 10,
                                }}
                                whoAndWhenSettingVisible={v.show}
                                handleWhoAndWhenOnClick={this.handleWhoAndWhenOnClick}
                                handleSettingWhoAndWhen={this.handleSettingWhoAndWhen}
                                />
                        </Card>
                    );
                }
                
            });
        }
        return (
            <div className={`project-content-container`}>
                <div className={`project-header`}>
                    <h2 className={`title`}>{projectName}</h2>
                    <div className={`summary`}>
                        <div className={`unfinish-tasks`}>
                            <span className={`num`}>{unfinishTasks}</span>
                            <span className={`text`}>待处理任务</span>
                        </div>
                        <div className={`members-info`}>
                            <span className={`num`}>{projectMembersNum}</span>
                            <span className={`text`}>成员</span>
                        </div>
                        <Link className={`setting`} to={`/projects/${projectId}/settings`}>
                            <Icon type="setting" className={`icon`}/>
                            <span className={`text`}>设置</span>
                        </Link>
                    </div>
                </div>
                <div className={`project`}>
                    { unfinishedTasksList }
                    {
                        addingNewTask ?
                        <Card className={`add-new-task-input-card`}>
                            <div className={`input-container`}>
                                <Input
                                    size="large"
                                    placeholder="新的任务"
                                    value={newTaskName}
                                    className={`new-task-name-input`}
                                    onChange={this.handleTaskNameInputOnChange}
                                    />
                                <WhoAndWhen 
                                    who={who}
                                    when={when}
                                    members={members}
                                    whoAndWhenSettingVisible={whoAndWhenSettingVisible}
                                    handleWhoAndWhenOnClick={this.handleWhoAndWhenOnClick}
                                    handleSettingWhoAndWhen={this.handleSettingWhoAndWhen}
                                    style={{
                                        marginTop: '10px',
                                    }}
                                    />
                                <div className={`btn-container`}>
                                    <Button 
                                        className={`cancel`}
                                        onClick={this.handleAddNewTaskCancel}
                                        >取消</Button>
                                    <Button 
                                        type="primary"
                                        className={`create`}
                                        onClick={this.handleAddNewTaskOk}
                                        >创建任务</Button>
                                </div>
                            </div>
                        </Card>
                        :
                        <Card
                            className={`add-new-task-card`}
                            onClick={this.handleAddNewTaskOnClick}
                            >
                            添加新任务
                        </Card>
                    }
                    { finishedTaskList }
                </div>
                <div className={`project-footer`}></div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { user, currentTeam, currentProject, currentTasks } = state;
    return {
        user,
        currentTeam,
        currentProject,
        currentTasks,
        ...ownProps,
    };
};

ProjectContent = connect(mapStateToProps)(ProjectContent);

export default ProjectContent;