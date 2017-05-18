import React from 'react';

import { Card, Icon, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './ProjectsContent.less';
import axios from 'axios';
import config from '../../../../config/config';
// import { addUser } from '../../../actions/userActions';
// import '../../../assets/style.less';



/**
 * @description 项目列表页
 * 
 * @class ProjectsContent
 * @extends {React.Component}
 */
class ProjectsContent extends React.Component {

    render() {
        const { user, currentTeam } = this.props;
        let userId = '';
        let teamId = '';
        if(user) {
            userId = user._id;
        }
        let projectList = [];
        if(currentTeam) {
            teamId = currentTeam._id;
            currentTeam.projects.forEach((v) => {
                if(v.members.indexOf(userId) > -1) {
                    let projectName = '';
                    if(v.projectName.length > 7) {
                        projectName = v.projectName.slice(0, 7) + "...";
                    } else {
                        projectName = v.projectName;
                    }
                    projectList.push(
                        <Link 
                            className={`project`}
                            key={v._id}
                            to={`/projects/${v._id}`}
                            >
                            <Card>
                                
                                <Icon type="clock-circle-o" className={`icon`}/>
                                <Tooltip title={v.projectName} placement="bottom">
                                    <span className={`project-name`}>{projectName}</span>
                                </Tooltip>
                            </Card>
                        </Link>
                    );
                }
            });
        }
        return (
            <div className={`projects-content-container`}>
                <div className={`projects-tools`}>
                    <Link to={`/teams/${teamId}/projects/new`} className={`new-project`}>新建项目</Link>
                </div>
                <div className={`projects`}>
                    { projectList }
                </div>
                <div className={`projects-footer`}>
                </div>
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

ProjectsContent = connect(mapStateToProps)(ProjectsContent);

export default ProjectsContent;