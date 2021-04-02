import React, { useState, useEffect } from 'react';
import { SignUpDialog, LogInDialog, RegisterBusDialog } from './index';
import HomeStyle from '../styles/HomeStyle';
import {
    Box,
    Button,
    GridList,
    GridListTile,
    Card,
    CardMedia,
    Typography,
    CardContent,
    CardActionArea,
    Divider,
    CircularProgress,
    Paper,
} from '@material-ui/core';
import BusAlert from '../components/BusAlert';
import { Header } from '../layout';
import { AccountCircle } from '@material-ui/icons';
import GangNam from '../images/강남버스.png';
import ByeongJeom from '../images/병점버스.png';
import AnSan from '../images/안산버스.png';
import MangPo from '../images/망포버스.png';
import SeongNam from '../images/성남버스.png';
import clsx from 'clsx';
import { GET_MY_INFO, GET_ROUTES_INFO, GET_ADMIN_NOTICE } from '../gql/home/query';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import * as dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import { useMediaQuery } from '@material-ui/core';

const busImages = [
    {
        name: '강남',
        image: GangNam,
    },
    {
        name: '망포',
        image: MangPo,
    },
    {
        name: '병점',
        image: ByeongJeom,
    },
    {
        name: '성남',
        image: SeongNam,
    },
    {
        name: '안산',
        image: AnSan,
    },
];

const Home = () => {
    const classes = HomeStyle();
    const smallDevice = useMediaQuery('(max-height: 600px)');

    const [isLogin, setIsLogin] = useState(false); //로그인 상태 여부
    const [signUpDialog, setSignUpDialog] = useState(false); //회원가입 Dialog open 여부
    const [loginDialog, setLoginDialog] = useState(false); //로그인 Dialog open 여부
    const [registerBusDialog, setRegisterBusDialog] = useState(false); //버스신청 Dialog open 여부
    const [userData, setUserData] = useState({
        //user의 정보를 담음.
        name: '',
        userId: '',
        type: '',
    });
    const [userBusData, setUserBusData] = useState([]);
    const [routeInfo, setRouteInfo] = useState([]);
    const [notice, setNotice] = useState([]);

    const [getMyInfo, { data: myData, refetch: userRefetch }] = useLazyQuery(GET_MY_INFO, {
        fetchPolicy: 'no-cache',
    });
    const { loading, data: busData, refetch } = useQuery(GET_ROUTES_INFO, {
        variables: { month: dayjs(new Date()).format('YYYY-MM') },
    });

    const { loading: noticeLoading, data: noticeData } = useQuery(GET_ADMIN_NOTICE);

    const handleSignUpClose = value => {
        setSignUpDialog(false);
    };

    const handleLogInClose = value => {
        setLoginDialog(false);
        if (value) getMyInfo();
    };

    const handleRegisterBusClose = () => {
        setRegisterBusDialog(false);
        refetch();
    };

    const firstButtonClick = () => {
        if (isLogin) {
            setRegisterBusDialog(true);
        } else setLoginDialog(true);
    };

    const secondButtonClick = () => {
        if (isLogin) {
            localStorage.clear();
            setIsLogin(false);
            window.location.reload();
        } else setSignUpDialog(true);
    };

    // 로그인 성공 후 유저의 데이터를 불러옴
    useEffect(() => {
        if (myData) {
            if (myData.getMyInformation.success) {
                const { name, userId, type, routeInfo } = myData.getMyInformation.data;
                setIsLogin(true);
                setUserData({
                    name: name,
                    userId: userId,
                    type: type,
                });
                setUserBusData(routeInfo);
            }
        }

        return () =>
            setUserData({
                name: '',
                userId: '',
                type: '',
            });
    }, [myData]);

    //버스 데이터를 불러옴
    useEffect(() => {
        if (busData) {
            const { success, message, data } = busData.getRoutesInfo;
            if (success) {
                setRouteInfo(data);
            } else console.log(message);
        }
    }, [busData]);

    useEffect(() => {
        if (localStorage) getMyInfo();
    }, [getMyInfo]);

    useEffect(() => {
        if (noticeData) {
            const { success, message, data } = noticeData.getAdminNotice;
            if (success) {
                setNotice(data);
            } else console.log(message);
        }
    }, [noticeData]);

    return (
        <div>
            <Header />
            <Box pl={3} pr={3} pt={2} pb={2} className={classes.mainBox}>
                <Box height="4%" className={classes.requireLogin}>
                    <Box mr={1}>
                        <AccountCircle fontSize="large" />
                    </Box>
                    {isLogin ? `환영합니다. ${userData.name} 님` : '로그인이 필요합니다.'}
                </Box>
                <Box mt={2} height="38%" className={classes.chooseBus}>
                    <BusList routeInfo={routeInfo} />
                </Box>
                <Box
                    mb={1}
                    px={2}
                    height="7%"
                    minHeight="40px"
                    className={classes.busNotify}
                    display="flex"
                >
                    <Box mr={1} display="flex" alignItems="center">
                        <BusAlert color="secondary" />
                    </Box>
                    <Box display="flex" overflow="auto" whiteSpace="nowrap" alignItems="center">
                        <Typography className={classes.notifyText}>
                            강남발 버스가 15분 전{' '}
                            <strong>성호아파트 후문 또래아동도서아울렛 앞</strong>
                            에서 출발했습니다.
                        </Typography>
                    </Box>
                </Box>
                <Box mb={1} px={2} height="25%" className={classes.board} minHeight="50px">
                    <Box
                        height="15%"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Typography className={classes.boardTitle}>공지사항</Typography>
                        <Button>
                            <Typography className={classes.boardMore}>더 보기</Typography>
                        </Button>
                    </Box>
                    <Divider className={classes.boardDivider} />

                    <Box height="85%">
                        {noticeLoading ? (
                            <Box
                                height="100%"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <CircularProgress color="secondary" />
                            </Box>
                        ) : (
                            notice.map((data, index) => (
                                <React.Fragment key={data.notice + index}>
                                    <Box
                                        height="32%"
                                        width="100%"
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="flex-start"
                                        justifyContent="flex-start"
                                        component={CardActionArea}
                                        onClick={() => console.log(data.partitionKey)}
                                    >
                                        <Box
                                            height={!smallDevice ? '60%' : '100%'}
                                            display="flex"
                                            alignItems="center"
                                            width="100%"
                                        >
                                            <Typography noWrap className={classes.noticeTitle}>
                                                {data.notice}
                                            </Typography>
                                        </Box>
                                        {!smallDevice && (
                                            <Box height="40%">
                                                <Typography noWrap className={classes.noticeDate}>
                                                    {data.createdAt}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>

                                    <Divider />
                                </React.Fragment>
                            ))
                        )}
                    </Box>
                </Box>
                <Box mb={1} height="20%" className={classes.buttonList}>
                    <Button
                        className={clsx(classes.buttonCommon, classes.loginButton)}
                        variant="contained"
                        onClick={firstButtonClick}
                        disabled={isLogin && loading}
                    >
                        {isLogin ? '노선 신청/취소' : '로그인'}
                    </Button>
                    <Button
                        className={clsx(classes.buttonCommon, classes.signUpButton)}
                        variant="contained"
                        onClick={secondButtonClick}
                    >
                        {isLogin ? '로그아웃' : '회원가입'}
                    </Button>
                    <LogInDialog open={loginDialog} onClose={handleLogInClose} />
                    <SignUpDialog open={signUpDialog} onClose={handleSignUpClose} />
                    <RegisterBusDialog
                        open={registerBusDialog}
                        onClose={handleRegisterBusClose}
                        routeInfo={routeInfo}
                        userBusData={userBusData}
                        userRefetch={userRefetch}
                    />
                </Box>
            </Box>
        </div>
    );
};

const BusList = props => {
    const classes = HomeStyle();
    const history = useHistory();
    const { routeInfo } = props;

    const smallDevice = useMediaQuery('(max-height: 600px)');

    const busList = routeInfo.map((data, index) => (
        <GridListTile key={index}>
            <Box minHeight="150px" height="100%" overflow="auto">
                <Card elevation={5} className={classes.busCard}>
                    <CardActionArea
                        className={classes.cardAction}
                        onClick={() =>
                            history.push({
                                pathname: './businfo',
                                state: { busName: busImages[index].name },
                            })
                        }
                    >
                        <Paper elevation={3}>
                            <CardMedia
                                component="img"
                                src={busImages[index].image}
                                title="BusImage"
                            />
                        </Paper>
                        <CardContent>
                            <Box mb={0.3}>
                                <Paper elevation={2} className={classes.busInfo}>
                                    <Typography align="center" className={classes.busNumber}>
                                        {data.busNumber}
                                    </Typography>
                                </Paper>
                            </Box>
                            <Box>
                                <Typography
                                    align="center"
                                    className={smallDevice ? classes.countText : null}
                                >
                                    신청자: {data.month.registerCount} / {data.limitCount}
                                </Typography>
                            </Box>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Box>
        </GridListTile>
    ));
    return (
        <GridList cellHeight="auto" className={classes.busList} cols={2}>
            {busList}
        </GridList>
    );
};

export default Home;
