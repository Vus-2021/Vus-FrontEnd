import React from 'react';
import { Box, Typography, IconButton } from '@material-ui/core';
import { Backspace } from '@material-ui/icons';
import { createUseStyles } from 'react-jss';

const Header2 = props => {
    const { headerText, height, handleClose } = props;
    const headerHeight = height ? height : '5%';
    const classes = useStyles();

    return (
        <Box height={headerHeight} minHeight="30px" className={classes.headerBox}>
            <Box width="20%">
                <IconButton color="inherit" onClick={handleClose}>
                    &nbsp;&nbsp;
                    <Backspace />
                </IconButton>
            </Box>
            <Box width="60%">
                <Typography align="center" className={classes.headerTitle}>
                    {headerText}
                </Typography>
            </Box>
            <Box width="20%"></Box>
        </Box>
    );
};

const useStyles = createUseStyles({
    headerBox: {
        backgroundColor: '#E43131',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white',
    },
    headerTitle: {
        '&.MuiTypography-body1': {
            letterSpacing: '4px',
            fontSize: '17px',
        },
    },
});

export default Header2;
