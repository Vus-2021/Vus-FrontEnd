import React, { useEffect, useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    AppBar,
    Typography,
    Paper,
    SvgIcon,
    CircularProgress,
    Dialog,
    TextField,
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
import { Map, PinDrop, Send, DirectionsBus } from '@material-ui/icons';
import Header2 from '../layout/Header2';
import BusInfoStyle from '../styles/BusInfoStyle';
import BusAlert from '../components/BusAlert';
import { useQuery } from '@apollo/react-hooks';
import { GET_DETAIL_ROUTES } from '../gql/businfo/query';
import SPRITE_IMAGE from '../images/MarkerImages.png';
import ARRIVAL_IMAGE from '../images/ArrivalMarker.png';

const { kakao } = window;

const BusInfo = ({ history, location }) => {
    const classes = BusInfoStyle();
    const busName = location.state.busName;
    const [boardNum, setNumber] = useState(0);
    const [detailRoutes, setDetailRoutes] = useState([]);

    const handleClose = () => {
        history.push('/');
    };
    const { loading, data } = useQuery(GET_DETAIL_ROUTES, {
        variables: { route: busName },
    });

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
                    <Box mt={1} py={0.5} px={2} width="70%" className={classes.busNotify}>
                        <Box display="flex" alignItems="center" mr={1}>
                            <BusAlert color="secondary" />
                        </Box>
                        <Box display="flex" alignItems="center">
                            <Typography className={classes.notifyText}>
                                버스가 15분 전{' '}
                                <strong>성호아파트 후문 또래아동도서아울렛 앞</strong>
                                에서 출발했습니다.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                {boardNum === 0 && <MapTabPanel detailRoutes={detailRoutes} loading={loading} />}
                {boardNum === 1 && <RouteTabPanel detailRoutes={detailRoutes} loading={loading} />}
            </Box>
        </Box>
    );
};

const MapTabPanel = props => {
    const { detailRoutes } = props;
    const [openMarkerDialog, setMarkerDialog] = useState(false);
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
        // eslint-disable-next-line no-unused-vars
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

                <img src={routeInfo.imageUrl} alt="nothing" />
            </Dialog>
        </Box>
    );
};

const RouteTabPanel = props => {
    const { detailRoutes, loading } = props;
    const classes = BusInfoStyle();

    return (
        <Box px={3} py={1} height="100%">
            <Paper className={classes.routePaper} elevation={5}>
                {loading ? (
                    <Box display="flex" alignItems="center" justifyContent="center">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box height="90%" overflow="auto">
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
                                                {index === 2 && (
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

const ArrowDown = props => {
    return (
        <SvgIcon {...props}>
            <path d="M2.82 6L12 15.16L21.18 6L24 8.82L12 20.82L0 8.82L2.82 6Z" />
        </SvgIcon>
    );
};

export default BusInfo;
