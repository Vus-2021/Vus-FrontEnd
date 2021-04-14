import React from 'react';
import { SvgIcon } from '@material-ui/core';

const ArrowDown = props => {
    return (
        <SvgIcon {...props}>
            <path d="M2.82 6L12 15.16L21.18 6L24 8.82L12 20.82L0 8.82L2.82 6Z" />
        </SvgIcon>
    );
};

export default ArrowDown;
