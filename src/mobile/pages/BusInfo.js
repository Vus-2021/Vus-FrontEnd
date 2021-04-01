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

const BusInfo = ({ history, location }) => {
    const classes = BusInfoStyle();
    const busName = location.state.busName + '노선';
    const [boardNum, setNumber] = useState(0);
    const [detailRoutes, setDetailRoutes] = useState([]);

    const handleClose = () => {
        history.push('/');
    };
    const { loading, data } = useQuery(GET_DETAIL_ROUTES, {
        variables: { route: location.state.busName },
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
            <Header2 handleClose={handleClose} headerText={busName} />
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
                    zIndex="9999"
                    display="flex"
                    justifyContent="center"
                >
                    <Box
                        mt={1}
                        py={0.5}
                        px={2}
                        width="70%"
                        className={classes.busNotify}
                        display="flex"
                    >
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
    const { kakao } = window;
    useEffect(() => {
        const container = document.getElementById('kakaoMap');
        const options = {
            center: new kakao.maps.LatLng(37.220825, 127.07547), //바텍 위치
            level: 8,
        };
        // eslint-disable-next-line no-unused-vars
        const map = new kakao.maps.Map(container, options);
        // map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);
        detailRoutes.map(data => {
            const { lat, long } = data;
            let markerPosition = new kakao.maps.LatLng(lat, long);
            let marker = new kakao.maps.Marker({
                position: markerPosition,
            });
            return marker.setMap(map);
        });
    }, [kakao, detailRoutes]);

    return <Box id="kakaoMap" height="100%" width="100%"></Box>;
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
