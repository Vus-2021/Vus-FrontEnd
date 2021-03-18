import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Home } from './pages';
import { useMediaQuery } from 'react-responsive';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayjsUtils from '@date-io/dayjs';

const App = () => {
    const isMobile = useMediaQuery({
        query: '(max-width:600px)',
    });

    return (
        <MuiPickersUtilsProvider utils={DayjsUtils}>
            {isMobile && (
                <Switch>
                    <Route path="/" component={Home} exact />
                </Switch>
            )}
        </MuiPickersUtilsProvider>
    );
};

export default App;
