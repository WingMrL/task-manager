import React from 'react';

import LayoutMain from '../Layout/LayoutMain';
import HeaderContainer from '../Layout/HeaderContainer';
import ContentContainer from '../Layout/ContentContainer';
import FooterContainer from '../Layout/FooterContainer';

import Footer from '../Components/Footer/Footer';

import CommonHeaderContent  from '../Components/Header/CommonHeaderContent';
import ProjectSettingContent from '../Components/Content/ProjectSettingContent';

/**
 * @description 项目设置页
 * 
 * @class ProjectSetting
 * @extends {React.Component}
 */
class ProjectSetting extends React.Component {

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
                    <ProjectSettingContent 
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

export default ProjectSetting;