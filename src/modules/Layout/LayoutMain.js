import React from 'react';
import { Layout } from 'antd';

import './LayoutMain.less';

class LayoutMain extends React.Component {
    render() {
        return (
            <Layout>
                {this.props.children}
            </Layout>
        );
    }
}

export default LayoutMain;