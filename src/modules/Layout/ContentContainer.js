import React from 'react';
import { Layout } from 'antd';
const { Content } = Layout;

class ContentContainer extends React.Component {
    render() {
        return (
            <Content className={`custom-ant-layout-content`}>
                <div className={`content-container`}>
                    {this.props.children}
                </div>
            </Content>
        );
    }
}

export default ContentContainer;