import React from 'react';

import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './HomePage.less';
import logo from '../../../assets/images/index/task-manager.png';
import '../../../assets/style.less';

class HomePage extends React.Component {

    render() {

        const { hasSignIn } = this.props;
        return (
            <div className={`homepage-container`}>
                <img src={logo} alt='logo' className={`img-logo`}/>
                <h2 className={`h2-your-office`}>你 的 网 上 办 公 室</h2>
                <p className={`p-task-manager-system`}>基 于 Web 的 多 人协 作 项 目 管 理  系 统</p>

                { hasSignIn ? 
                    <div className={'link-container'}>
                        <Link to={`/teams`}>
                            <Button size="large" type="primary">
                                进入 TM
                                <span className={`icon-enter-rocket`}></span>
                            </Button>
                        </Link>
                    </div>
                    :
                    <div className={'link-container'}>
                        <Link to={`/user/sign_up`}>
                            <Button size="large" type="primary">免费注册</Button>
                        </Link>
                        <Link to={`/user/sign_in`}>
                            <Button size="large" type="primary">登陆</Button>
                        </Link>
                    </div>
                }
                <Link to={`/join?t=f99f6940-308f-11e7-88b2-2b9d07656175`}>join</Link>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { hasSignIn } = state;
    return {
        hasSignIn
    }
};

HomePage = connect(mapStateToProps)(HomePage);

export default HomePage;