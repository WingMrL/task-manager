import React from 'react';

import { Input, Checkbox, Button, message, Modal } from 'antd';
const CheckboxGroup = Checkbox.Group;

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './ProjectSettingContent.less';
import axios from 'axios';
import config from '../../../../config/config';
import {
    addAllChoosingProjectMembers,
    toggleChoosingProjectMemberCheck,
    checkAllChoosingProjectMembers,
    uncheckAllChoosingProjectMembers,
    removeAllChoosingProjectMember
} from '../../../actions/choosingProjectMembersActions';
// import '../../../assets/style.less';



class ProjectSettingContent extends React.Component {

    state = {
        projectName: '',
        projectDescription: '',
        deleteProjectConfirmModalVisible: false, // 删除项目的确认框是否显示
    }

    componentWillMount() {
        this.initChoosingProjectMembers();
        this.initProjectNameAndDescription();
    }

    /**
     * @description 初始化项目中的成员（包括是否选中）
     * @memberof ProjectSettingContent
     */
    initChoosingProjectMembers = () => {
        const { currentProject, dispatch, user, currentTeam } = this.props;
        if(currentTeam && currentProject) {
            let choosingProjectMembers = [...currentTeam.managers, ...currentTeam.normalMembers, currentTeam.superManager];
            choosingProjectMembers = choosingProjectMembers.filter((member) => {
                return member._id != user._id;
            });
            dispatch(addAllChoosingProjectMembers(choosingProjectMembers));
            let projectMembersId = currentProject.members.map(v => v._id);
            choosingProjectMembers.forEach((v) => {
                // 在团队中，但之前没有添加到项目中，checked 为 false
                if(projectMembersId.indexOf(v._id) < 0) {
                    dispatch(toggleChoosingProjectMemberCheck(v._id));
                }
            });
            
        }
    }

    /**
     * @description 初始化项目的名称和描述
     * @memberof ProjectSettingContent
     */
    initProjectNameAndDescription = () => {
        const { currentProject } = this.props;
        if(currentProject) {
            const { projectName, description } = currentProject;
            this.setState({
                projectName,
                projectDescription: description,
            });
        }
    }

    /**
     * @description 处理项目名称input的onChange
     * @memberof ProjectSettingContent
     */
    handleProjectNameOnChange = (e) => {
        this.setState({
            projectName: e.target.value
        })
    }

    /**
     * @description 处理项目描述input的onChange
     * @memberof ProjectSettingContent
     */
    handleProjectDescriptionOnChange = (e) => {
        this.setState({
            projectDescription: e.target.value
        })
    }

    /**
     * @description 保存project
     * @memberof ProjectSettingContent
     */
    handleSaveProjectOnClick = () => {
        const { projectName, projectDescription } = this.state;
        const {  choosingProjectMembers, user, history, dispatch, currentProject } = this.props;
        if(projectName == '') {
            message.error('项目名称不能为空!', 3);
            return ;
        }
        let token = localStorage.getItem('token');
        let userId = user._id;
        let membersId = [];
        choosingProjectMembers.forEach((v) => {
            if(v.checked) {
                membersId.push(v._id);
            }
        });
        membersId.unshift(userId);
        axios.post(`${config.serverHost}/api/project/setProject`, {
                token,
                projectName,
                projectId: currentProject._id,
                projectDescription,
                membersId
            })
            .then((result) => {
                let { data } = result;
                if(data.code === 0) {
                    dispatch(removeAllChoosingProjectMember());
                    history.push(`/projects/${currentProject._id}`);
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

    handleMemberCheckboxOnChange = (e, id) => {
        const { dispatch } = this.props;
        dispatch(toggleChoosingProjectMemberCheck(id));
    }

    handleCheckAllOnChange = (e) => {
        const { dispatch } = this.props;
        if(e.target.checked) {
            dispatch(checkAllChoosingProjectMembers());
        } else {
            dispatch(uncheckAllChoosingProjectMembers());
        }
    }

    /**
     * @description 删除项目 点击事件, 弹出确认删除对话框
     * @memberof ProjectSettingContent
     */
    handleDeleteProjectOnClick = (e) => {
        this.setState({
            deleteProjectConfirmModalVisible: true,
        });
    }

    /**
     * @description 确认删除事件，(确认删除)
     * @memberof ProjectSettingContent
     */
    handleDeleteProjectOnOk = (e) => {
        const { user, currentProject, history, currentTeam } = this.props;
        const token = localStorage.getItem('token');
        axios.post(`${config.serverHost}/api/project/deleteProject`, {
            token,
            projectId: currentProject._id,
        }).then((result) => {
            let { data } = result;
            if(data.code == 0) {
                history.push(`/teams/${currentTeam._id}/projects`);
            } else if (data.code == -98) {
                history.push(`/user/sign_in`);
            } else if(data.code == -1 || data.code == -4) {
                console.log(`${data.msg}: ${data.code}`);
            }
        })
        
    }

    /**
     * @description 删除项目modal消息事件
     * @memberof ProjectSettingContent
     */
    handleDeleteProjectOnCancel = (e) => {
        this.setState({
            deleteProjectConfirmModalVisible: false,
        });
    }

    render() {
        const { choosingProjectMembers, projectId, currentProject } = this.props;
        const { projectName, projectDescription, deleteProjectConfirmModalVisible} = this.state;

        let checkboxList ;
        let checkAllFlag = true;
        if(choosingProjectMembers) {
            checkboxList = choosingProjectMembers.map((v) => {
                if(!v.checked) {
                    checkAllFlag = false;
                }
                return (
                    <Checkbox 
                        checked={v.checked}
                        key={v._id}
                        onChange={(e) => {this.handleMemberCheckboxOnChange(e, v._id)}}
                        >
                        {v.member.userName}
                    </Checkbox>
                );
            });
        }
        return (
            <div className={`project-setting-content-container`}>
                <h3 className={`title`}>项目设置</h3>
                <Input 
                    placeholder={`项目名称`} 
                    className={`project-name`}
                    value={projectName}
                    onChange={this.handleProjectNameOnChange}
                    />
                <Input 
                    className={`project-description`}
                    type="textarea" 
                    rows={4} 
                    placeholder={`简单描述项目，便于其他人理解（选填）`}
                    value={projectDescription}
                    onChange={this.handleProjectDescriptionOnChange}
                    />
                <span className={`hr`}></span>
                <h3 className={`choose-members`}>选择项目成员</h3>
                <p className={`info`}>管理员可以邀请和移除项目成员，只有被邀请的团队成员才能访问该项目的信息。</p>
                <Checkbox
                    checked={checkAllFlag}
                    onChange={this.handleCheckAllOnChange}
                    >全选</Checkbox>
                <span className={`hr2`}></span>
                <div className={`checkbox-ct`}>
                    { checkboxList }
                </div>
                <Button 
                    type="primary"
                    onClick={this.handleSaveProjectOnClick}
                    >
                    保存
                </Button>
                <Link to={`/projects/${projectId}`} className={`cancel`}>取消</Link>
                <span className={`hr`}></span>
                <h3 className={`title`}>删除项目</h3>
                <p className={`info`}>项目删除后，所有的内容也将被立刻删除，不能恢复。请谨慎操作。</p>
                <Button 
                    type="danger"
                    onClick={this.handleDeleteProjectOnClick}
                    style={{
                        marginTop: 10,
                    }}
                    >
                    了解风险，删除这个项目
                </Button>
                <Modal
                    title="删除项目确认"
                    onOk={this.handleDeleteProjectOnOk}
                    onCancel={this.handleDeleteProjectOnCancel}
                    wrapClassName={`project-delete-confirm-modal`}
                    visible={deleteProjectConfirmModalVisible}
                    >
                    <p className={`text`}>项目删除后，所有的内容也将被立刻删除，不能恢复。确定删除?</p>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { choosingProjectMembers, currentProject, user, currentTeam } = state;
    return {
        choosingProjectMembers,
        currentProject,
        user,
        currentTeam,
        ...ownProps,
    };
};

ProjectSettingContent = connect(mapStateToProps)(ProjectSettingContent);

export default ProjectSettingContent;