import React from 'react';

import { Icon, Card, Input, Button, message, Checkbox  } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './ProjectContent.less';
import axios from 'axios';
import WhoAndWhen from './WhoAndWhen';
import config from '../../../../config/config';
import { setCurrentProject } from '../../../actions/currentProjectActions';
import { setCurrentTasks, toggleTaskInCurrentTasks } from '../../../actions/currentTasksActions';
// import '../../../assets/style.less';



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
       if(id) {
            const { dispatch } = this.props;
            dispatch(toggleTaskInCurrentTasks(id));
       } else {
            this.setState((prevState) => {
                return {
                    whoAndWhenSettingVisible: !prevState.whoAndWhenSettingVisible,
                }
            });
       }
        // this.setState({
        //     // remarkText: [
        //     //                 ...this.remarkText.slice(0, index), 
        //     //                 recorde.description, 
        //     //                 ...this.remarkText.slice(index + 1)
        //     //             ]
        //     remarkText: this.state.remarkText.slice(0, index).concat(recorde.description, this.state.remarkText.slice(index + 1))
        // });
    }

    resetNewTaskState = () => {
        this.setState({
            newTaskName: '',
            when: '没有截止日期',
            who: '未指派',
        });
    }

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

    handleSelectOnChange = (value, id) => {
        if(id) {

        } else {
            const { currentProject } = this.props;
            let members = currentProject.members.map(v => v.userName);
            this.setState({
                who: members.indexOf(value) > -1 ? value : '未指派'
            });
        }
    }

    handleDataOnChange = (date, dateString, id) => {
        // console.log(date, dateString);
        if(id) {
            
        } else {
            const { who } = this.state;
            if(who == '未指派') {
                message.warning(`选择日期之前，请先指派!`, 3);
                return ;
            }
            this.setState({
                when: dateString == '' ? '没有截止日期' : dateString
            });
        }
       
    }

    render() {
        const { history, currentProject, currentTasks } = this.props;
        const { newTaskName, addingNewTask, whoAndWhenSettingVisible, who, when } = this.state;
        let unfinishTasks = 0;
        let projectName = '';
        let projectMembersNum = 0;
        let projectId = '';
        let members = [];
        let tasksList;
        if(currentProject) {
            projectName = currentProject.projectName;
            projectMembersNum = currentProject.members.length;
            projectId = currentProject._id;
            members = currentProject.members;
        }
        if(currentTasks) {
            tasksList = currentTasks.map((v) => {
                if(!v.task.finished) {
                    unfinishTasks ++;
                }
                let who = '未指派';
                let when = '没有截止日期';
                if(v.task.executorId) {
                    members.forEach((member) => {
                        if(member._id == v.task.executorId) {
                            who = member.userName;
                        }
                    });
                }
                if(v.task.deadLine) {
                    when = v.tash.deadLine;
                }
                return (
                    <Card key={v._id} className={`task`}>
                        <Checkbox
                            checked={v.task.finished}
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
                            whoAndWhenSettingVisible={v.show}
                            handleWhoAndWhenOnClick={this.toggleTaskById}
                            handleSelectOnChange={this.handleSelectOnChange}
                            handleDataOnChange={this.handleDataOnChange}
                            />
                    </Card>
                );
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
                    { tasksList }
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
                                    handleSelectOnChange={this.handleSelectOnChange}
                                    handleDataOnChange={this.handleDataOnChange}
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