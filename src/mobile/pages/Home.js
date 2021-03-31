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
    SvgIcon,
} from '@material-ui/core';
import { Header } from '../layout';
import { AccountCircle } from '@material-ui/icons';
import GangNam from '../images/강남버스.png';
import ByeongJeom from '../images/병점버스.png';
import AnSan from '../images/안산버스.png';
import MangPo from '../images/망포버스.png';
import SeongNam from '../images/성남버스.png';
import clsx from 'clsx';
import { GET_MY_INFO, GET_ROUTES_INFO } from '../gql/home/query';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import * as dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';

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

    const [getMyInfo, { data: myData, refetch: userRefetch }] = useLazyQuery(GET_MY_INFO, {
        fetchPolicy: 'no-cache',
    });
    const { loading, data: busData, refetch } = useQuery(GET_ROUTES_INFO, {
        variables: { month: dayjs(new Date()).format('YYYY-MM') },
    });

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
                    <Box
                        display="flex"
                        overflow="auto"
                        whiteSpace="nowrap"
                        textOverflow="ellipsis"
                        alignItems="center"
                    >
                        <Typography className={classes.notifyText}>
                            강남발 버스가 15분 전{' '}
                            <strong>성호아파트 후문 또래아동도서아울렛 앞</strong>
                            에서 출발했습니다.
                        </Typography>
                    </Box>
                </Box>
                <Box mb={1} px={2} height="25%" className={classes.board}>
                    <Box
                        height="20%"
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

                    <Box height="80%" overflow="auto">
                        <Box height="27%" mt={1}>
                            공지 1
                        </Box>
                        <Box height="27%" mt={1}>
                            공지 2
                        </Box>
                        <Box height="27%" mt={1}>
                            공지 3
                        </Box>
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
                        <CardMedia component="img" src={busImages[index].image} title="BusImage" />
                        <CardContent>
                            <Typography className={classes.busInfo} align="center">
                                {data.busNumber}
                            </Typography>
                            <Typography align="center">
                                신청자: {data.month.registerCount} / {data.limitCount}
                            </Typography>
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

const BusAlert = props => {
    return (
        <SvgIcon {...props}>
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M16 1a7 7 0 0 0-5.78 3.05l.02-.03C9.84 4 9.42 4 9 4c-4.42 0-8 .5-8 4v10c0 .88.39 1.67 1 2.22V22a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h8v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1.78c.61-.55 1-1.34 1-2.22v-3.08A7 7 0 0 0 16 1zM4.5 19a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM3 13V8h6c0 1.96.81 3.73 2.11 5H3zm10.5 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm2.5-6a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm-1-9h2v5h-2zm0 6h2v2h-2z" />
        </SvgIcon>
    );
};

export default Home;
