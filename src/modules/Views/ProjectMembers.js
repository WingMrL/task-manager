import React from 'react';

import LayoutMain from '../Layout/LayoutMain';
import HeaderContainer from '../Layout/HeaderContainer';
import ContentContainer from '../Layout/ContentContainer';
import FooterContainer from '../Layout/FooterContainer';

import Footer from '../Components/Footer/Footer';

import CommonHeaderContent  from '../Components/Header/CommonHeaderContent';
import ProjectMembersContent from '../Components/Content/ProjectMembersContent';

/**
 * @description 项目成员页
 * 
 * @class ProjectMembers
 * @extends {React.Component}
 */
class ProjectMembers extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { history } = this.props;
        const { projectId } = this.props.match.params;
        return (
            <LayoutMain>
                <HeaderContainer>
                    <CommonHeaderContent 
                        history={history}
                        selectedKeys={['projects']}
                        />
                </HeaderContainer>
                <ContentContainer>
                    <ProjectMembersContent 
                        history={history}
                        projectId={projectId}
                        />
                </ContentContainer>
                <FooterContainer>
                    <Footer />
                </FooterContainer>
            </LayoutMain>
        );
    }
}

export default ProjectMembers;