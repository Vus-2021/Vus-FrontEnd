import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    Dialog,
    TextField,
    InputAdornment,
    Divider,
    ButtonBase,
    Typography,
    List,
    Collapse,
    ListItem,
    ListItemText,
    FormControl,
    InputLabel,
    MenuItem,
    FormHelperText,
    Select,
} from '@material-ui/core';
import { Search, ExpandLess, ExpandMore } from '@material-ui/icons';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_DETAIL_ROUTES, GET_USERS } from '../gql/route/query';
import {
    DELETE_ROUTE,
    UPDATE_DETAIL_ROUTE,
    CREATE_ROUTE_DETAIL,
    DELETE_DETAIL_ROUTE,
} from '../gql/route/mutation';
import { useForm, Controller } from 'react-hook-form';

import SPRITE_IMAGE from '../../mobile/images/MarkerImages.png';
import ARRIVAL_IMAGE from '../../mobile/images/ArrivalMarker.png';
import MiniHeader from '../layout/MiniHeader';
import RouteStyle from '../styles/RouteStyle';

const { kakao } = window;

const Route = props => {
    const { routeName, partitionKey } = props;
    const { control, handleSubmit } = useForm();
    const classes = RouteStyle();

    const map = useRef();
    const createMarker = useRef();

    const [latlng, setLatLng] = useState({
        lat: '',
        lng: '',
    });
    const [route, setRoute] = useState({});
    const [updateRouteDialog, setUpdateRouteDialog] = useState(false); //노선 수정 Dialog open 여부
    const [createDialog, setCreateDialog] = useState(false); //정류장 등록 Dialog open 여부
    const [updateDialog, setUpdateDialog] = useState(false); //정류장 수정/삭제 Dialog open 여부
    const [listData, setListData] = useState([]);
    const [openList, setOpenList] = useState(false);

    const { data, refetch } = useQuery(GET_DETAIL_ROUTES, { variables: { route: routeName } });
    const [deleteRoute, { data: deleteData }] = useMutation(DELETE_ROUTE);

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

    const markerClick = (marker, route) => {
        setRoute(route);
        setUpdateDialog(true);
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
        deleteRoute({
            variables: {
                partitionKey: partitionKey,
            },
        });
    };

    useEffect(() => {
        if (deleteData) {
            const { success, message } = deleteData.deleteRoute;
            if (success) {
                window.location.href = '/admin';
            } else console.log(message);
        }
    }, [deleteData]);

    useEffect(() => {
        let sizeRate = 0.48; //이미지 크기비율
        const MARKER_WIDTH = 78 * sizeRate, //마커 한개 가로 길이
            MARKER_HEIGHT = 114 * sizeRate, //마커 한개 세로 길이
            SPRITE_WIDTH = 390 * sizeRate, //마커 전체 가로 길이
            SPRITE_HEIGHT = 458 * sizeRate; //마커 전체 세로 길이

        if (data) {
            const { success, message, data: detailRoutes } = data.getDetailRoutes;
            if (success) {
                const container = document.getElementById('kakaoMap');
                const options = {
                    center:
                        detailRoutes.length > 0
                            ? new kakao.maps.LatLng(100, 100)
                            : new kakao.maps.LatLng(37.220825, 127.07547),
                    level: 10,
                };
                map.current = new kakao.maps.Map(container, options);
                const bounds = new kakao.maps.LatLngBounds();

                const spriteSize = new kakao.maps.Size(SPRITE_WIDTH, SPRITE_HEIGHT);
                const markerSize = new kakao.maps.Size(MARKER_WIDTH, MARKER_HEIGHT);

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
                }
                createMarker.current = new kakao.maps.Marker({
                    position: map.current.getCenter(),
                });
                createMarker.current.setMap(map.current);

                if (detailRoutes.length > 0) map.current.setBounds(bounds);
                kakao.maps.event.addListener(map.current, 'click', e => mapClick(e));
            } else {
                console.log(message);
            }
        }
    }, [data]);

    return (
        <Box px={2} pt={1} minWidth="600px" width="95%" height="98%">
            <Box id="kakaoMap" width="100%" height="100%">
                <Box
                    position="absolute"
                    zIndex={updateRouteDialog ? '0' : '4000'}
                    display="flex"
                    width="100%"
                    justifyContent="flex-end"
                    pt={0.5}
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
                    zIndex={updateRouteDialog ? '0' : '5000'}
                    minWidth="200px"
                    p={0.5}
                >
                    <Box p={1} className={classes.searchField}>
                        <form
                            onSubmit={handleSubmit(data => {
                                if (data.search) {
                                    const ps = new kakao.maps.services.Places();
                                    ps.keywordSearch(data.search, searchList);
                                }
                            })}
                        >
                            <Box display="flex" flexDirection="row" alignItems="center">
                                <Box width="230px" mr={1}>
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
                                        onClick={() => setOpenList(!openList)}
                                    >
                                        {openList ? <ExpandLess /> : <ExpandMore />}
                                    </Box>
                                )}
                            </Box>
                        </form>
                        <Box overflow="auto" maxHeight="500px">
                            <Collapse in={openList} timeout="auto" unmountOnExit>
                                {listData.length > 0 &&
                                    listData.map(data => (
                                        <Box
                                            component={ButtonBase}
                                            onClick={() => listClick(data.y, data.x)}
                                            key={data.id}
                                            display="flex"
                                            width="100%"
                                            alignItems="flex-start"
                                            flexDirection="column"
                                        >
                                            <List disablePadding>
                                                <ListItem style={{ padding: '0 0 0 6px' }}>
                                                    <ListItemText>
                                                        <Typography className={classes.placeName}>
                                                            {data.place_name}
                                                        </Typography>
                                                        <Typography className={classes.addressName}>
                                                            {data.address_name}
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
                <UpdateRouteDialog open={updateRouteDialog} onClose={setUpdateRouteDialog} />
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
                />
            </Box>
        </Box>
    );
};

const UpdateRouteDialog = props => {
    const { open, onClose } = props;
    const classes = RouteStyle();
    const { control, handleSubmit, errors } = useForm();
    const [drivers, setDrivers] = useState([]);

    const { data } = useQuery(GET_USERS, { variables: { type: 'DRIVER' } });

    const handleClose = () => {
        onClose(false);
    };

    const LimitCountHelperText = props => {
        const { type } = props.errors;
        if (type === 'required') return '수용 인원을 입력해주세요.';
        if (type === 'isNumber') return '숫자만 입력해주세요.';
    };

    useEffect(() => {
        if (data) {
            const { success, message, data: driverData } = data.getUsers;
            if (success) {
                setDrivers(driverData);
            } else {
                console.log(message);
            }
        }
    }, [data]);

    return (
        <Dialog open={open} onClose={handleClose}>
            <MiniHeader handleClose={handleClose} headerText="노선 수정" />
            <Box p={4}>
                <form onSubmit={handleSubmit(data => console.log(data))}>
                    <Box mb={2}>
                        <Controller
                            control={control}
                            as={TextField}
                            defaultValue=""
                            name="route"
                            label="노선 이름"
                            fullWidth
                            variant="outlined"
                            size="small"
                            error={errors.route ? true : false}
                            rules={{ required: true }}
                            helperText={errors.route ? '노선 이름을 입력해주세요.' : ' '}
                        />
                    </Box>
                    <Box mb={2}>
                        <Controller
                            control={control}
                            name="driver"
                            defaultValue=""
                            rules={{
                                validate: {
                                    required: value => value !== '',
                                },
                            }}
                            error={errors.driver ? true : false}
                            render={props => (
                                <FormControl
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    error={errors.driver ? true : false}
                                >
                                    <InputLabel id="bus-driver-select">버스기사 배정</InputLabel>
                                    <Select
                                        labelId="bus-driver-select"
                                        label="버스기사 배정"
                                        defaultValue={drivers.length > 0 ? drivers[0].userId : ''}
                                        onChange={e => props.onChange(e.target.value)}
                                    >
                                        {drivers.map(driver => (
                                            <MenuItem key={driver.userId} value={driver.userId}>
                                                {driver.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>
                                        {errors.driver ? '버스 기사를 선택해주세요.' : ' '}
                                    </FormHelperText>
                                </FormControl>
                            )}
                        />
                    </Box>
                    <Box mb={2}>
                        <Controller
                            control={control}
                            as={TextField}
                            defaultValue=""
                            name="busNumber"
                            label="차량번호"
                            fullWidth
                            variant="outlined"
                            size="small"
                            error={errors.busNumber ? true : false}
                            rules={{ required: true }}
                            helperText={errors.busNumber ? '차량번호를 입력해주세요.' : ' '}
                        />
                    </Box>
                    <Box mb={2}>
                        <Controller
                            control={control}
                            as={TextField}
                            defaultValue=""
                            name="limitCount"
                            label="최대 수용인원"
                            fullWidth
                            variant="outlined"
                            size="small"
                            error={errors.limitCount ? true : false}
                            rules={{
                                required: true,
                                validate: { isNumber: value => !isNaN(value) },
                            }}
                            helperText={
                                errors.limitCount ? (
                                    <LimitCountHelperText errors={errors.limitCount} />
                                ) : (
                                    ' '
                                )
                            }
                        />
                    </Box>
                    <Box display="flex" justifyContent="flex-end">
                        <Button type="submit" className={classes.searchButton} variant="contained">
                            노선 등록하기
                        </Button>
                    </Box>
                </form>
            </Box>
        </Dialog>
    );
};

const CreateDialog = props => {
    const { open, onClose, routeName, latlng, refetch } = props;
    const classes = RouteStyle();
    const { control, handleSubmit, errors } = useForm();

    const [createRouteDetail, { data }] = useMutation(CREATE_ROUTE_DETAIL, {
        onCompleted() {
            refetch();
        },
    });

    const handleClose = () => {
        onClose(false);
    };

    const BoardingTimeHelperText = props => {
        const { type } = props.errors;
        if (type === 'required') return '탑승시간을 입력해주세요.';
        if (type === 'isForm') return '형식에 맞게 입력해주세요.[예) 09:45]';
    };

    const createRoute = data => {
        createRouteDetail({
            variables: {
                route: routeName,
                location: data.location,
                lat: latlng.lat,
                long: latlng.lng,
                boardingTime: data.boardingTime,
            },
        });
    };

    useEffect(() => {
        if (data) {
            const { success, message } = data.createRouteDetail;
            if (success) onClose(false);
            else console.log(message);
        }
    }, [data, onClose]);

    return (
        <Dialog open={open} onClose={handleClose} style={{ zIndex: 6000 }}>
            <MiniHeader handleClose={handleClose} headerText="정류장 생성" />
            <Box p={4}>
                <form
                    onSubmit={handleSubmit(data => createRoute(data))}
                    encType="multipart/form-data"
                >
                    <Box mb={1}>
                        <Controller
                            control={control}
                            name="location"
                            defaultValue=""
                            as={TextField}
                            size="small"
                            fullWidth
                            rules={{
                                required: true,
                            }}
                            error={errors.location ? true : false}
                            label="정류장 이름"
                            variant="outlined"
                            helperText={errors.location ? '정류장 이름을 입력해주세요.' : ' '}
                        />
                    </Box>
                    <Box mb={1}>
                        <Controller
                            control={control}
                            name="boardingTime"
                            defaultValue=""
                            as={TextField}
                            size="small"
                            rules={{
                                required: true,
                                validate: {
                                    isForm: value =>
                                        value.indexOf(':') !== -1 && value.length === 5,
                                },
                            }}
                            fullWidth
                            error={errors.boardingTime ? true : false}
                            label="탑승시간"
                            variant="outlined"
                            placeholder="HH:mm 형식으로 입력 [예) 09:45]"
                            helperText={
                                errors.boardingTime ? (
                                    <BoardingTimeHelperText errors={errors.boardingTime} />
                                ) : (
                                    ' '
                                )
                            }
                        />
                    </Box>
                    <Box display="flex" justifyContent="flex-end">
                        <Button type="submit" variant="contained" className={classes.searchButton}>
                            정류장 등록
                        </Button>
                    </Box>
                </form>
            </Box>
        </Dialog>
    );
};

const UpdateDialog = props => {
    // eslint-disable-next-line no-unused-vars
    const { open, onClose, marker, route, refetch } = props;
    const classes = RouteStyle();
    const { control, handleSubmit, errors } = useForm();

    const [updateDetailRoute, { data }] = useMutation(UPDATE_DETAIL_ROUTE, {
        onCompleted() {
            refetch();
        },
    });

    const [deleteDetailRoute, { data: deleteData }] = useMutation(DELETE_DETAIL_ROUTE, {
        onCompleted() {
            refetch();
        },
    });

    const handleClose = () => {
        onClose(false);
    };

    const deleteRouteClick = () => {
        deleteDetailRoute({
            variables: {
                partitionKey: route.partitionKey,
            },
        });
        marker.current.setMap(null);
    };

    const reviseRouteClick = data => {
        updateDetailRoute({
            variables: {
                partitionKey: route.partitionKey,
                lat: route.lat,
                long: route.long,
                route: route.route,
                boardingTime: data.boardingTime,
                location: data.location,
            },
        });
    };

    useEffect(() => {
        if (data) {
            const { success, message } = data.updateDetailRoute;
            if (success) {
                onClose(false);
            } else console.log(message);
        }
    }, [data, onClose]);

    useEffect(() => {
        if (deleteData) {
            const { success, message } = deleteData.deleteDetailRoute;
            if (success) {
                onClose(false);
            } else console.log(message);
        }
    }, [deleteData, onClose]);

    return (
        <Dialog open={open} onClose={handleClose} style={{ zIndex: 6000 }}>
            <MiniHeader handleClose={handleClose} headerText="정류장 수정/삭제" />
            <Box p={4}>
                <form onSubmit={handleSubmit(data => reviseRouteClick(data))}>
                    <Box mb={1} width="100%">
                        <Controller
                            name="location"
                            control={control}
                            defaultValue={route.location}
                            as={TextField}
                            size="small"
                            fullWidth
                            label="정류장 이름"
                            variant="outlined"
                            rules={{ required: true }}
                            error={errors.location ? true : false}
                            helperText={errors.location ? '정류장 이름을 입력해주세요.' : ' '}
                        />
                    </Box>
                    <Box mb={1} width="100%">
                        <Controller
                            name="boardingTime"
                            control={control}
                            defaultValue={route.boardingTime}
                            as={TextField}
                            size="small"
                            fullWidth
                            label="탑승시간"
                            variant="outlined"
                            rules={{ required: true }}
                            error={errors.boardingTime ? true : false}
                            helperText={errors.boardingTime ? '시간을 입력해주세요.' : ' '}
                        />
                    </Box>
                    <Box display="flex" justifyContent="flex-end">
                        <Box mr={1}>
                            <Button
                                type="submit"
                                variant="contained"
                                className={classes.reviseButton}
                            >
                                정류장 수정
                            </Button>
                        </Box>
                        <Box>
                            <Button
                                type="button"
                                variant="contained"
                                className={classes.deleteButton}
                                onClick={deleteRouteClick}
                            >
                                정류장 삭제
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Dialog>
    );
};

export default Route;
