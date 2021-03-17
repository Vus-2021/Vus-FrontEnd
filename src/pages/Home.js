import React, { useState } from 'react';
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

const testData = [
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

const Home = () => {
    const classes = HomeStyle();
    const [isLogin] = useState(false);
    const [busData] = useState(testData);
    const [boardNum, setNumber] = useState(0);

    return (
        <div>
            <Header />
            <Box pl={3} pr={3} pt={2} className={classes.mainBox}>
                <Box className={classes.requireLogin}>
                    <Box mr={1}>
                        <AccountCircle fontSize="large" />
                    </Box>
                    {isLogin ? '환영합니다.' : '로그인이 필요합니다.'}
                </Box>
                <Box className={classes.getMyData}>
                    <Button disabled={!isLogin}>
                        <Box className={classes.buttonFont}>나의 신청현황 보기</Box>
                    </Button>
                </Box>
                <Box mt={1} className={classes.chooseBus}>
                    <BusList busData={busData} />
                </Box>
                <Box height="3%" className={classes.moreBoard}>
                    <Button size="large">더보기</Button>
                </Box>
                <Box mb={1} className={classes.board}>
                    <Box height="30%">
                        <AppBar position="static">
                            <Tabs
                                value={boardNum}
                                onChange={(e, newValue) => setNumber(newValue)}
                                aria-label="simple tabs example"
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
                    <TabPanel value={boardNum} index={0} />
                    <TabPanel value={boardNum} index={1} />
                </Box>
                <Box mb={1} className={classes.buttonList}>
                    <Button
                        className={clsx(classes.buttonCommon, classes.loginButton)}
                        variant="contained"
                    >
                        로그인
                    </Button>
                    <Button
                        className={clsx(classes.buttonCommon, classes.signUpButton)}
                        variant="contained"
                    >
                        회원가입
                    </Button>
                </Box>
            </Box>
        </div>
    );
};

const TabPanel = props => {
    const classes = HomeStyle();
    const { value, index } = props;

    return (
        <React.Fragment>
            {value === index && (
                <Box height="70%" className={classes.tabBox} p={1}>
                    <Box height="33%">test!!</Box>
                    <Box height="33%">test!!</Box>
                    <Box height="33%">test!!</Box>
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
