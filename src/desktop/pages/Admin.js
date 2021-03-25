import React, { useState } from 'react';
import Header from '../layout/Header';
import AdminStyle from '../styles/AdminStyle';
import { Box, Typography } from '@material-ui/core';
import clsx from 'clsx';

import User from './User';

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
                    <Box width="100%" height="40px">
                        <Typography className={classes.titleText}>{state.titleName}</Typography>
                    </Box>
                    <Box width="100%" className={classes.viewBox}>
                        <SelectView view={state.view} setState={setState} />
                    </Box>
                </Box>
            </div>
        </React.Fragment>
    );
};

const SelectView = props => {
    const { view } = props;

    switch (view) {
        case 'userDefault':
            return <React.Fragment>{User}</React.Fragment>;
        default:
            return <div>default!</div>;
    }
};

export default Admin;
