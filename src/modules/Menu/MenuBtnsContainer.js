import React from 'react';

import styles from './MenuBtnsContainer.css';

class MenuBtnsContainer extends React.Component {
    render() {
        return (
            <div className={styles['menu-btn-container']}>
                    {this.props.children}
            </div>
        );
    }
}

export default MenuBtnsContainer;