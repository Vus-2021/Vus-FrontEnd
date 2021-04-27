import React, { useRef, createContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { UserHome, DriverHome, BusInfo, Notice, MyInformation } from './mobile/pages';
import { AdminHome, Admin, Error } from './desktop/pages';
import { useMediaQuery } from 'react-responsive';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayjsUtils from '@date-io/dayjs';

export const WebSocketContext = createContext(null);

const App = () => {
    const webSocketUrl = 'wss://khu5f5v0we.execute-api.ap-northeast-2.amazonaws.com/dev';
    const ws = useRef(null);

    const isMobile = useMediaQuery({
        query: '(max-width:500px)',
    });

    ws.current = new WebSocket(webSocketUrl);
    ws.current.onopen = () => {
        console.log('Connected to ' + webSocketUrl);
    };
    ws.current.onclose = error => {
        console.log(error);
    };
    ws.current.onerror = error => {
        console.log(error);
    };

    return (
        <MuiPickersUtilsProvider utils={DayjsUtils}>
            {isMobile ? (
                <Switch>
                    <WebSocketContext.Provider value={ws}>
                        <Route path="/" component={UserHome} exact />
                        <Route path="/driver" component={DriverHome} />
                        <Route path="/notice" component={Notice} />
                        <Route path="/businfo" component={BusInfo} />
                        <Route path="/myinfo" component={MyInformation} />
                    </WebSocketContext.Provider>
                </Switch>
            ) : (
                <Switch>
                    <Route path="/" component={AdminHome} exact />
                    <Route path="/admin" component={Admin} />
                    <Route path="/error" component={Error} />
                </Switch>
            )}
        </MuiPickersUtilsProvider>
    );
};

export default App;
