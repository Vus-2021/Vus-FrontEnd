import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Home } from './pages';
import { useMediaQuery } from 'react-responsive';

const App = () => {
    const isMobile = useMediaQuery({
        query: '(max-width:600px)',
    });

    return <Switch>{isMobile && <Route path="/" component={Home} />}</Switch>;
};

export default App;
