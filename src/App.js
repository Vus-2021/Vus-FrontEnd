import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Home, BusInfo } from './mobile/pages';
import { AdminHome, Admin, Error } from './desktop/pages';
import { useMediaQuery } from 'react-responsive';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayjsUtils from '@date-io/dayjs';

const App = () => {
    const isMobile = useMediaQuery({
        query: '(max-width:500px)',
    });

    return (
        <MuiPickersUtilsProvider utils={DayjsUtils}>
            {isMobile ? (
                <Switch>
                    <Route path="/" component={Home} exact />
                    <Route path="/businfo" component={BusInfo} />
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
