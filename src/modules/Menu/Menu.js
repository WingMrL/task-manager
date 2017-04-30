import React from 'react';

import styles from './Menu.css';

class Menu extends React.Component {
    render() {
        return (
            <div className={styles["menu-container"]}>
                {this.props.children}
            </div>
        );
    }
}

export default Menu;