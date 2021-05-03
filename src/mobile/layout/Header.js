import React, { useState, useEffect, useContext } from 'react';
import { AppBar, Toolbar, Box, Typography, ButtonBase } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import logo from '../images/Vatech_logo2.png';
import { useHistory } from 'react-router-dom';
import { DeviceMode } from '../../App';

const Header = props => {
    const deviceMode = useContext(DeviceMode);
    const classes = useStyles(deviceMode);
    const { isLogin, setLoginDialog, userData, userBusData } = props;
    const history = useHistory();

    const [modeText, setModeText] = useState('');

    const headerButtonClick = () => {
        if (isLogin) {
            if (userData.type === 'ADMIN') {
                history.push('/admin');
            } else if (userData.type === 'DRIVER') {
                history.push('/driver');
            } else {
                history.push({
                    pathname: '/myinfo',
                    state: {
                        userData: userData,
                        userBusData: userBusData,
                    },
                });
            }
        } else {
            if (userData.type === 'DRIVER') history.goBack();
            else setLoginDialog(true);
        }
    };

    useEffect(() => {
        if (isLogin) {
            if (userData.type === 'ADMIN') setModeText('관리자용 열기');
            else if (userData.type === 'DRIVER') setModeText('버스기사용 열기');
            else setModeText('내 정보 조회');
        } else {
            if (userData.type === 'DRIVER') setModeText('사용자용 열기');
            else setModeText('로그인');
        }
    }, [isLogin, userData]);

    return (
        <AppBar position="static" className={classes.headerBar}>
            <Toolbar style={{ height: '100%' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <Box display="flex" onClick={() => window.location.reload()}>
                        <ButtonBase>
                            <img
                                src={logo}
                                width={deviceMode ? '96px' : '127px'}
                                height={deviceMode ? '25px' : '33px'}
                                alt="nothing"
                            />
                        </ButtonBase>
                    </Box>

                    <Box display="flex" alignItems="center">
                        <Box component={ButtonBase}>
                            <Typography className={classes.loginText} onClick={headerButtonClick}>
                                {modeText}
                            </Typography>
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
        backgroundColor: '#D81717',
        zIndex: theme.zIndex.drawer + 1,
        padding: 0,
        height: props => (props ? '56px' : '64px'),
    },
    iconSize: {
        fontSize: '28px',
    },
    loginText: {
        fontWeight: '600',
        fontSize: props => (props ? '16px' : '18px'),
    },
    menuIcon: {
        color: 'white',
        fontSize: '30px',
    },
}));

export default Header;
