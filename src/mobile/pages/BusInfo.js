import React, { useEffect, useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    AppBar,
    Typography,
    Paper,
    CircularProgress,
    Dialog,
    TextField,
    Drawer,
    ButtonBase,
} from '@material-ui/core';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineDot,
    TimelineConnector,
    TimelineContent,
    TimelineOppositeContent,
} from '@material-ui/lab';
import {
    Map,
    PinDrop,
    Send,
    DirectionsBus,
    KeyboardArrowUp,
    KeyboardArrowDown,
} from '@material-ui/icons';
import ArrowDown from '../components/ArrowDown';
import Header2 from '../layout/Header2';
import BusInfoStyle from '../styles/BusInfoStyle';
import BusAlert from '../components/BusAlert';
import { useQuery } from '@apollo/react-hooks';
import { GET_DETAIL_ROUTES, GET_DRIVER_NOTICE } from '../gql/businfo/query';
import SPRITE_IMAGE from '../images/MarkerImages.png';
import ARRIVAL_IMAGE from '../images/ArrivalMarker.png';
import * as dayjs from 'dayjs';
import clsx from 'clsx';

const { kakao } = window;

const BusInfo = ({ history, location }) => {
    const classes = BusInfoStyle();
    const { route: busName, busNumber, driver } = location.state.busData;
    const [boardNum, setNumber] = useState(0);
    const [detailRoutes, setDetailRoutes] = useState([]);
    const [busNotice, setBusNotice] = useState({});
    const [departFrom, setDepartFrom] = useState(0);
    const [currentMin, setCurrentMin] = useState(dayjs().minute() + dayjs().hour() * 60 - 1);

    const handleClose = () => {
        history.goBack();
    };
    const { loading, data } = useQuery(GET_DETAIL_ROUTES, {
        variables: { route: busName },
    });

    const { data: driverData } = useQuery(GET_DRIVER_NOTICE, {
        variables: { route: busName },
        fetchPolicy: 'no-cache',
    });

    useEffect(() => {
        const tick = () => {
            return setTimeout(() => setCurrentMin(currentMin + 1), 60000);
        };

        if (driverData) {
            const { success, message, data } = driverData.getDriverNotice;
            if (success && data[0]) {
                const time = data[0].updatedAt.split(':');
                setBusNotice(data[0]);
                const BusMin = parseInt(time[0]) * 60 + parseInt(time[1]);
                tick();
                setDepartFrom(currentMin - BusMin);
            } else console.log(message);
        }
        return () => clearTimeout(tick);
    }, [driverData, currentMin]);

    useEffect(() => {
        if (data) {
            const { success, message, data: routeData } = data.getDetailRoutes;
            if (success) {
                setDetailRoutes(routeData);
            } else console.log(message);
        }
        return () => setDetailRoutes([]);
    }, [data]);

    return (
        <Box height="100%">
            <Header2 handleClose={handleClose} headerText={`${busName}노선`} />
            <Box>
                <AppBar color="transparent" position="static">
                    <Tabs
                        value={boardNum}
                        onChange={(e, newValue) => setNumber(newValue)}
                        aria-label="busInfo tabs"
                        centered
                        variant="fullWidth"
                        textColor="secondary"
                    >
                        <Tab
                            label={
                                <div>
                                    <Map style={{ verticalAlign: 'middle' }} />
                                    &nbsp;&nbsp;지도보기
                                </div>
                            }
                            classes={{ root: classes.tab }}
                        />
                        <Tab
                            label={
                                <div>
                                    <PinDrop style={{ verticalAlign: 'middle' }} />
                                    &nbsp;&nbsp;노선보기
                                </div>
                            }
                        />
                    </Tabs>
                </AppBar>
            </Box>
            <Box height={`calc(95% - 48px)`} display="flex" flexDirection="column">
                <Box
                    position={boardNum === 0 ? 'absolute' : 'static'}
                    width="100%"
                    zIndex="5000"
                    display="flex"
                    justifyContent="center"
                >
                    <Box
                        mt={1}
                        py={0.5}
                        px={2}
                        maxWidth="70%"
                        className={classes.busNotify}
                        display="flex"
                    >
                        <Box display="flex" alignItems="center" mr={1}>
                            <BusAlert color="secondary" />
                        </Box>
                        <Box display="flex" alignItems="center">
                            <Typography className={classes.notifyText}>
                                <BusNoticeForm busNotice={busNotice} departFrom={departFrom} />
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                {boardNum === 0 && (
                    <MapTabPanel
                        detailRoutes={detailRoutes}
                        loading={loading}
                        busNumber={busNumber}
                        driver={driver}
                    />
                )}
                {boardNum === 1 && (
                    <RouteTabPanel
                        detailRoutes={detailRoutes}
                        loading={loading}
                        location={busNotice.location}
                    />
                )}
            </Box>
        </Box>
    );
};

const MapTabPanel = props => {
    const classes = BusInfoStyle();
    const { detailRoutes, busNumber, driver } = props;
    const [openMarkerDialog, setMarkerDialog] = useState(false);
    const [openInfo, setOpenInfo] = useState(false);
    const [routeInfo, setRouteInfo] = useState({});

    useEffect(() => {
        const sizeRate = 0.4; //이미지 크기비율
        const MARKER_WIDTH = 78 * sizeRate, //마커 한개 가로 길이
            MARKER_HEIGHT = 114 * sizeRate, //마커 한개 세로 길이
            SPRITE_WIDTH = 390 * sizeRate, //마커 전체 가로 길이
            SPRITE_HEIGHT = 458 * sizeRate; //마커 전체 세로 길이

        const container = document.getElementById('kakaoMap');
        const options = {
            center: new kakao.maps.LatLng(37.220825, 127.07547), //바텍 위치
            level: 8,
        };
        const map = new kakao.maps.Map(container, options);
        const bounds = new kakao.maps.LatLngBounds();

        const spriteSize = new kakao.maps.Size(SPRITE_WIDTH, SPRITE_HEIGHT);
        const markerSize = new kakao.maps.Size(MARKER_WIDTH, MARKER_HEIGHT);

        for (let i = 0; i < detailRoutes.length; i++) {
            const { lat, long } = detailRoutes[i];
            const width = i % 5;
            const height = parseInt(i / 5);

            const markerPosition = new kakao.maps.LatLng(lat, long);
            const spriteOrigin = new kakao.maps.Point(MARKER_WIDTH * width, MARKER_HEIGHT * height);

            const markerImage = new kakao.maps.MarkerImage(
                i === detailRoutes.length - 1 ? ARRIVAL_IMAGE : SPRITE_IMAGE,
                markerSize,
                i !== detailRoutes.length - 1 && {
                    spriteOrigin: spriteOrigin,
                    spriteSize: spriteSize,
                },
            );

            const marker = new kakao.maps.Marker({
                position: markerPosition,
                image: markerImage,
            });
            marker.setMap(map);

            kakao.maps.event.addListener(marker, 'click', () => {
                setRouteInfo(detailRoutes[i]);
                setMarkerDialog(true);
            });

            bounds.extend(markerPosition);
        }
        map.setBounds(bounds);
    }, [detailRoutes]);

    return (
        <Box id="kakaoMap" height="100%" width="100%">
            {driver && (
                <React.Fragment>
                    <Box
                        className={clsx(classes.menuButton, {
                            [classes.menuButtonShift]: openInfo,
                        })}
                        component={ButtonBase}
                        onClick={() => setOpenInfo(!openInfo)}
                    >
                        <Box display="flex" flexDirection="column" alignItems="center">
                            {openInfo ? (
                                <KeyboardArrowDown style={{ fontSize: '30px' }} />
                            ) : (
                                <KeyboardArrowUp style={{ fontSize: '30px' }} />
                            )}
                        </Box>
                    </Box>

                    <Drawer
                        open={openInfo}
                        anchor="bottom"
                        variant="persistent"
                        ModalProps={{ className: classes.infoModal }}
                        PaperProps={{
                            className: classes.infoPaper,
                        }}
                        className={classes.menuDrawer}
                    >
                        <Box display="flex" flexDirection="column" height="100%">
                            <Box
                                height="25%"
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                my={1}
                                mx={3}
                            >
                                <Typography className={classes.busInfoTitle}>버스 정보</Typography>
                                <Paper elevation={2} className={classes.busInfoPaper}>
                                    <Typography align="center" className={classes.busNumber}>
                                        {busNumber}
                                    </Typography>
                                </Paper>
                            </Box>
                            <Box
                                height="75%"
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                mx={3}
                            >
                                <Typography>
                                    기사님 성함: &nbsp;<strong>{driver.name}</strong>
                                </Typography>

                                <Typography>
                                    기사님 전화번호: &nbsp;<strong>{driver.phone}</strong>
                                </Typography>
                            </Box>
                        </Box>
                    </Drawer>
                </React.Fragment>
            )}

            <Dialog
                open={openMarkerDialog}
                onClose={() => setMarkerDialog(false)}
                onClick={() => setMarkerDialog(false)}
                style={{ zIndex: 10000 }}
            >
                <Box px={2} py={1} display="flex">
                    <Box color="secondary" width="75%" mr={1}>
                        <TextField
                            value={routeInfo.location}
                            label="위치"
                            size="small"
                            variant="outlined"
                            disabled
                            fullWidth
                            style={{ color: 'black' }}
                        />
                    </Box>
                    <Box color="secondary" width="25%">
                        <TextField
                            value={routeInfo.boardingTime}
                            label="탑승 시간"
                            size="small"
                            variant="outlined"
                            disabled
                        />
                    </Box>
                </Box>

                {routeInfo.imageUrl && <img src={routeInfo.imageUrl} alt="nothing" />}
            </Dialog>
        </Box>
    );
};

const RouteTabPanel = props => {
    const { detailRoutes, loading, location } = props;
    const classes = BusInfoStyle();

    return (
        <Box px={3} py={1} height="100%">
            <Paper className={classes.routePaper} elevation={5}>
                {loading ? (
                    <Box display="flex" alignItems="center" justifyContent="center">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box height="70vh" overflow="auto">
                        <Timeline className={classes.timeLine}>
                            {detailRoutes.map((data, index) => (
                                <TimelineItem key={data.location}>
                                    <TimelineOppositeContent className={classes.timeLineOpposite}>
                                        <Typography>{data.boardingTime}</Typography>
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <TimelineDot
                                            variant="outlined"
                                            className={classes.timeLineDotIcon}
                                        >
                                            {index !== detailRoutes.length - 1 ? (
                                                <ArrowDown className={classes.iconSize} />
                                            ) : (
                                                <Send className={classes.iconSize} />
                                            )}
                                        </TimelineDot>
                                        {index !== detailRoutes.length - 1 && (
                                            <TimelineConnector>
                                                {data.location === location && (
                                                    <DirectionsBus
                                                        className={classes.busLocation}
                                                    />
                                                )}
                                            </TimelineConnector>
                                        )}
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        <Box minHeight="100px">
                                            <Paper className={classes.timeLineContentPaper}>
                                                <Box px={2} py={1}>
                                                    <Typography>{data.location}</Typography>
                                                </Box>
                                            </Paper>
                                        </Box>
                                    </TimelineContent>
                                </TimelineItem>
                            ))}
                        </Timeline>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

const BusNoticeForm = props => {
    const { busNotice, departFrom } = props;

    return busNotice.location !== 'null' ? (
        <React.Fragment>
            {busNotice.route}버스가 {departFrom >= 1 ? `${departFrom}분 전에 ` : '방금 전에 '}
            <strong>{busNotice.location}</strong>에서 출발했습니다.
        </React.Fragment>
    ) : dayjs().hour() > 8 ? (
        <strong>금일 {busNotice.route}버스 운행이 종료되었습니다.</strong>
    ) : (
        <strong>버스가 아직 출발하지 않았습니다.</strong>
    );
};

export default BusInfo;
