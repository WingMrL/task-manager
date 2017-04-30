import React from 'react';

import { Modal, Input } from 'antd';
import './RenameModal.less';

class RenameModal extends React.Component {

    constructor(props) {
        super(props);
    }
    
    handleCancel = () => {
        this.props.onCancel();
    }

    handleOk = () => {
        this.props.onOk();
    }

    handleOnChange = (e) => {
        this.props.onChange(e.target.value);
    }

    render() {
        let { value, visible } = this.props
        return (
            <Modal 
                title="重命名"
                visible={visible}
                cancelText="取消"
                okText="确认"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                className={`custom-rename-modal-container`}
                >
                <Input 
                    size="large"
                    className={`input-name`}
                    value={value}
                    onChange={this.handleOnChange}
                    />
                <p className={`confirm`}>请输入文件名</p>
            </Modal>
        );
    }
}

export default RenameModal;
