import React from 'react';

import { Checkbox, Button, message, Modal } from 'antd';
// const CheckboxGroup = Checkbox.Group;

// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './JoinApprovalContent.less';
import axios from 'axios';
import config from '../../../../config/config';
import { 
    addAllApplyMembers, 
    toggleApplyMemberCheck,
    checkAllApplyMembers,
    uncheckAllApplyMembers,
    removeApplyMember
 } from '../../../actions/applyMembersActions';
// import '../../../assets/style.less';



class JoinApprovalContent extends React.Component {
    
    state = {
        rejectConfirmModalVisible: false
    }

    componentWillMount() {
        const { currentTeam, dispatch } = this.props;
        dispatch(addAllApplyMembers(currentTeam.applies));
    }

    handleCheck = (e, id) => {
        const { dispatch } = this.props;
        dispatch(toggleApplyMemberCheck(id));
    }

    handleCheckAllOnChange = (e) => {
        const { dispatch } = this.props;
        let checked = e.target.checked;
        if(checked) {
            dispatch(checkAllApplyMembers());
        } else {
            dispatch(uncheckAllApplyMembers());
        }
    }

    handleApprovalPassOnClick = (e) => {
        const { applyMembers, currentTeam, dispatch, history } = this.props;
        let checkedApplyMembers = applyMembers.filter((v) => {
            return v.checked === true;
        });
        let teamId = '';
        if(currentTeam) {
            teamId = currentTeam._id;
        }
        let token = localStorage.getItem('token');
        if(checkedApplyMembers.length === 0) {
            message.warning(`审批前请选择相应的成员！`);
            return ;
        }
        
        let appliesId = [];
        let applyingUsersId = [];
        checkedApplyMembers.forEach((member) => {
            appliesId.push(member._id);
            applyingUsersId.push(member.apply.applyingUser._id);
        });
        axios.post(`${config.serverHost}/api/apply/approvalApply`, {
                token,
                appliesId,
                applyingUsersId,
                applyingTeamId: checkedApplyMembers[0].apply.applyingTeam._id, //都是申请同一个team，所以用[0]就可以了。
            })
            .then((result) => {
                let { data } = result;
                if(data.code === 0) {
                    checkedApplyMembers.forEach((v) => {
                        dispatch(removeApplyMember(v._id));
                    });
                    history.push(`/teams/${teamId}/members`);
                } else if(data.code === -98) {
                    history.push(`/user/sign_in`);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        
    }

    handleApprovalRejectOnClick = (e) => {
        const { applyMembers } = this.props;
        let checkedApplyMembers = applyMembers.filter((v) => {
            return v.checked === true;
        });
        if(checkedApplyMembers.length == 0) {
            message.warning(`操作前请选择相应的成员！`);
        } else {
            this.setState({
                rejectConfirmModalVisible: true
            });
        }
    }

    handleRejectConfirmModalOnOk = () => {
        this.setState({
            rejectConfirmModalVisible: false
        });
        const { applyMembers, history, currentTeam, dispatch } = this.props;
        let teamId = '';
        if(currentTeam) {
            teamId = currentTeam._id;
        }
        let token = localStorage.getItem('token');
        let checkedApplyMembers = applyMembers.filter((v) => {
            return v.checked === true;
        });
        let length = checkedApplyMembers.length;
        let count = length;
        checkedApplyMembers.forEach((v) => {
            axios.post(`${config.serverHost}/api/apply/rejectApply`, {
                    token,
                    applyId: v._id,
                    applyingUserId: v.apply.applyingUser._id,
                    applyingTeamId: v.apply.applyingTeam._id,
                })
                .then((result) => {
                    let { data } = result;
                    if(data.code === 0) {
                        dispatch(removeApplyMember(v._id));
                        count --;
                        if(count === 0) {
                            history.push(`/teams/${teamId}/members`);
                        }
                    } else if(data.code === -98) {
                        history.push(`/user/sign_in`);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        });
    }

    handleRejectConfirmModalOnCancel = () => {
        this.setState({
            rejectConfirmModalVisible: false
        });
    }

    render() {
        const { applyMembers } = this.props;
        const { rejectConfirmModalVisible } = this.state;
        let applyMembersList;
        let checkAllFlag = true;
        if(applyMembers) {
            applyMembersList = applyMembers.map((v) => {
                return (
                    <div 
                        className={`member`}
                        key={v._id}
                        >
                        <Checkbox
                            className={`checkbox`}
                            checked={v.checked}
                            onChange={(e) => this.handleCheck(e, v._id) }
                            >
                        </Checkbox>
                        <img 
                            className={`head-img`} 
                            alt={`头像`} 
                            src={`${config.serverHost}/${v.apply.applyingUser.headImgUrl}`}/>
                        <div className={`member-info`}>
                            <span className={`name-and-email`}>
                                {`${v.apply.applyingUser.userName}（${v.apply.applyingUser.eMail}）`}
                            </span>
                            <span className={`reason`}>{v.apply.applyReason}</span>
                        </div>
                    </div>
                );
            });
            applyMembers.forEach((v) => {
                if(!v.checked) {
                    checkAllFlag = false;
                }
            });
        }
        


        return (
            <div className={`join-approval-content-container`}>
                <h3 className={`title`}>加入申请</h3>
                { applyMembersList }
                <div className={`operate-box`}>
                    <Checkbox
                        checked={checkAllFlag}
                        onChange={this.handleCheckAllOnChange}
                        >全选</Checkbox>
                    <Button 
                        type="primary"
                        onClick={this.handleApprovalPassOnClick}
                        >
                        审批通过
                    </Button>
                    <Button 
                        type="danger"
                        onClick={this.handleApprovalRejectOnClick}
                        >
                        拒绝申请
                    </Button>
                </div>
                <Modal
                    title="拒绝确认"
                    visible={rejectConfirmModalVisible}
                    onOk={this.handleRejectConfirmModalOnOk}
                    onCancel={this.handleRejectConfirmModalOnCancel}
                    okText={`确认`}
                    cancelText={`取消`}
                    wrapClassName={`reject-confirm-modal`}
                    >
                    <p className={`text`}>确认拒绝他们的申请吗？</p>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { user, currentTeam, applyMembers } = state;
    return {
        user,
        currentTeam,
        applyMembers,
        ...ownProps,
    };
};

JoinApprovalContent = connect(mapStateToProps)(JoinApprovalContent);

export default JoinApprovalContent;