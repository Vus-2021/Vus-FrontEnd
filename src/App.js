import React, { useRef, createContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { UserHome, DriverHome, BusInfo, Notice, MyInformation } from './mobile/pages';
import { Admin, Error } from './desktop/pages';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayjsUtils from '@date-io/dayjs';
import { useMediaQuery } from '@material-ui/core';
import * as dayjs from 'dayjs';

export const WebSocketContext = createContext(null);
export const DeviceMode = createContext(null);

const App = () => {
    const webSocketUrl = 'wss://khu5f5v0we.execute-api.ap-northeast-2.amazonaws.com/dev';
    const ws = useRef(null);

    const device = useMediaQuery('(max-width: 540px)');

    ws.current = new WebSocket(webSocketUrl);
    ws.current.onopen = () => {
        console.log('Connected to ' + webSocketUrl);
    };
    ws.current.onclose = error => {
        const currHour = dayjs().hour();
        if (currHour >= 7 && currHour < 9) window.location.reload();
        console.log(error);
    };
    ws.current.onerror = error => {
        console.log(error);
    };
    return (
        <MuiPickersUtilsProvider utils={DayjsUtils}>
            <WebSocketContext.Provider value={ws}>
                <DeviceMode.Provider value={device}>
                    <Switch>
                        <React.Fragment>
                            <Route path="/" component={UserHome} exact />
                            <Route path="/driver" component={DriverHome} />
                            <Route path="/notice" component={Notice} />
                            <Route path="/businfo" component={BusInfo} />
                            <Route path="/myinfo" component={MyInformation} />
                            {/* <Route path="/" component={AdminHome} exact /> */}
                            <Route path="/admin" component={Admin} />
                            <Route path="/error" component={Error} />
                        </React.Fragment>
                    </Switch>
                </DeviceMode.Provider>
            </WebSocketContext.Provider>
        </MuiPickersUtilsProvider>
    );
};

export default App;
