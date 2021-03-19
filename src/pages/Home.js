import React, { useState } from 'react';
import SignUpDialog from './SignUp';
import LogInDialog from './LogIn';
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
    AppBar,
    Tabs,
    Tab,
} from '@material-ui/core';
import { Header } from '../layout';
import { AccountCircle, NotificationsNone, DeveloperBoard } from '@material-ui/icons';
import GangNam from '../images/강남버스.png';
import ByeongJeom from '../images/병점버스.png';
import AnSan from '../images/안산버스.png';
import MangPo from '../images/망포버스.png';
import SeongNam from '../images/성남버스.png';
import clsx from 'clsx';

const busDummyData = [
    {
        name: 'GangNam',
        busNumber: '77사 7082',
        image: GangNam,
        applicant: 30,
        limit: 45,
    },
    {
        name: 'ByeongJeom',
        busNumber: '74자 8614',
        image: ByeongJeom,
        applicant: 18,
        limit: 20,
    },
    {
        name: 'AnSan',
        busNumber: '76아 8440',
        image: AnSan,
        applicant: 39,
        limit: 45,
    },
    {
        name: 'MangPo',
        busNumber: '74자 8614',
        image: MangPo,
        applicant: 12,
        limit: 20,
    },
    {
        name: 'SeongNam',
        busNumber: '78아 5990',
        image: SeongNam,
        applicant: 11,
        limit: 20,
    },
];

const boardDummyData = {
    notice: [
        {
            title: '5월 1일부터 엑셀 신청은 받지 않습니다.',
        },
        {
            title: '4월 13일 강남노선 미운영',
        },
        {
            title: '신규 입사자 필독!',
        },
    ],
    board: [
        {
            title: '안산노선 버스 정차 상세내용',
        },
        {
            title: '강남노선 버스 정차 상세내용',
        },
        {
            title: '망포노선 버스 정차 상세내용',
        },
    ],
};
const Home = () => {
    const classes = HomeStyle();
    const [isLogin, setIsLogin] = useState(false);
    const [busData] = useState(busDummyData);
    const [boardNum, setNumber] = useState(0);
    const [signUp, setSignUp] = useState(false);
    const [logIn, setLogIn] = useState(false);

    const handleSignUpClose = value => {
        setSignUp(false);
        setIsLogin(value);
    };

    const handleLogInClose = value => {
        setLogIn(false);
        setIsLogin(value);
    };

    return (
        <div>
            <Header />
            <Box pl={3} pr={3} pt={2} className={classes.mainBox}>
                <Box height="4%" className={classes.requireLogin}>
                    <Box mr={1}>
                        <AccountCircle fontSize="large" />
                    </Box>
                    {isLogin ? '환영합니다.' : '로그인이 필요합니다.'}
                </Box>
                <Box mt={1} mb={1} height="3%" className={classes.getMyData}>
                    <Button disabled={!isLogin}>
                        <Box className={classes.buttonFont}>나의 신청현황 보기</Box>
                    </Button>
                </Box>
                <Box mt={1} height="38%" className={classes.chooseBus}>
                    <BusList busData={busData} />
                </Box>
                <Box height="3%" className={classes.moreBoard}>
                    <Button size="large">더보기</Button>
                </Box>
                <Box mb={1} height="27%" className={classes.board}>
                    <Box height="30%">
                        <AppBar position="static">
                            <Tabs
                                value={boardNum}
                                onChange={(e, newValue) => setNumber(newValue)}
                                aria-label="bus board tabs"
                                centered
                                variant="fullWidth"
                            >
                                <Tab
                                    label={
                                        <div>
                                            <NotificationsNone
                                                style={{ verticalAlign: 'middle' }}
                                            />
                                            &nbsp;&nbsp;공지사항
                                        </div>
                                    }
                                />
                                <Tab
                                    label={
                                        <div>
                                            <DeveloperBoard style={{ verticalAlign: 'middle' }} />
                                            &nbsp;&nbsp;게시판
                                        </div>
                                    }
                                />
                            </Tabs>
                        </AppBar>
                    </Box>
                    <TabPanel content={boardDummyData.notice} value={boardNum} index={0} />
                    <TabPanel content={boardDummyData.board} value={boardNum} index={1} />
                </Box>
                <Box mb={1} height="20%" className={classes.buttonList}>
                    <Button
                        className={clsx(classes.buttonCommon, classes.loginButton)}
                        variant="contained"
                        onClick={() => setLogIn(true)}
                    >
                        {isLogin ? '노선 신청하기' : '로그인'}
                    </Button>
                    <Button
                        className={clsx(classes.buttonCommon, classes.signUpButton)}
                        variant="contained"
                        onClick={() => setSignUp(true)}
                    >
                        {isLogin ? '로그아웃' : '회원가입'}
                    </Button>
                    <SignUpDialog open={signUp} onClose={handleSignUpClose} />
                    <LogInDialog open={logIn} onClose={handleLogInClose} />
                </Box>
            </Box>
        </div>
    );
};

const TabPanel = props => {
    const classes = HomeStyle();
    const { content, value, index } = props;

    const boardList = content.map((data, index) => (
        <Box key={index} pl={2} height="33%" className={classes.titleBox}>
            <Typography>{data.title}</Typography>
        </Box>
    ));
    return (
        <React.Fragment>
            {value === index && (
                <Box height="70%" className={classes.tabBox}>
                    {boardList}
                </Box>
            )}
        </React.Fragment>
    );
};

const BusList = props => {
    const classes = HomeStyle();
    const { busData } = props;
    const busList = busData.map(data => (
        <GridListTile key={data.name}>
            <Card elevation={5} className={classes.busCard}>
                <CardActionArea className={classes.cardAction}>
                    <CardMedia component="img" src={data.image} title="BusImage" />
                    <CardContent>
                        <Typography className={classes.busInfo} align="center">
                            {data.busNumber}
                        </Typography>
                        <Typography align="center">
                            신청자: {data.applicant} / {data.limit}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </GridListTile>
    ));
    return (
        <GridList cellHeight="auto" className={classes.busList} cols={2}>
            {busList}
        </GridList>
    );
};

export default Home;
