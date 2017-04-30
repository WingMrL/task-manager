import React from 'react';
import { Layout } from 'antd';
const { Content } = Layout;

class FooterContainer extends React.Component {
    render() {
        return (
            <Content className={`custom-ant-layout-footer`}>
                <div className={`footer-container`}>
                    {this.props.children}
                </div>
            </Content>
        );
    }
}

export default FooterContainer;