import React from 'react';
import { Button } from 'antd';
import UploadModal from '../Modal/UploadModal';

class UploadBtn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalKey: Date.now().toString(),
            uplodaModalVisible: false,
        };

    }

    onClick = () => {
        this.setState({
            uplodaModalVisible: true
        });
    }

    onCancel = () => {
        this.setState({
            uplodaModalVisible: false,
            modalKey: Date.now().toString()
        });
    }

    render() {
        let { reflashPage } = this.props;
        return (
            <div style={{
                marginLeft: 220
            }}>
                <Button 
                    type="primary"
                    style={{
                        width: 120,
                        height: 48,
                        fontSize: 18,
                        borderRadius: 100,
                        fontWeight: 300,
                    }}
                    onClick={this.onClick}
                >
                    上传
                </Button>
                <UploadModal 
                    visible={this.state.uplodaModalVisible}
                    onCancel={this.onCancel}
                    key={this.state.modalKey}
                    groupId={this.props.groupId}
                    reflashPage={reflashPage}
                    />
            </div>
        );
    }
}

export default UploadBtn;