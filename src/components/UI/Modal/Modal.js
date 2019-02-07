import React from 'react';
import classes from './Modal.css'
import Aux from '../../../hoc/Auxilliary'
import Backdrop from '../Backdrop/Backdrop'

const modal = (props) => {
    return (
        <Aux>
            <Backdrop show={props.showed} clicked={props.modalClosed}/>
        <div className={classes.Modal}
        style={{
            transform: props.showed ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: props.showed ? '1' : '0'
        }}>
            {props.children}
        </div>
        </Aux>
    );
};

export default modal;