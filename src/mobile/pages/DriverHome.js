import React, { useState, useEffect, useRef } from 'react';
import Header from '../layout/Header';
import DriverHomeStyle from '../styles/DriverHomeStyle';
import LogInDialog from './LogIn';
import { Box, Button, Typography, ButtonBase, Paper, CircularProgress } from '@material-ui/core';
import {
    Timeline,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
    TimelineConnector,
    TimelineDot,
    TimelineContent,
} from '@material-ui/lab';
import { AccountCircle, DirectionsBus, Error, Send } from '@material-ui/icons';
import ArrowDown from '../components/ArrowDown';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { GET_MY_INFO, GET_DETAIL_ROUTES } from '../gql/home/query';
import clsx from 'clsx';

const DriverHome = ({ history }) => {
    const classes = DriverHomeStyle();
    const [userData, setUserData] = useState({});
    const [openLogin, setOpenLogin] = useState(false);
    const [detailRoutes, setDetailRoutes] = useState([]);
    const [where, setWhere] = useState(-1);

    const { data: myData, refetch: refetchMyData } = useQuery(GET_MY_INFO, {
        fetchPolicy: 'no-cache',
    });

    const [getDetailRoutes, { data: detailRouteData }] = useLazyQuery(GET_DETAIL_ROUTES);

    const logoutClick = () => {
        localStorage.clear();
        window.location.href = '/driver';
    };

    const goHome = () => {
        history.push('/');
    };

    const handleLogInClose = value => {
        setOpenLogin(false);
        if (value) {
            refetchMyData();
        }
    };

    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            if (myData) {
                const { success, message, data } = myData.getMyInformation;
                if (success) {
                    setUserData(data);
                    if (data.routeInfo[0])
                        getDetailRoutes({ variables: { route: data.routeInfo[0].route } });
                } else console.log(message);
            }
        }
    }, [myData, getDetailRoutes]);

    useEffect(() => {
        if (detailRouteData) {
            const { success, message, data } = detailRouteData.getDetailRoutes;
            if (success) {
                setDetailRoutes(data);
            } else console.log(message);
        }
    }, [detailRouteData]);

    return (
        <div>
            <Header />
            <Box px={3} py={2} className={classes.mainBox}>
                {userData.type === 'DRIVER' || userData.type == null ? (
                    userData.type == null ? (
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            height="80%"
                        >
                            <Box mb={2} display="flex" alignItems="center">
                                <Typography>버스 기사용 페이지입니다.</Typography>
                            </Box>
                            <Box width="70%">
                                <Button
                                    variant="contained"
                                    size="large"
                                    className={classes.loginButton}
                                    fullWidth
                                    onClick={() => setOpenLogin(true)}
                                >
                                    로그인
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <React.Fragment>
                            <Box height="4%" className={classes.requireLogin} mb={1.5}>
                                <Box mr={1}>
                                    <AccountCircle fontSize="large" />
                                </Box>
                                환영합니다. {userData.name} 기사님
                            </Box>
                            <Box height="3%" display="flex" justifyContent="flex-end" mb={1}>
                                <Box px={1} mr={1} component={ButtonBase}>
                                    <Typography
                                        className={classes.subButton}
                                        onClick={() => {
                                            history.push({
                                                pathname: '/businfo',
                                                state: { busName: userData.routeInfo[0].route },
                                            });
                                        }}
                                    >
                                        노선보기
                                    </Typography>
                                </Box>
                                <Box px={1} component={ButtonBase}>
                                    <Typography className={classes.subButton} onClick={logoutClick}>
                                        로그아웃
                                    </Typography>
                                </Box>
                            </Box>
                            <Box height="65%">
                                <Paper elevation={5} className={classes.watchRoute}>
                                    <Box
                                        display="flex"
                                        alignItems={
                                            detailRoutes.length === 0 ? 'center' : 'flex-start'
                                        }
                                        justifyContent={
                                            detailRoutes.length === 0 ? 'center' : 'flex-start'
                                        }
                                        height="100%"
                                        width="100%"
                                        overflow="auto"
                                    >
                                        <Box py={1}>
                                            {detailRoutes.length > 0 ? (
                                                <Timeline className={classes.timeLine}>
                                                    {detailRoutes.map((data, index) => (
                                                        <TimelineItem key={data.location}>
                                                            <TimelineOppositeContent
                                                                className={classes.timeLineOpposite}
                                                            >
                                                                <Typography>
                                                                    {data.boardingTime}
                                                                </Typography>
                                                            </TimelineOppositeContent>
                                                            <BusLocationTimeLine
                                                                where={where}
                                                                index={index}
                                                                length={detailRoutes.length}
                                                                data={data}
                                                            />
                                                        </TimelineItem>
                                                    ))}
                                                </Timeline>
                                            ) : (
                                                <CircularProgress color="secondary" />
                                            )}
                                        </Box>
                                    </Box>
                                </Paper>
                            </Box>
                            <Box height="15%" display="flex" alignItems="center">
                                <Box mr={2} width="35%" height="80%">
                                    <Button
                                        variant="contained"
                                        className={clsx(classes.prevButton, classes.registerButton)}
                                        disabled={where < 0}
                                        onClick={() => setWhere(where - 1)}
                                    >
                                        <Typography className={classes.buttonText}>이전</Typography>
                                    </Button>
                                </Box>
                                <Box width="65%" height="80%">
                                    <Button
                                        variant="contained"
                                        className={clsx(classes.nextButton, classes.signUpButton)}
                                        onClick={() => setWhere(where + 1)}
                                        disabled={where === detailRoutes.length}
                                    >
                                        <Typography className={classes.buttonText}>
                                            {where === -1
                                                ? '출발'
                                                : where === detailRoutes.length - 1
                                                ? '도착'
                                                : '다음'}
                                        </Typography>
                                    </Button>
                                </Box>
                            </Box>
                        </React.Fragment>
                    )
                ) : (
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        height="80%"
                    >
                        <Box mb={2} display="flex" alignItems="center">
                            <Error />
                            &nbsp; 권한이 없습니다.
                        </Box>
                        <Box width="70%">
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                className={classes.signUpButton}
                                onClick={goHome}
                            >
                                홈페이지로 돌아가기
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
            <LogInDialog open={openLogin} onClose={handleLogInClose} />
        </div>
    );
};

const BusLocationTimeLine = props => {
    const { where, index, length, data } = props;
    const classes = DriverHomeStyle();
    const timeline = useRef();

    useEffect(() => {
        if (timeline.current) {
            timeline.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            });
        }
    }, [where]);

    return (
        <React.Fragment>
            <TimelineSeparator>
                <Box width="35px" display="flex" justifyContent="center">
                    <TimelineDot
                        className={
                            where === index ? classes.timeLineBigDotIcon : classes.timeLineDotIcon
                        }
                        variant="outlined"
                    >
                        {index !== length - 1 ? (
                            where === index ? (
                                <DirectionsBus className={classes.iconBigSize} />
                            ) : (
                                <ArrowDown className={classes.iconSize} />
                            )
                        ) : (
                            <Send
                                className={where === index ? classes.iconBigSize : classes.iconSize}
                            />
                        )}
                    </TimelineDot>
                </Box>

                {index !== length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
                <Box minHeight="28vh">
                    <Paper
                        className={classes.timeLineContentPaper}
                        elevation={where === index ? 20 : 3}
                        ref={where === index ? timeline : null}
                    >
                        <Box px={2} py={1}>
                            <Typography
                                className={
                                    where === index ? classes.locationBigText : classes.locationText
                                }
                            >
                                {data.location}
                            </Typography>
                        </Box>
                    </Paper>
                </Box>
            </TimelineContent>
        </React.Fragment>
    );
};

export default DriverHome;
