import React, { useRef, createContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { UserHome, DriverHome, BusInfo, Notice, MyInformation } from './mobile/pages';
import { Admin, Error } from './desktop/pages';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayjsUtils from '@date-io/dayjs';

export const WebSocketContext = createContext(null);

const App = () => {
    const webSocketUrl = 'wss://khu5f5v0we.execute-api.ap-northeast-2.amazonaws.com/dev';
    const ws = useRef(null);

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
            <WebSocketContext.Provider value={ws}>
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
            </WebSocketContext.Provider>
        </MuiPickersUtilsProvider>
    );
};

export default App;
