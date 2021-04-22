import React, { useState, useEffect } from 'react';
import {
    Dialog,
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Typography,
    Button,
} from '@material-ui/core';
import MiniHeader from '../layout/MiniHeader';
import BoarderStyle from '../styles/BoarderStyle';

const DetailBoarder = props => {
    const { open, onClose, boarderData } = props;
    const classes = BoarderStyle();

    const [state, setState] = useState(boarderData.state);

    const handleClose = () => {
        onClose(false);
    };

    useEffect(() => {
        if (boarderData.isCancellation === 'true') {
            setState('cancel');
        } else setState(boarderData.state);
    }, [boarderData]);

    const updateClick = () => {
        console.log(state);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <MiniHeader
                width="350px"
                height="35px"
                headerText="탑승객 선별 수정"
                handleClose={handleClose}
            />
            <Box p={4} width="286px">
                <Box height="70px" display="flex">
                    <Box width="40%" mr={2}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            disabled
                            label="이름"
                            value={boarderData.name}
                        />
                    </Box>
                    <Box width="60%">
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            disabled
                            label="아이디(사원번호)"
                            value={boarderData.userId}
                        />
                    </Box>
                </Box>

                <Box height="70px">
                    <FormControl fullWidth size="small" variant="outlined">
                        <InputLabel id="current-month-status">현월 선별</InputLabel>
                        <Select
                            labelId="current-month-status"
                            label="현월 선별"
                            value={state}
                            onChange={e => setState(e.target.value)}
                            style={{ textAlign: 'center' }}
                        >
                            {['fulfilled', 'reject', 'pending', 'cancel'].map(data => (
                                <MenuItem
                                    key={data}
                                    value={data}
                                    style={{ justifyContent: 'center' }}
                                >
                                    <ChipStyle state={data} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box>
                    <Button
                        fullWidth
                        variant="contained"
                        className={classes.reviseButton}
                        onClick={updateClick}
                    >
                        선별 수정
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

const ChipStyle = props => {
    const classes = BoarderStyle();
    const { state } = props;
    let chipStyle, chipText;

    switch (state) {
        case 'fulfilled':
            chipStyle = classes.chipYes;
            chipText = '당첨';
            break;
        case 'reject':
            chipStyle = classes.chipNo;
            chipText = '미당첨';
            break;
        case 'pending':
            chipStyle = classes.chipWait;
            chipText = '대기';
            break;
        case 'cancel':
            chipStyle = classes.chipCancel;
            chipText = '취소';
            break;
        default:
            chipStyle = classes.chipEmpty;
            chipText = '미신청';
    }

    return (
        <Chip
            className={chipStyle}
            size="small"
            label={
                <Typography
                    className={
                        state === 'pending' || state === 'cancel'
                            ? classes.darkChipText
                            : classes.chipText
                    }
                >
                    {chipText}
                </Typography>
            }
        />
    );
};

export default DetailBoarder;
