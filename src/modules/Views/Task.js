import React from 'react';

import LayoutMain from '../Layout/LayoutMain';
import HeaderContainer from '../Layout/HeaderContainer';
import ContentContainer from '../Layout/ContentContainer';
import FooterContainer from '../Layout/FooterContainer';

import Footer from '../Components/Footer/Footer';

import CommonHeaderContent  from '../Components/Header/CommonHeaderContent';
import TaskContent from '../Components/Content/TaskContent';

class Task extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        // console.log(this.props);
        const { history } = this.props;
        const { teamId, projectId, taskId } = this.props.match.params;
        return (
            <LayoutMain>
                <HeaderContainer>
                    <CommonHeaderContent 
                        history={history}
                        teamId={teamId}
                        selectedKeys={['projects']}
                        />
                </HeaderContainer>
                <ContentContainer>
                    <TaskContent 
                        taskId={taskId}
                        projectId={projectId}
                        history={history}
                        />
                </ContentContainer>
                <FooterContainer>
                    <Footer />
                </FooterContainer>
            </LayoutMain>
        );
    }
}

export default Task;