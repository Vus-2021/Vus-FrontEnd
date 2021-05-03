import React, { useState, useEffect, useRef, useContext } from 'react';
import {
    Box,
    Button,
    TextField,
    InputAdornment,
    Divider,
    ButtonBase,
    Typography,
    List,
    Collapse,
    ListItem,
    ListItemText,
    Drawer,
    CircularProgress,
    Paper,
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
    Search,
    ExpandLess,
    ExpandMore,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    Send,
} from '@material-ui/icons';
import { useQuery } from '@apollo/react-hooks';
import { GET_DETAIL_ROUTES } from '../gql/route/query';
import { useForm, Controller } from 'react-hook-form';
import clsx from 'clsx';

import SPRITE_IMAGE from '../../mobile/images/MarkerImages.png';
import ARRIVAL_IMAGE from '../../mobile/images/ArrivalMarker.png';
import RouteStyle from '../styles/RouteStyle';
import { CreateDialog, UpdateRouteDialog, UpdateDialog, DeleteRouteDialog } from './DetailRoute';
import { DeviceMode } from '../../App';

const { kakao } = window;

const Route = props => {
    const { routeName, partitionKey, refetchRouteName } = props;
    const deviceMode = useContext(DeviceMode);
    const { control, handleSubmit } = useForm();
    const classes = RouteStyle(deviceMode);

    const map = useRef();
    const createMarker = useRef();

    const [latlng, setLatLng] = useState({
        lat: '',
        lng: '',
    });
    const [route, setRoute] = useState({});
    const [detailRoutes, setDetailRoutes] = useState([]);
    const [updateRouteDialog, setUpdateRouteDialog] = useState(false); //노선 수정 Dialog open 여부
    const [deleteRouteDialog, setDeleteRouteDialog] = useState(false); //노선 삭제 Dialog open 여부
    const [createDialog, setCreateDialog] = useState(false); //정류장 등록 Dialog open 여부
    const [updateDialog, setUpdateDialog] = useState(false); //정류장 수정/삭제 Dialog open 여부

    const [selectedMarker, setSelectedMarker] = useState(null);
    const [listData, setListData] = useState([]);
    const [markerList, setMarkerList] = useState([]);
    const [openList, setOpenList] = useState(false);
    const [openRoute, setOpenRoute] = useState(false);

    const { loading, data, refetch } = useQuery(GET_DETAIL_ROUTES, {
        variables: { route: routeName },
    });

    const searchList = (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
            setOpenList(true);
            setListData(data);
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
            alert('검색 결과가 없습니다.');
        } else if (status === kakao.maps.services.Status.ERROR) {
            alert('검색 결과 중 오류가 발생했습니다.');
            return;
        }
    };

    const listClick = (lat, lng) => {
        const moveLatLng = new kakao.maps.LatLng(lat, lng);
        map.current.setLevel(2);
        map.current.panTo(moveLatLng);
    };

    const mapClick = e => {
        const latLng = e.latLng;
        const moveLatLng = new kakao.maps.LatLng(latLng.getLat(), latLng.getLng());

        map.current.panTo(moveLatLng);

        createMarker.current.setPosition(latLng);
        kakao.maps.event.addListener(createMarker.current, 'click', () => {
            setLatLng({
                lat: latLng.getLat(),
                lng: latLng.getLng(),
            });
            setCreateDialog(true);
        });
    };

    const updateRouteClick = () => {
        setUpdateRouteDialog(true);
    };

    const deleteRouteClick = () => {
        setDeleteRouteDialog(true);
    };

    useEffect(() => {
        let sizeRate = 0.48; //이미지 크기비율
        const MARKER_WIDTH = 78 * sizeRate, //마커 한개 가로 길이
            MARKER_HEIGHT = 114 * sizeRate, //마커 한개 세로 길이
            SPRITE_WIDTH = 390 * sizeRate, //마커 전체 가로 길이
            SPRITE_HEIGHT = 458 * sizeRate; //마커 전체 세로 길이

        const markerClick = (marker, route) => {
            setSelectedMarker(marker);
            setRoute(route);
            setUpdateDialog(true);
        };

        if (data) {
            const { success, message, data: detailRoutes } = data.getDetailRoutes;
            if (success) {
                setDetailRoutes(detailRoutes);
                const container = document.getElementById('kakaoMap');
                const options = {
                    center:
                        detailRoutes.length > 0
                            ? new kakao.maps.LatLng(100, 100)
                            : new kakao.maps.LatLng(37.220825, 127.07547),
                    level: 7,
                };
                map.current = new kakao.maps.Map(container, options);
                const bounds = new kakao.maps.LatLngBounds();

                const spriteSize = new kakao.maps.Size(SPRITE_WIDTH, SPRITE_HEIGHT);
                const markerSize = new kakao.maps.Size(MARKER_WIDTH, MARKER_HEIGHT);

                const markerlist = [];

                for (let i = 0; i < detailRoutes.length; i++) {
                    const { lat, long } = detailRoutes[i];
                    const width = i % 5;
                    const height = parseInt(i / 5);

                    const markerPosition = new kakao.maps.LatLng(lat, long);
                    const spriteOrigin = new kakao.maps.Point(
                        MARKER_WIDTH * width,
                        MARKER_HEIGHT * height,
                    );

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
                        clickable: true,
                    });

                    const content =
                        '<div class="MuiBox-root" style="background-color: white; width: 300px; margin: 7px; display: flex;">' +
                        '<div class="MuiBox-root" style="width: 75%; margin-right:8px;">' +
                        '<div class="MuiFormControl-root MuiTextField-root MuiFormControl-fullWidth">' +
                        '<label class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-marginDense MuiInputLabel-outlined MuiFormLabel-filled" data-shrink="true">정류장 이름</label>' +
                        '<div class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-marginDense MuiOutlinedInput-marginDense">' +
                        '<input aria-invalid="false" type="text" class="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputMarginDense MuiOutlinedInput-inputMarginDense" value="' +
                        detailRoutes[i].location +
                        '">' +
                        '<fieldset aria-hidden="true" class="MuiOutlinedInput-notchedOutline" style="top: -5px; left: 0; right: 0; bottom:0; margin:0; padding: 0 8px; overflow: hidden; position: absolute; border-style: solid; border-width: 1px; border-radius: inherit; porinter-events: none;">' +
                        '<legend style="transition: max-width: 100ms cubic-bezier(0.0,0,0.2,1) 50ms; width: auto; height:11px; display: block; padding: 0px; font-size: 0.75em; text-align: left; visibility: hidden;">' +
                        '<span>정류장 이름</span>' +
                        '</legend>' +
                        '</fieldset>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="MuiBox-root" style="width: 25%;">' +
                        '<div class="MuiFormControl-root MuiTextField-root">' +
                        '<label class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-marginDense MuiInputLabel-outlined MuiFormLabel-filled" data-shrink="true">시간</label>' +
                        '<div class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl MuiInputBase-marginDense MuiOutlinedInput-marginDense">' +
                        '<input aria-invalid="false" type="text" class="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputMarginDense MuiOutlinedInput-inputMarginDense" value="' +
                        detailRoutes[i].boardingTime +
                        '">' +
                        '<fieldset aria-hidden="true" class="MuiOutlinedInput-notchedOutline" style="top: -5px; left: 0; right: 0; bottom:0; margin:0; padding: 0 8px; overflow: hidden; position: absolute; border-style: solid; border-width: 1px; border-radius: inherit; porinter-events: none;">' +
                        '<legend style="transition: max-width: 100ms cubic-bezier(0.0,0,0.2,1) 50ms; width: auto; height:11px; display: block; padding: 0px; font-size: 0.75em; text-align: left; visibility: hidden;"><span>시간</span></legend>' +
                        '</fieldset>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';

                    const infowindow = new kakao.maps.InfoWindow({
                        content: content,
                    });

                    marker.setMap(map.current);

                    kakao.maps.event.addListener(marker, 'click', () => {
                        infowindow.close();
                        markerClick(marker, detailRoutes[i]);
                    });
                    kakao.maps.event.addListener(marker, 'mouseover', () => {
                        infowindow.open(map.current, marker);
                    });
                    kakao.maps.event.addListener(marker, 'mouseout', () => {
                        infowindow.close();
                    });
                    bounds.extend(markerPosition);
                    markerlist.push(marker);
                }
                createMarker.current = new kakao.maps.Marker({
                    position: map.current.getCenter(),
                });
                createMarker.current.setMap(map.current);
                kakao.maps.event.addListener(createMarker.current, 'click', () => {
                    setLatLng({
                        lat: 37.220825,
                        lng: 127.07547,
                    });
                    setCreateDialog(true);
                    setOpenRoute(false);
                });

                setMarkerList(markerlist);

                if (detailRoutes.length > 0) map.current.setBounds(bounds);
                kakao.maps.event.addListener(map.current, 'click', e => mapClick(e));
            } else {
                console.log(message);
            }
        }
    }, [data]);

    return (
        <Box pt={1} minWidth={deviceMode ? null : '600px'} width="95%" height="98%">
            <Box id="kakaoMap" width="100%" height="100%">
                <Box
                    className={clsx(classes.menuButton, { [classes.menuButtonShift]: openRoute })}
                    component={ButtonBase}
                    onClick={() => {
                        setOpenRoute(!openRoute);
                        setOpenList(false);
                    }}
                >
                    <Box display="flex" flexDirection="column" alignItems="center">
                        {openRoute ? (
                            <KeyboardArrowLeft style={{ fontSize: '35px' }} />
                        ) : (
                            <KeyboardArrowRight style={{ fontSize: '35px' }} />
                        )}
                    </Box>
                </Box>

                <Drawer
                    anchor="left"
                    variant="persistent"
                    open={openRoute}
                    ModalProps={{ className: classes.routeModal }}
                    PaperProps={{
                        className: classes.routePaper,
                        style: {
                            height: `calc(100% - 60px)`,
                            width: deviceMode ? '245px' : '325px',
                        },
                    }}
                    className={classes.menuDrawer}
                >
                    <Box mb={1} />

                    {detailRoutes.length === 0 ? (
                        <Box display="flex" justifyContent="center">
                            생성된 정류장이 없습니다.
                        </Box>
                    ) : (
                        <RouteTimeLine
                            detailRoutes={detailRoutes}
                            loading={loading}
                            markerList={markerList}
                            setUpdateDialog={setUpdateDialog}
                            setSelectedMarker={setSelectedMarker}
                            setRoute={setRoute}
                        />
                    )}
                </Drawer>

                <Box
                    position="absolute"
                    zIndex={updateRouteDialog ? '0' : '400'}
                    top={deviceMode ? null : 5}
                    bottom={deviceMode ? 5 : null}
                    right={0}
                    pt={0.5}
                    display="flex"
                >
                    <Box mr={1}>
                        <Button
                            variant="contained"
                            className={classes.reviseButton}
                            onClick={updateRouteClick}
                        >
                            노선 수정
                        </Button>
                    </Box>
                    <Box mr={1}>
                        <Button
                            variant="contained"
                            className={classes.deleteButton}
                            onClick={deleteRouteClick}
                        >
                            노선 삭제
                        </Button>
                    </Box>
                </Box>

                <Box
                    position="absolute"
                    zIndex={updateRouteDialog ? '0' : '500'}
                    minWidth={deviceMode ? '245px' : '325px'}
                    pt={0.5}
                >
                    <Box p={1} className={classes.searchField}>
                        <form
                            onSubmit={handleSubmit(data => {
                                if (data.search) {
                                    const ps = new kakao.maps.services.Places();
                                    ps.keywordSearch(data.search, searchList);
                                    setOpenRoute(false);
                                }
                            })}
                        >
                            <Box display="flex" flexDirection="row" alignItems="center">
                                <Box width={deviceMode ? '150px' : '230px'} mr={1}>
                                    <Controller
                                        name="search"
                                        control={control}
                                        as={TextField}
                                        defaultValue=""
                                        size="small"
                                        variant="outlined"
                                        label="주소로 검색"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Search />
                                                </InputAdornment>
                                            ),
                                        }}
                                        className={classes.searchText}
                                    />
                                </Box>
                                <Box>
                                    <Button
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        className={classes.searchButton}
                                    >
                                        검색
                                    </Button>
                                </Box>
                                {listData.length > 0 && (
                                    <Box
                                        component={ButtonBase}
                                        onClick={() => {
                                            setOpenList(!openList);
                                            setOpenRoute(false);
                                        }}
                                    >
                                        {openList ? <ExpandLess /> : <ExpandMore />}
                                    </Box>
                                )}
                            </Box>
                        </form>
                        <Box overflow="auto" maxHeight="540px" maxWidth="340px">
                            <Collapse in={openList} timeout="auto" unmountOnExit>
                                {listData.length > 0 &&
                                    listData.map(data => (
                                        <Box
                                            component={ButtonBase}
                                            onClick={() => listClick(data.y, data.x)}
                                            key={data.id}
                                            className={classes.buttonBase}
                                        >
                                            <List disablePadding>
                                                <ListItem style={{ padding: '0 0 0 25px' }}>
                                                    <ListItemText>
                                                        <Typography className={classes.placeName}>
                                                            {data.place_name}
                                                        </Typography>
                                                        <Typography className={classes.addressName}>
                                                            {data.road_address_name}
                                                        </Typography>
                                                    </ListItemText>
                                                </ListItem>
                                            </List>
                                            <Divider />
                                        </Box>
                                    ))}
                            </Collapse>
                        </Box>
                    </Box>
                </Box>
                <UpdateRouteDialog
                    open={updateRouteDialog}
                    onClose={setUpdateRouteDialog}
                    routeName={routeName}
                    refetchRouteName={refetchRouteName}
                />
                <DeleteRouteDialog
                    open={deleteRouteDialog}
                    onClose={setDeleteRouteDialog}
                    partitionKey={partitionKey}
                    routeName={routeName}
                />
                <CreateDialog
                    open={createDialog}
                    onClose={setCreateDialog}
                    latlng={latlng}
                    routeName={routeName}
                    refetch={refetch}
                />
                <UpdateDialog
                    open={updateDialog}
                    onClose={setUpdateDialog}
                    route={route}
                    refetch={refetch}
                    marker={selectedMarker}
                />
            </Box>
        </Box>
    );
};

const RouteTimeLine = props => {
    const {
        detailRoutes,
        loading,
        markerList,
        setUpdateDialog,
        setSelectedMarker,
        setRoute,
    } = props;
    const classes = RouteStyle();

    const routeClick = index => {
        setSelectedMarker(markerList[index]);
        setRoute(detailRoutes[index]);
        setUpdateDialog(true);
    };

    return loading ? (
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
            <CircularProgress />
        </Box>
    ) : (
        <Box>
            <Timeline className={classes.timeLine}>
                {detailRoutes.map((data, index) => (
                    <TimelineItem key={data.location}>
                        <TimelineOppositeContent className={classes.timeLineOpposite}>
                            <Typography className={classes.boardingTimeText}>
                                {data.boardingTime}
                            </Typography>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot variant="outlined" className={classes.timeLineDotIcon}>
                                {index !== detailRoutes.length - 1 ? (
                                    <Box
                                        width="15px"
                                        height="15px"
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <Typography color="secondary">{index + 1}</Typography>
                                    </Box>
                                ) : (
                                    <Send className={classes.iconSize} />
                                )}
                            </TimelineDot>
                            {index !== detailRoutes.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                            <Box minHeight="100px">
                                <Paper
                                    className={classes.timeLineContentPaper}
                                    component={ButtonBase}
                                    onClick={() => routeClick(index)}
                                >
                                    <Box px={2} py={1} width="100%">
                                        <Typography>{data.location}</Typography>
                                    </Box>
                                </Paper>
                            </Box>
                        </TimelineContent>
                    </TimelineItem>
                ))}
            </Timeline>
        </Box>
    );
};

export default Route;
