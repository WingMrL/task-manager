import React from 'react';
import { connect } from 'react-redux';

import NormalIcon from './NormalIcon';

class InnerGroupIcon extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { icons } = this.props;
        
        let normalIconList;
        if(icons) {
            normalIconList = icons.map((value) => {
                return <NormalIcon 
                            key={value._id}
                            icon={value}
                            />
            });
        }
        return (
            <ul style={{
                "display": "flex",
                "justifyContent": "flex-start",
                "flexWrap": "wrap",
                "marginTop": "4px",
                "width": "1100px",
                "minHeight": "200px",
            }}>
                {normalIconList}
            </ul>
        );
    }
}

const matStateToProps = (state, ownProps) => ({
    icons: state.icons
});

InnerGroupIcon = connect(matStateToProps)(InnerGroupIcon);

export default InnerGroupIcon;