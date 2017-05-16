import React from 'react';

import { Input, Checkbox, Button, message } from 'antd';
const CheckboxGroup = Checkbox.Group;

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './NewProjectsContent.less';
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



class NewProjectsContent extends React.Component {

    state = {
        projectName: '',
        projectDescription: '',
    }

    componentWillMount() {
        const { currentTeam, dispatch } = this.props;
        if(currentTeam) {
            let choosingProjectMembers = [...currentTeam.managers, ...currentTeam.normalMembers];
            dispatch(addAllChoosingProjectMembers(choosingProjectMembers));
        }
    }

    handleProjectNameOnChange = (e) => {
        this.setState({
            projectName: e.target.value
        })
    }

    handleProjectDescriptionOnChange = (e) => {
        this.setState({
            projectDescription: e.target.value
        })
    }

    handleCreateProjectOnClick = () => {
        const { projectName, projectDescription } = this.state;
        const { currentTeam, choosingProjectMembers, user, history, dispatch } = this.props;
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
        axios.post(`${config.serverHost}/api/project/newProject`, {
                token,
                projectName,
                projectDescription,
                teamId: currentTeam._id,
                membersId
            })
            .then((result) => {
                let { data } = result;
                if(data.code === 0) {
                    dispatch(removeAllChoosingProjectMember());
                    history.push(`/projects/${data.project._id}`);
                } else if(data.code == -98) {
                    history.push(`/user/sign_in`);
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

    render() {
        const { user, currentTeam, choosingProjectMembers } = this.props;
        const { projectName, projectDescription} = this.state;
        let userId = '';
        let teamId = '';
        if(user) {
            userId = user._id;
        }
        if(currentTeam) {
            teamId = currentTeam._id;
        }
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
            <div className={`new-projects-content-container`}>
                <h3 className={`title`}>创建新项目</h3>
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
                    onClick={this.handleCreateProjectOnClick}
                    >
                    创建项目
                </Button>
                <Link to={`/teams/${teamId}/projects`} className={`cancel`}>取消</Link>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { user, currentTeam, choosingProjectMembers } = state;
    return {
        user,
        currentTeam,
        choosingProjectMembers,
        ...ownProps,
    };
};

NewProjectsContent = connect(mapStateToProps)(NewProjectsContent);

export default NewProjectsContent;