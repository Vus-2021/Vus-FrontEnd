import React from 'react';
import { AppBar, Toolbar, Box, Typography, ButtonBase } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import logo from '../images/Vatech_logo2.png';
import { useHistory } from 'react-router-dom';

const Header = props => {
    const classes = useStyles();
    const { isLogin, setLoginDialog, userData, userBusData } = props;
    const history = useHistory();

    return (
        <AppBar position="static" className={classes.headerBar}>
            <Toolbar style={{ height: '95%' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <Box display="flex" onClick={() => window.location.reload()}>
                        <img src={logo} width="127px" height="33px" alt="nothing" />
                    </Box>

                    <Box display="flex" alignSelf="flex-end">
                        <Box component={ButtonBase}>
                            <Typography
                                className={classes.loginText}
                                onClick={() => {
                                    if (isLogin) {
                                        history.push({
                                            pathname: '/myinfo',
                                            state: {
                                                userData: userData,
                                                userBusData: userBusData,
                                            },
                                        });
                                    } else setLoginDialog(true);
                                }}
                            >
                                {isLogin ? '내 정보 조회' : '로그인이 필요합니다.'}
                            </Typography>
                        </Box>
                        {isLogin && (
                            <Box ml={1} display="flex" alignItems="center">
                                <AccountCircle className={classes.iconSize} />
                            </Box>
                        )}
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

const useStyles = makeStyles(theme => ({
    headerBar: {
        backgroundColor: '#E43131',
        zIndex: theme.zIndex.drawer + 1,
        padding: 0,
        height: '9vh',
    },
    iconSize: {
        fontSize: '28px',
    },
    loginText: {
        fontWeight: '600',
        fontSize: '18px',
    },
}));

export default Header;
