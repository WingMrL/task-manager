import React from 'react';

import { connect } from 'react-redux';

import LayoutMain from '../Layout/LayoutMain';
import HeaderContainer from '../Layout/HeaderContainer';
import ContentContainer from '../Layout/ContentContainer';
import FooterContainer from '../Layout/FooterContainer';

import axios from 'axios';
import config from '../../../config/config';
import HomePage from '../Components/Content/HomePage';
import { signIn } from '../../actions/hasSignInActions';

class Index extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let { dispatch } = this.props;
        let token = localStorage.getItem('token');
        if(token) {
            let data = {
                params: {
                    token
                }
            };
            axios.get(`${config.serverHost}/api/checkSignIn`, data)
                .then((result) => {
                    if(result.data.code == 0) {
                        dispatch(signIn());
                    } else {
                        console.log(result.data.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    render() {
        return (
            <LayoutMain>
                <HeaderContainer>
                </HeaderContainer>
                <ContentContainer>
                    <HomePage />
                </ContentContainer>
                <FooterContainer>
                </FooterContainer>
            </LayoutMain>
        );
    }
}

Index = connect()(Index);

export default Index;