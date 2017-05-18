import React from 'react';

import { Button, Modal, Input, message } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './TeamSettingContent.less';
import axios from 'axios';
import config from '../../../../config/config';
import moment from 'moment';
// import { addUser } from '../../../actions/userActions';
// import '../../../assets/style.less';



/**
 * @description 团队帐户设置页
 * 
 * @class TeamSettingContent
 * @extends {React.Component}
 */
class TeamSettingContent extends React.Component {

    state = {
        modifyTeamModalVisible: false,  // 修改团队名称modal是否显示
        deleteTeamConfirmModalVisible: false, // 删除团队确认modal是否显示
        newTeamName: '', // 新的团队名称,
    }

    /**
     * @description “修改团队名称”Link点击事件
     * @memberof TeamSettingContent
     */
    handleChangeTeamNameOnClick = (e) => {
        e.preventDefault();
        this.setState({
            modifyTeamModalVisible: true,
        });
    }

    /**
     * @description “了解风险，删除当前团队”btn点击事件
     * @memberof TeamSettingContent
     */
    handleDeleteTeamBtnOnClick = (e) => {
        this.setState({
            deleteTeamConfirmModalVisible: true,
        });
    }

    /**
     * @description 隐藏“修改团队名称”modal
     * @memberof TeamSettingContent
     */
    handleModifyTeamNameOnCancel = (e) => {
        this.setState({
            modifyTeamModalVisible: false,
        });
    }

    /**
     * @description 获取团队信息
     * @param teamId 团队的id
     * @memberof TeamSettingContent
     */
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
     * @description 修改团队modal的确定事件
     * @memberof TeamSettingContent
     */
    handleModifyTeamNameOnOk = (e) => {
        const { newTeamName } = this.state;
        const { history, currentTeam } = this.props;
        if(newTeamName == '') {
            message.error(`团队名称不能为空!`, 3);
            return;
        }
        const token = localStorage.getItem('token');
        
        axios.post(`${config.serverHost}/api/team/changeTeamName`, {
                token,
                teamId: currentTeam._id,
                teamName: newTeamName,
            }).then((result) => {
                let { data } = result;
                if(data.code == 0) {
                    this.getTeam(currentTeam._id);
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
     * @description 隐藏“删除团队确认”modal
     * @memberof TeamSettingContent
     */
    handleDeleteTeamModalOnCancel = (e) => {
        this.setState({
            deleteTeamConfirmModalVisible: false,
        });
    }

    /**
     * @description 处理团队名称input的onChange
     * @memberof TeamSettingContent
     */
    handleNewTeamNameOnChange = (e) => {
        this.setState({
            newTeamName: e.target.value,
        })
    }

    render() {
        const { user, currentTeam } = this.props;
        const { modifyTeamModalVisible, deleteTeamConfirmModalVisible, newTeamName } = this.state;
        let teamName = '';
        let teamCreateTime = '';
        if(currentTeam) {
            teamName = currentTeam.teamName;
            teamCreateTime = moment(currentTeam.meta.createAt).format('YYYY年MM月DD日');
        }
        return (
            <div className={`team-setting-content-container`}>
                <div className={`header`}>
                    <h2 className={`team-name`}>{teamName}</h2>
                    <Link 
                        to={`/`}
                        onClick={this.handleChangeTeamNameOnClick}
                        className={`modify-team-name-link`}
                        >
                        修改团队名称
                    </Link>
                </div>
                <span className={`team-create-time-text`}>团队创建于 {teamCreateTime}</span>
                <span className={`hr`}></span>
                <div className={`delete-team-container`}>
                    <div className={`delete-info`}>
                        <h3 className={`title`}>删除团队</h3>
                        <span className={`hint`}>如果你和你的团队成员，从今往后都不再需要访问该团队的信息，可以删除团队账户。</span>
                    </div>
                    <Button 
                        type="danger"
                        onClick={this.handleDeleteTeamBtnOnClick}
                        className={`delete-team-btn`}
                        >
                        了解风险，删除当前团队
                    </Button>
                </div>
                <Modal
                    title="修改团队名称"
                    visible={modifyTeamModalVisible}
                    onCancel={this.handleModifyTeamNameOnCancel}
                    onOk={this.handleModifyTeamNameOnOk}
                    wrapClassName={`modify-team-name-modal`}
                    >
                    <Input 
                        value={newTeamName}
                        placeholder={`新团队名称`}
                        size="large"
                        onChange={this.handleNewTeamNameOnChange}
                        />
                </Modal>
                <Modal
                    title="删除团队"
                    visible={deleteTeamConfirmModalVisible}
                    onCancel={this.handleDeleteTeamModalOnCancel}
                    onOk={this.handleDeleteTeamModalOnOk}
                    wrapClassName={`delete-team-modal`}
                    >
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

TeamSettingContent = connect(mapStateToProps)(TeamSettingContent);

export default TeamSettingContent;