import React from 'react';

import { Modal } from 'antd';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './ProjectMembersContent.less';
import axios from 'axios';
import config from '../../../../config/config';
// import '../../../assets/style.less';



class ProjectMembersContent extends React.Component {

    state = {
        quitProjectModalVisible: false, // 确认退出项目的modal是否显示
    }

    /**
     * @description 退出项目
     * @memberof ProjectMembersContent
     */
    handleQuitProjectOnClick = (e) => {
        e.preventDefault();
        this.setState({
            quitProjectModalVisible: true,
        });
    }

    /**
     * @description 确定退出项目
     * @memberof ProjectMembersContent
     */
    handleQuitProjectModalOnOk = (e) => {
        const { projectId, history, user, currentTeam } = this.props;
        const token = localStorage.getItem('token');
        axios.post(`${config.serverHost}/api/user/quitProject`, {
                token,
                userId: user._id,
                projectId,
            }).then((result) => {
                let { data } = result;
                if(data.code == 0) {
                    history.push(`/teams/${currentTeam._id}/projects`);
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

    /**
     * @description 取消退出项目
     * @memberof ProjectMembersContent
     */
    handleQuitProjectModalOnCancel = (e) => {
        this.setState({
            quitProjectModalVisible: false,
        });
    }

    render() {
        const { currentProject, currentTeam, projectId } = this.props;
        const { quitProjectModalVisible } = this.state;

        let superManagerId  = '';
        let managersId = [];
        let normalMembersId = [];
        if(currentProject && currentTeam) {
            superManagerId = currentTeam.superManager._id;
            currentTeam.managers.forEach((mamanger) => {
                managersId.push(mamanger._id);
            });
            currentTeam.normalMembers.forEach((normalMember) => {
                normalMembersId.push(normalMember._id);
            });
        }

        let membersList;
        let projectName = '';
        if(currentProject) {
            projectName = currentProject.projectName;
            membersList = currentProject.members.map((member) => {
                let roleClassName = ''; // super-manager, manager, normal-member
                let roleName = ''; // 超级管理员， 管理员， 成员
                if(member._id == superManagerId) {
                    roleClassName = 'super-manager';
                    roleName = '超级管理员';
                } else if(managersId.indexOf(member._id) > -1) {
                    roleClassName = 'manager';
                    roleName = '管理员';
                } else {
                    roleClassName = 'normal-member';
                    roleName = '成员';
                }
                return (
                    <Link
                        key={member._id}
                        to={`/members/${member._id}`}
                        className={`link`}
                        >
                        <img
                            src={`${config.serverHost}/${member.headImgUrl}`}
                            alt={`头像`} 
                            className={`head-img`}
                            />
                        <div className={`info-container`}>
                            <span className={`user-name`}>{member.userName}</span>
                            <span className={`role ${roleClassName}`}>{roleName}</span>
                        </div>
                    </Link>
                );
            });
        }
        return (
            <div className={`project-members-content-container`}>
                <Link
                        to={`/projects/${projectId}`}
                        >
                    {`项目：${projectName}`}
                </Link>
                <div className={`header`}>
                    <h3 className={`title`}>项目成员</h3>
                    <Link
                        to={`/`}
                        onClick={this.handleQuitProjectOnClick}
                        className={`quit-project`}
                        >
                        退出项目
                    </Link>
                </div>
                <div className={`members-container`}>
                    { membersList }
                </div>
                <Modal
                    title="退出项目"
                    visible={quitProjectModalVisible}
                    onOk={this.handleQuitProjectModalOnOk}
                    onCancel={this.handleQuitProjectModalOnCancel}
                    wrapClassName={`quit-project-confirm-modal`}
                    >
                    <p className={`text`}>确定退出项目吗？</p>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { currentProject, user, currentTeam } = state;
    return {
        currentProject,
        user,
        currentTeam,
        ...ownProps,
    };
};

ProjectMembersContent = connect(mapStateToProps)(ProjectMembersContent);

export default ProjectMembersContent;