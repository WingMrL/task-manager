import React from 'react';

import LayoutMain from '../Layout/LayoutMain';
import HeaderContainer from '../Layout/HeaderContainer';
import ContentContainer from '../Layout/ContentContainer';
import FooterContainer from '../Layout/FooterContainer';

import axios from 'axios';
import config from '../../../config/config';
import PageNotFoundContent from '../Components/Content/PageNotFoundContent';
import Footer from '../Components/Footer/Footer';

// import { addUser } from '../../actions/userActions';
import { connect } from 'react-redux';

/**
 * @description 404页面
 * 
 * @class PageNotFound
 * @extends {React.Component}
 */
class PageNotFound extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        
    }

    render() {
        const { history } = this.props;
        return (
            <LayoutMain>
                <HeaderContainer>
                </HeaderContainer>
                <ContentContainer>
                    <PageNotFoundContent history={history}/>
                </ContentContainer>
                <FooterContainer>
                    <Footer />
                </FooterContainer>
            </LayoutMain>
        );
    }
}

// PageNotFound = connect()(PageNotFound);

export default PageNotFound;