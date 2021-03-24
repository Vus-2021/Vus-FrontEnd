import React from 'react';
import { createUseStyles } from 'react-jss';
import logo from '../images/Vatech_logo.png';
import { Box, IconButton } from '@material-ui/core';
import { Menu, Clear } from '@material-ui/icons';

const Header = props => {
    const { adminName, openDrawer, setOpenDrawer } = props;
    const classes = useStyles();

    const menuClick = () => {
        setOpenDrawer(!openDrawer);
    };

    return (
        <React.Fragment>
            <Box height="60px" width="100%" className={classes.headerBox}>
                <Box ml={1} className={classes.IconLogo}>
                    {props.adminName && (
                        <Box>
                            <IconButton onClick={menuClick}>
                                {openDrawer ? (
                                    <Clear style={{ color: 'white' }} fontSize="large" />
                                ) : (
                                    <Menu style={{ color: 'white' }} fontSize="large" />
                                )}
                            </IconButton>
                        </Box>
                    )}
                    <Box>
                        <img src={logo} width="115px" height="30px" alt="nothing" />
                    </Box>
                </Box>
                <Box mr={2} className={classes.adminName}>
                    {adminName && `환영합니다. ${adminName} 관리자님`}
                </Box>
            </Box>
            <Box height="60px"></Box>
        </React.Fragment>
    );
};

const useStyles = createUseStyles({
    headerBox: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#D81717',
        position: 'absolute',
    },
    IconLogo: {
        display: 'flex',
        alignItems: 'center',
    },
    adminName: {
        color: 'white',
        fontSize: '18px',
        fontWeight: '700',
        letterSpacing: '1px',
    },
});

export default Header;
