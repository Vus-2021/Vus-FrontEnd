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

    const headerButtonClick = () => {
        if (isLogin) {
            if (userData.type === 'ADMIN') {
                history.push('/admin');
            } else {
                history.push({
                    pathname: '/myinfo',
                    state: {
                        userData: userData,
                        userBusData: userBusData,
                    },
                });
            }
        } else setLoginDialog(true);
    };

    return (
        <AppBar position="static" className={classes.headerBar}>
            <Toolbar style={{ height: '100%' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <Box display="flex" onClick={() => window.location.reload()}>
                        <ButtonBase>
                            <img src={logo} width="127px" height="33px" alt="nothing" />
                        </ButtonBase>
                    </Box>

                    <Box display="flex" alignItems="center">
                        <Box component={ButtonBase}>
                            {isLogin != null ? (
                                <Typography
                                    className={classes.loginText}
                                    onClick={headerButtonClick}
                                >
                                    {isLogin
                                        ? userData.type === 'ADMIN'
                                            ? '관리자모드 열기'
                                            : '내 정보 조회'
                                        : '로그인'}
                                </Typography>
                            ) : (
                                localStorage.getItem('accessToken') && (
                                    <Typography
                                        className={classes.loginText}
                                        onClick={() => {
                                            localStorage.clear();
                                            window.location.reload();
                                        }}
                                    >
                                        로그아웃
                                    </Typography>
                                )
                            )}
                        </Box>

                        {isLogin && userData.type !== 'ADMIN' && (
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
        height: '60px',
    },
    iconSize: {
        fontSize: '28px',
    },
    loginText: {
        fontWeight: '600',
        fontSize: '18px',
    },
    menuIcon: {
        color: 'white',
        fontSize: '30px',
    },
}));

export default Header;
