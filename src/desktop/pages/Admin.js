import React, { useState } from 'react';
import Header from '../layout/Header';
import AdminStyle from '../styles/AdminStyle';
import { Box, Typography } from '@material-ui/core';
import clsx from 'clsx';

import User from './User';
import Route from './Route';
import Notice from './Notice';

const Admin = () => {
    const classes = AdminStyle();
    const [adminName] = useState('김바텍');
    const [openDrawer, setOpenDrawer] = useState(false);
    const [state, setState] = useState({
        titleName: '사용자 관리',
        view: 'userDefault',
    });

    return (
        <React.Fragment>
            <div className={classes.rootBox}>
                <Header
                    adminName={adminName}
                    openDrawer={openDrawer}
                    setOpenDrawer={setOpenDrawer}
                    setState={setState}
                />

                <Box className={clsx(classes.mainBox, { [classes.mainBoxShift]: openDrawer })}>
                    <Box height="40px" ml={5}>
                        <Typography className={classes.titleText}>{state.titleName}</Typography>
                    </Box>
                    <Box className={classes.viewBox}>
                        <SelectView view={state.view} setState={setState} />
                    </Box>
                </Box>
            </div>
        </React.Fragment>
    );
};

const SelectView = props => {
    const { view } = props;

    console.log({ User });
    switch (view) {
        case 'userDefault':
            return <User />;
        case 'routeDefault':
            return <Route />;
        case 'noticeDefault':
            return <Notice />;
        default:
            return <div>default!</div>;
    }
};

export default Admin;
