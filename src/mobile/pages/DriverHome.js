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
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import { GET_MY_INFO, GET_DETAIL_ROUTES, GET_BUS_LOCATION } from '../gql/home/query';
import { CREATE_DRIVER_LOCATION } from '../gql/home/mutation';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';

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
    const [getBusLocation, { data: busLocationData }] = useLazyQuery(GET_BUS_LOCATION);
    const [createDriverLocation, { data: createLocationData }] = useMutation(
        CREATE_DRIVER_LOCATION,
        {
            onCompleted() {
                if (where === detailRoutes.length) window.location.reload();
            },
        },
    );

    const logoutClick = () => {
        localStorage.clear();
        window.location.reload();
    };

    const handleLogInClose = value => {
        setOpenLogin(false);
        if (value) {
            refetchMyData();
        }
    };

    const nextButtonClick = next => {
        setWhere(next);
        createDriverLocation({
            variables: {
                input: {
                    preKey: next === 0 ? null : detailRoutes[next - 1].partitionKey,
                    destinationKey:
                        next === detailRoutes.length ? null : detailRoutes[next].partitionKey,
                    locationIndex: next === detailRoutes.length ? -1 : next,
                },
            },
        });
    };

    const prevButtonClick = prev => {
        setWhere(prev);
        createDriverLocation({
            variables: {
                input: {
                    preKey:
                        prev + 1 === detailRoutes.length
                            ? null
                            : detailRoutes[prev + 1].partitionKey,
                    destinationKey: prev === -1 ? null : detailRoutes[prev].partitionKey,
                    locationIndex: prev,
                },
            },
        });
    };

    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            if (myData) {
                const { success, message, data } = myData.getMyInformation;
                if (success) {
                    setUserData(data);
                    if (data.routeInfo[0]) {
                        getDetailRoutes({
                            variables: { route: data.routeInfo[0].route },
                        });
                        getBusLocation({
                            variables: { route: data.routeInfo[0].route, currentLocation: true },
                        });
                    }
                } else console.log(message);
            }
        }
    }, [myData, getDetailRoutes, getBusLocation]);

    useEffect(() => {
        if (detailRouteData) {
            const { success, message, data } = detailRouteData.getDetailRoutes;
            if (success) {
                setDetailRoutes(data);
            } else console.log(message);
        }
    }, [detailRouteData]);

    useEffect(() => {
        if (busLocationData) {
            const { success, message, data } = busLocationData.getDetailRoutes;
            console.log(data);
            if (success && data[0]) {
                setWhere(data[0].locationIndex);
            } else console.log(message);
        }
    }, [busLocationData]);

    useEffect(() => {
        if (createLocationData) {
            const { success, message } = createLocationData.createDriverLocation;
            if (!success) console.log(message);
        }
    }, [createLocationData]);

    return (
        <div>
            <Header />
            <Box px={3} py={2} className={classes.mainBox}>
                {userData.type === 'DRIVER' || userData.type == null ? (
                    userData.type == null ? (
                        <BeforeLogin setOpenLogin={setOpenLogin} />
                    ) : (
                        <React.Fragment>
                            <Box height="4%" className={classes.requireLogin} mb={1.5}>
                                <Box mr={1}>
                                    <AccountCircle fontSize="large" />
                                </Box>
                                환영합니다. {userData.name} 기사님
                            </Box>
                            <Box height="3%" display="flex" justifyContent="flex-end" mb={1}>
                                <Box component={ButtonBase} className={classes.buttonBase}>
                                    <Typography
                                        className={classes.subButton}
                                        onClick={() => {
                                            history.push({
                                                pathname: '/businfo',
                                                state: {
                                                    busData: { route: userData.routeInfo[0].route },
                                                },
                                            });
                                        }}
                                    >
                                        노선보기
                                    </Typography>
                                </Box>
                                <Box component={ButtonBase} className={classes.buttonBase}>
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
                                        onClick={() => prevButtonClick(where - 1)}
                                    >
                                        <Typography className={classes.buttonText}>이전</Typography>
                                    </Button>
                                </Box>
                                <Box width="65%" height="80%">
                                    <Button
                                        variant="contained"
                                        className={clsx(classes.nextButton, classes.signUpButton)}
                                        onClick={() => nextButtonClick(where + 1)}
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
                    <NotAuthorized />
                )}
            </Box>
            <LogInDialog open={openLogin} onClose={handleLogInClose} />
        </div>
    );
};

const BeforeLogin = props => {
    const { setOpenLogin } = props;
    const classes = DriverHomeStyle();
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="80%"
        >
            <Box mb={2} display="flex" alignItems="center">
                <Typography>
                    <strong>버스 기사용</strong> 페이지입니다.
                </Typography>
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
    );
};

const NotAuthorized = () => {
    const classes = DriverHomeStyle();
    const history = useHistory();
    return (
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
            <Box width="70%" mb={1}>
                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    className={classes.loginButton}
                    onClick={() => history.push('/')}
                >
                    홈페이지로 돌아가기
                </Button>
            </Box>
            <Box width="70%">
                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    className={classes.signUpButton}
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = '/driver';
                    }}
                >
                    로그아웃
                </Button>
            </Box>
        </Box>
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
