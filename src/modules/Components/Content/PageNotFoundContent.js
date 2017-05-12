import React from 'react';

// import { Input, Button } from 'antd';
import { Link } from 'react-router-dom';
// import { connect } from 'react-redux';
import './PageNotFoundContent.less';
import pageNotFound from '../../../assets/images/page-not-found/404.png';
import TM from '../../../assets/images/index/task-manager.png';
// import axios from 'axios';
// import config from '../../../../config/config';
// import { addUser } from '../../../actions/userActions';
// import '../../../assets/style.less';



class PageNotFoundContent extends React.Component {

    render() {
        
        return (
            <div className={`page-not-found-content-container`}>
                <Link to={`/`} className={`link`}>
                    <img src={TM} alt={`TM`} className={`logo-img`}/>
                </Link>
                <img src={pageNotFound} alt={`404`} className={`img-404`}/>
            </div>
        );
    }
}

// const mapStateToProps = (state, ownProps) => {
//     const { user } = state;
//     return {
//         user,
//         ...ownProps,
//     };
// };

// PageNotFoundContent = connect(mapStateToProps)(PageNotFoundContent);

export default PageNotFoundContent;