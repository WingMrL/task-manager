import React from 'react';

import LayoutMain from '../Layout/LayoutMain';
import HeaderContainer from '../Layout/HeaderContainer';
import ContentContainer from '../Layout/ContentContainer';
import FooterContainer from '../Layout/FooterContainer';

import Footer from '../Components/Footer/Footer';

import CommonHeaderContent  from '../Components/Header/CommonHeaderContent';
import ProjectContent from '../Components/Content/ProjectContent';

/**
 * @description 项目详情页，任务列表页面
 * 
 * @class Project
 * @extends {React.Component}
 */
class Project extends React.Component {

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
                        projectId={projectId}
                        selectedKeys={['projects']}
                        />
                </HeaderContainer>
                <ContentContainer>
                    <ProjectContent 
                        history={history}
                        projectId={projectId}/>
                </ContentContainer>
                <FooterContainer>
                    <Footer />
                </FooterContainer>
            </LayoutMain>
        );
    }
}

export default Project;