import React from 'react';

import { Modal } from 'antd';
import './DeleteConfirmModal.less';

class DeleteConfirmModal extends React.Component {

    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOk = this.handleOk.bind(this);
    }
    
    handleCancel() {
        this.props.onCancel();
    }

    handleOk() {
        this.props.onOk();
    }

    render() {
        return (
            <Modal 
                title="删除文件"
                visible={this.props.visible}
                cancelText="取消"
                okText="确认"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                className={`custom-delete-modal-container`}
                >
                <p className={`tint`}>删除所选文件后将无法恢复</p>
                <p className={`confirm`}>是否确定要删除</p>
            </Modal>
        );
    }
}

export default DeleteConfirmModal;
