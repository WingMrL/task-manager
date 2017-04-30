import React from 'react';

import './CheckableTag.less';

import { Tag } from 'antd';
const AntdCheckbleTag = Tag.CheckableTag;

class CheckableTag extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checked: this.props.checked
        }
    }

    handleChange = (checked) => {
        this.setState({
            checked
        })
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.checked != this.state.checked) {
            this.setState({
                checked: nextProps.checked
            });
        }
    }
    

    componentDidUpdate(prevProps, prevState) {
        if(prevState.checked != this.state.checked) {
            this.props.onChange(
                    this.state.checked, 
                    this.props.children
                    );
        }
    }

    render() {
        return <AntdCheckbleTag 
                    {...this.props} 
                    checked={this.state.checked} 
                    onChange={this.handleChange}
                    />;
    }
}

export default CheckableTag;