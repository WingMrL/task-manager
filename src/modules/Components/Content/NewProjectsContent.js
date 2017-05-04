import React from 'react';

import { Input, Checkbox, Button, message } from 'antd';
const CheckboxGroup = Checkbox.Group;

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './NewProjectsContent.less';
// import axios from 'axios';
// import config from '../../../../config/config';
// import { addUser } from '../../../actions/userActions';
// import '../../../assets/style.less';



class NewProjectsContent extends React.Component {

    state = {
        projectName: '',
        porjectDescription: '',
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
        const { projectName } = this.state;
        if(projectName == '') {
            message.error('项目名称不能为空!', 3);
            return ;
        }
    }

    render() {
        const { user, currentTeam } = this.props;
        const { projectName, projectDescription } = this.state;
        let userId = '';
        let teamId = '';
        if(user) {
            userId = user._id;
        }
        if(currentTeam) {
            teamId = currentTeam._id;
        }
        const options = ['Apple', 'Pear', 'Orange'];
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
                <Checkbox>全选</Checkbox>
                <span className={`hr2`}></span>
                <CheckboxGroup 
                    options={options}
                    />
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
    const { user, currentTeam } = state;
    return {
        user,
        currentTeam,
        ...ownProps,
    };
};

NewProjectsContent = connect(mapStateToProps)(NewProjectsContent);

export default NewProjectsContent;