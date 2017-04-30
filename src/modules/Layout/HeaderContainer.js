import React from 'react';
import { Layout } from 'antd';
const { Content } = Layout;

class HeaderContainer extends React.Component {
    render() {
        return (
            <Content className={`custom-ant-layout-header`}>
                <div className={`header-container`}>
                    {this.props.children}
                </div>
            </Content>
        );
    }
}

export default HeaderContainer;