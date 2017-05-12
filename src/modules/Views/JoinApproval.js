import React from 'react';

import LayoutMain from '../Layout/LayoutMain';
import HeaderContainer from '../Layout/HeaderContainer';
import ContentContainer from '../Layout/ContentContainer';
import FooterContainer from '../Layout/FooterContainer';

import Footer from '../Components/Footer/Footer';

import CommonHeaderContent  from '../Components/Header/CommonHeaderContent';
import JoinApprovalContent from '../Components/Content/JoinApprovalContent';

class JoinApproval extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { history } = this.props;
        const { teamId } = this.props.match.params;
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
                    <JoinApprovalContent history={history}/>
                </ContentContainer>
                <FooterContainer>
                    <Footer />
                </FooterContainer>
            </LayoutMain>
        );
    }
}

export default JoinApproval;