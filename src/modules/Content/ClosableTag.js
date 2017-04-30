import React from 'react';

import './ClosableTag.less';

import { Tag } from 'antd';

class ClosableTag extends React.Component {

    constructor(props) {
        super(props);
    }

    handleOnClose = (e) => {
        this.props.onClose(e, this.props.index);
    }

    render() {
        return  <Tag
                    closable
                    onClose={this.handleOnClose}
                    >
                    {this.props.children}
                </Tag>;
    }
}

export default ClosableTag;