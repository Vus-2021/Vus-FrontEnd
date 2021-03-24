import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab, AppBar } from '@material-ui/core';
import { Map, PinDrop } from '@material-ui/icons';
import Header2 from '../layout/Header2';

const BusInfo = ({ history, location }) => {
    const busName = location.state.busName + '노선';
    const [boardNum, setNumber] = useState(0);

    const handleClose = () => {
        history.push('/');
    };
    return (
        <Box height="100%">
            <Header2 handleClose={handleClose} headerText={busName} />
            <Box>
                <AppBar color="transparent" height="10%" position="static">
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
            <Box height="90%" p={1}>
                {boardNum === 0 && <MapTabPanel />}
                {boardNum === 1 && <RouteTabPanel />}
            </Box>
        </Box>
    );
};

const MapTabPanel = () => {
    const { kakao } = window;
    useEffect(() => {
        const container = document.getElementById('kakaoMap');
        const options = {
            center: new kakao.maps.LatLng(37.220825, 127.07547),
            level: 3,
        };
        // eslint-disable-next-line no-unused-vars
        const map = new kakao.maps.Map(container, options);
        map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);
    }, [kakao]);

    return <Box id="kakaoMap" height="100%" width="100%"></Box>;
};

const RouteTabPanel = () => {
    return <Box>Hi!</Box>;
};

export default BusInfo;
