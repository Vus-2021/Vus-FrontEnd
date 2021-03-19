import React from 'react';
import { Dialog } from '@material-ui/core';

const LogIn = props => {
    const { open, onClose } = props;

    const handleClose = () => {
        onClose(false);
    };

    return (
        <Dialog open={open} maxWidth="xs" onClose={handleClose}>
            hello!
        </Dialog>
    );
};

export default LogIn;
