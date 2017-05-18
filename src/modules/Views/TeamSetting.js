import React from 'react';

import LayoutMain from '../Layout/LayoutMain';
import HeaderContainer from '../Layout/HeaderContainer';
import ContentContainer from '../Layout/ContentContainer';
import FooterContainer from '../Layout/FooterContainer';

import Footer from '../Components/Footer/Footer';

import CommonHeaderContent  from '../Components/Header/CommonHeaderContent';
import TeamSettingContent from '../Components/Content/TeamSettingContent';

/**
 * @description 团队帐户设置页
 * 
 * @class TeamSetting
 * @extends {React.Component}
 */
class TeamSetting extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { history } = this.props;
        const { teamId } = this.props.match.params;
        // console.log(history);
        return (
            <LayoutMain>
                <HeaderContainer>
                    <CommonHeaderContent 
                        history={history}
                        teamId={teamId}
                        selectedKeys={['teams']}
                        />
                </HeaderContainer>
                <ContentContainer>
                    <TeamSettingContent 
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

export default TeamSetting;