import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    InputAdornment,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Paper,
    Chip,
    Tabs,
    Tab,
    Typography,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { DataGrid } from '@material-ui/data-grid';
import { useForm, Controller } from 'react-hook-form';
import BoarderStyle from '../styles/BoarderStyle';
import { GET_BUS_APPLICANT } from '../gql/boarder/query';
import { useQuery } from '@apollo/react-hooks';
import * as dayjs from 'dayjs';

const columns = [
    { field: 'name', headerName: '이름', width: 120 },
    { field: 'type', headerName: '소속', width: 120 },
    { field: 'userId', headerName: '아이디(사원번호)', width: 150 },
    { field: 'phoneNumber', headerName: '휴대폰번호', width: 150 },
    { field: 'registerDate', headerName: '입사날짜', width: 150 },
    {
        field: 'previousMonthState',
        headerName: '전월 선별',
        width: 120,
        renderCell: params => <ChipStyle type={params.value} />,
    },
];

const ChipStyle = props => {
    const classes = BoarderStyle();
    const { type } = props;

    return (
        <Chip
            className={type === 'apply' ? classes.chipYes : classes.chipNo}
            size="small"
            label={
                <Typography className={classes.chipText}>
                    {type === 'apply' ? '당첨' : '미당첨'}
                </Typography>
            }
        />
    );
};

const Boarder = props => {
    const { routeItems } = props;
    const classes = BoarderStyle();
    const { control, handleSubmit } = useForm();
    const [route, setRoute] = useState('강남');
    const [month, setMonth] = useState('2021-03');
    const [boardType, setBoardType] = useState(0);
    const [boardRow, setBoardRow] = useState([]);

    const { data, refetch } = useQuery(GET_BUS_APPLICANT, {
        variables: { route: route, month: month, state: null },
    });

    const boardList = [
        {
            state: null,
            listName: '전체',
        },
        {
            state: 'fullfilled',
            listName: '당첨자',
        },
        {
            state: 'reject',
            listName: '미당첨자',
        },
        {
            state: 'pending',
            listName: '대기자',
        },
        {
            state: 'cancel',
            listName: '취소자',
        },
    ];

    const searchClick = data => {
        console.log(data);
    };

    const routeChange = e => {
        setRoute(e.target.value);
        refetch({ route: e.target.value, month: month, state: boardList[boardType].state });
    };

    const monthChange = e => {
        setMonth(e.target.value);
        refetch({ route: route, month: e.target.value, state: boardList[boardType].state });
    };

    const changeBoardType = index => {
        const { state } = boardList[index];
        setBoardType(index);
        refetch({ route: route, month: month, state: state });
    };

    useEffect(() => {
        if (data) {
            const { success, message, data: applicantData } = data.getBusApplicant;
            if (success) {
                let boardDataChange = applicantData;
                boardDataChange.forEach(board => {
                    board.id = board.userId;
                    board.registerDate = dayjs(board.registerDate).format('YYYY-MM-DD');
                });
                setBoardRow(boardDataChange);
            } else console.log(message);
        }
    }, [data]);

    return (
        <Box px={15} pb={2} minWidth="600px">
            <Box mb={3} width="100%" minWidth="600px" display="flex" justifyContent="center">
                <Paper elevation={2}>
                    <Tabs
                        value={boardType}
                        onChange={(e, newValue) => {
                            changeBoardType(newValue);
                        }}
                        aria-label="register tabs"
                        textColor="primary"
                        indicatorColor="primary"
                    >
                        {boardList.map((data, index) => (
                            <Tab
                                key={data.listName}
                                value={index}
                                classes={{ root: classes.tab }}
                                label={
                                    <Typography className={classes.tabText}>
                                        {data.listName}
                                    </Typography>
                                }
                                disabled={index === 4} //취소자는 공사중.
                            />
                        ))}
                    </Tabs>
                </Paper>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={1}>
                <Box display="flex" flexDirection="row" alignItems="center">
                    <Box mr={1}>
                        <FormControl variant="outlined" size="small">
                            <InputLabel>노선</InputLabel>
                            <Select onChange={routeChange} label="노선" value={route}>
                                {routeItems.map(data => (
                                    <MenuItem key={data.route} value={data.route}>
                                        {data.route}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box mr={2}>
                        <FormControl variant="outlined" size="small">
                            <InputLabel>월 선택</InputLabel>
                            <Select onChange={monthChange} label="월 선택" value={month}>
                                <MenuItem value="2021-03">2021-03</MenuItem>
                                <MenuItem value="2021-04">2021-04</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box></Box>
                </Box>
                <Box>
                    <form onSubmit={handleSubmit(searchClick)}>
                        <Box display="flex" flexDirection="row" alignItems="center">
                            <Box width="230px" mr={1}>
                                <Controller
                                    name="search"
                                    control={control}
                                    as={TextField}
                                    defaultValue=""
                                    size="small"
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Controller
                                                    control={control}
                                                    name="select"
                                                    defaultValue="name"
                                                    render={props => (
                                                        <FormControl variant="standard">
                                                            <Select
                                                                defaultValue="name"
                                                                onChange={e =>
                                                                    props.onChange(e.target.value)
                                                                }
                                                                disableUnderline
                                                            >
                                                                <MenuItem value="name">
                                                                    이름
                                                                </MenuItem>
                                                                <MenuItem value="type">
                                                                    소속
                                                                </MenuItem>
                                                                <MenuItem value="userId">
                                                                    아이디
                                                                </MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    )}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                    placeholder="검색"
                                />
                            </Box>
                            <Box>
                                <Button
                                    size="large"
                                    type="submit"
                                    variant="outlined"
                                    className={classes.searchButton}
                                >
                                    검색
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </Box>
            </Box>
            <Box mb={1}>
                <Paper>
                    <Box width="100%" height="500px">
                        <DataGrid
                            columns={columns}
                            rows={boardRow}
                            hideFooterSelectedRowCount
                            autoPageSize
                        />
                    </Box>
                </Paper>
            </Box>
            {boardType === 3 && (
                <Box display="flex" justifyContent="flex-end" mb={2}>
                    <Box mr={1}>
                        <Button variant="contained" className={classes.decideButton}>
                            대기자 선별
                        </Button>
                    </Box>
                    <Box>
                        <Button variant="contained" className={classes.resetButton}>
                            대기자 초기화
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default Boarder;
