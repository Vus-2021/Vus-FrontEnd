import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    TextField,
    InputAdornment,
    Divider,
    ButtonBase,
    Typography,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { useQuery } from '@apollo/react-hooks';
import { GET_DETAIL_ROUTES } from '../gql/route/query';
import { useForm, Controller } from 'react-hook-form';

import SPRITE_IMAGE from '../../mobile/images/MarkerImages.png';
import ARRIVAL_IMAGE from '../../mobile/images/ArrivalMarker.png';
import MiniHeader from '../layout/MiniHeader';
import RouteStyle from '../styles/RouteStyle';

const { kakao } = window;

const Route = props => {
    const { routeName } = props;
    const { control, handleSubmit } = useForm();
    const classes = RouteStyle();

    const [latlng, setLatLng] = useState({
        lat: '',
        lng: '',
    });
    const [createDialog, setCreateDialog] = useState(false);
    const [search, setSearch] = useState('');
    const [listData, setListData] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [moveTo, setMoveTo] = useState({
        lat: '',
        lng: '',
    });

    const { data } = useQuery(GET_DETAIL_ROUTES, { variables: { route: routeName } });

    const searchList = (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
            setListData(data);
        } else alert('검색 결과가 없습니다.');
    };

    const listClick = (lat, lng) => {
        console.log(lat, lng);
    };

    useEffect(() => {
        let sizeRate = 0.48; //이미지 크기비율
        const MARKER_WIDTH = 78 * sizeRate, //마커 한개 가로 길이
            MARKER_HEIGHT = 114 * sizeRate, //마커 한개 세로 길이
            SPRITE_WIDTH = 390 * sizeRate, //마커 전체 가로 길이
            SPRITE_HEIGHT = 458 * sizeRate; //마커 전체 세로 길이

        const container = document.getElementById('kakaoMap');
        const options = {
            center: new kakao.maps.LatLng(37.220825, 127.07547), //바텍 위치
            level: 8,
        };

        if (data) {
            const { success, message, data: detailRoutes } = data.getDetailRoutes;
            if (success) {
                const map = new kakao.maps.Map(container, options);
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
                    });
                    marker.setMap(map);

                    bounds.extend(markerPosition);
                }

                map.setBounds(bounds);
                kakao.maps.event.addListener(map, 'click', e => {
                    const latlng = e.latLng;
                    setLatLng({
                        lat: latlng.getLat(),
                        lng: latlng.getLng(),
                    });
                    setCreateDialog(true);
                });
                if (search) {
                    const ps = new kakao.maps.services.Places();
                    ps.keywordSearch(search, searchList);
                }
            } else console.log(message);
        }
    }, [data, search]);

    return (
        <Box px={2} pt={0} minWidth="600px" height="95%">
            <Box display="flex" justifyContent="flex-end" height="40px">
                <Box mr={1}>
                    <Button variant="contained">노선 수정</Button>
                </Box>
                <Box>
                    <Button variant="contained">노선 삭제</Button>
                </Box>
            </Box>
            <Box position="absolute" zIndex="5000" minWidth="200px" p={0.5}>
                <Box p={1} className={classes.searchField}>
                    <form onSubmit={handleSubmit(data => setSearch(data.search))}>
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
                        </Box>
                    </form>
                    <Box overflow="auto" maxHeight="500px">
                        {listData.length > 0 &&
                            listData.map(data => (
                                <React.Fragment key={data.id}>
                                    <Box
                                        display="flex"
                                        component={ButtonBase}
                                        width="100%"
                                        height="50px"
                                        justifyContent="flex-start"
                                        pl={2}
                                        onClick={() => listClick(data.x, data.y)}
                                    >
                                        <Box
                                            display="flex"
                                            flexDirection="column"
                                            alignItems="flex-start"
                                        >
                                            <Box>
                                                <Typography className={classes.placeName}>
                                                    {data.place_name}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography className={classes.addressName}>
                                                    {data.address_name}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Divider />
                                </React.Fragment>
                            ))}
                    </Box>
                </Box>
            </Box>
            <Box id="kakaoMap" width="100%" height="98%">
                <CreateDialog open={createDialog} onClose={setCreateDialog} latlng={latlng} />
            </Box>
        </Box>
    );
};

const CreateDialog = props => {
    // eslint-disable-next-line no-unused-vars
    const { open, onClose, latlng } = props;

    const handleClose = () => {
        onClose(false);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <MiniHeader handleClose={handleClose} headerText="정류장 생성" />
            <Box p={4}>123</Box>
        </Dialog>
    );
};

export default Route;
