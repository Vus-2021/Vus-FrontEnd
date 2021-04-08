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
    Dialog,
} from '@material-ui/core';
import { Search, Add } from '@material-ui/icons';
import { DataGrid } from '@material-ui/data-grid';
import { useForm, Controller } from 'react-hook-form';
import BoarderStyle from '../styles/BoarderStyle';
import { GET_BUS_APPLICANT, GET_ROUTE_BY_MONTH } from '../gql/boarder/query';
import { ADD_MONTHLY_ROUTE, RESET_MONTH_ROUTE } from '../gql/boarder/mutation';
import { useQuery, useMutation } from '@apollo/react-hooks';
import * as dayjs from 'dayjs';
import MiniHeader from '../layout/MiniHeader';

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
        renderCell: params => <ChipStyle state={params.value} />,
    },
    {
        field: 'state',
        headerName: '현월 선별',
        width: 120,
        renderCell: params => <ChipStyle state={params.value} />,
    },
];

const ChipStyle = props => {
    const classes = BoarderStyle();
    const { state } = props;

    let chipStyle, chipText;
    switch (state) {
        case 'fulfilled':
            chipStyle = classes.chipYes;
            chipText = '당첨';
            break;
        case 'rejected':
            chipStyle = classes.chipNo;
            chipText = '미당첨';
            break;
        case 'pending':
            chipStyle = classes.chipWait;
            chipText = '대기';
            break;
        default:
            chipStyle = classes.chipEmpty;
            chipText = '미신청';
    }

    return (
        <Chip
            className={chipStyle}
            size="small"
            label={<Typography className={classes.chipText}>{chipText}</Typography>}
        />
    );
};

const Boarder = props => {
    const { routeItems } = props;
    const classes = BoarderStyle();
    const { control, handleSubmit } = useForm();

    const [boardType, setBoardType] = useState(0);
    const [boardRow, setBoardRow] = useState([]);
    const [standard, setStandard] = useState({
        partitionKey: routeItems[0].partitionKey,
        route: routeItems[0].route,
        month: '',
        state: '',
        isCancellation: null,
    }); //  분류 기준(대기자, 노선, 월별)
    const [search, setSearch] = useState({
        name: null,
        userId: null,
        type: null,
    }); //검색 기준(이름, 아이디, 소속)
    const [monthSelect, setMonthSelect] = useState([]); //getRouteByMonth의 데이터를 담을 state
    const [openAddDialog, setOpenAddDialog] = useState(false); // 월 추가 Dialog의 open여부
    const [openReallyDialog, setOpenReallyDialog] = useState(false); //탑승객 초기화 Dialog의 open여부
    const [page, setPage] = useState(0);

    const { loading, data, refetch } = useQuery(GET_BUS_APPLICANT, {
        variables: {
            route: standard.route,
            month: standard.month,
            state: null,
            isCancellation: null,
        },
        fetchPolicy: 'no-cache',
    });

    const { loading: monthLoading, data: monthData, refetch: refetchMonth } = useQuery(
        GET_ROUTE_BY_MONTH,
        {
            variables: { partitionKey: standard.partitionKey },
            fetchPolicy: 'no-cache',
        },
    );

    const boardList = [
        {
            state: null,
            isCancellation: null,
            listName: '전체',
        },
        {
            state: 'fulfilled',
            isCancellation: false,
            listName: '당첨자',
        },
        {
            state: 'reject',
            isCancellation: false,
            listName: '미당첨자',
        },
        {
            state: 'pending',
            isCancellation: false,
            listName: '대기자',
        },
        {
            state: null,
            isCancellation: true,
            listName: '취소자',
        },
    ];

    const searchClick = data => {
        setPage(0);
        setSearch({
            [data.select]: data.search,
        });
    };

    const routeChange = e => {
        setPage(0);
        const partitionKey = e.target.value.split('+')[0];
        const routeName = e.target.value.split('+')[1];
        setStandard({ ...standard, partitionKey: partitionKey, route: routeName });
        refetchMonth({ partitionKey: standard.partitionKey });
    };

    const monthChange = e => {
        if (e.target.value !== 'add') {
            setPage(0);
            setStandard({ ...standard, month: e.target.value });
        }
    };

    const changeBoardType = index => {
        const { state, isCancellation } = boardList[index];
        setPage(0);
        setStandard({ ...standard, state: state, isCancellation: isCancellation });
        setBoardType(index);
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
        return () => {
            setBoardRow([]);
        };
    }, [data]);

    useEffect(() => {
        //분류 및 검색기준이 바뀌었을 때
        refetch({
            route: standard.route,
            month: standard.month,
            state: standard.state,
            name: search.name,
            userId: search.userId,
            type: search.type,
            isCancellation: standard.isCancellation,
        });
    }, [standard, search, refetch]);

    useEffect(() => {
        // 월 선택이 바뀌었을 때
        if (monthData) {
            const { success, message, data } = monthData.getRouteByMonth;
            if (success) {
                setMonthSelect(data);
                if (data.length > 0 && data[0].month)
                    setStandard(standard => ({ ...standard, month: data[data.length - 1].month }));
            } else console.log(message);
        }
        return () => {
            setMonthSelect([]);
        };
    }, [monthData]);

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
                            />
                        ))}
                    </Tabs>
                </Paper>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={1}>
                <Box display="flex" flexDirection="row" alignItems="center">
                    <Box mr={1} width="74px">
                        <FormControl variant="outlined" size="small" fullWidth>
                            <InputLabel>노선</InputLabel>
                            <Select
                                onChange={routeChange}
                                label="노선"
                                value={standard.partitionKey + '+' + standard.route}
                            >
                                {routeItems.map((data, index) => (
                                    <MenuItem
                                        key={data.route}
                                        value={data.partitionKey + '+' + data.route}
                                        selected={index === 0}
                                    >
                                        {data.route}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box mr={2} width="106px">
                        <FormControl variant="outlined" size="small" fullWidth>
                            <InputLabel>월 선택</InputLabel>
                            <Select
                                onChange={monthChange}
                                label="월 선택"
                                value={monthSelect.length > 0 ? standard.month : ''}
                            >
                                {monthSelect.map(data => (
                                    <MenuItem
                                        key={data.month}
                                        value={dayjs(data.month).format('YYYY-MM')}
                                    >
                                        {dayjs(data.month).format('YYYY-MM')}
                                    </MenuItem>
                                ))}
                                <MenuItem value="add" onClick={() => setOpenAddDialog(true)}>
                                    <Add />
                                    추가
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box>{boardRow.length}명 등록됨.</Box>
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
                    <Box width="100%" minHeight="500px" height="60vh">
                        <DataGrid
                            columns={columns}
                            rows={boardRow}
                            hideFooterSelectedRowCount
                            autoPageSize
                            loading={loading || monthLoading}
                            onPageChange={params => setPage(params.page)}
                            page={page}
                        />
                    </Box>
                </Paper>
            </Box>

            <Box display="flex" justifyContent="flex-end" mb={2}>
                {boardType === 0 && (
                    <Box>
                        <Button
                            variant="contained"
                            className={classes.resetAllButton}
                            onClick={() => setOpenReallyDialog(true)}
                        >
                            탑승객 전체 초기화
                        </Button>
                    </Box>
                )}
                {boardType === 3 && (
                    <React.Fragment>
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
                    </React.Fragment>
                )}
            </Box>

            <AddMonthDialog
                open={openAddDialog}
                onClose={setOpenAddDialog}
                monthSelect={monthSelect}
                refetchMonth={refetchMonth}
                currentRoute={standard.route}
                currentKey={standard.partitionKey}
            />
            <ReallyResetDialog
                open={openReallyDialog}
                onClose={setOpenReallyDialog}
                refetch={refetch}
                standard={standard}
                setPage={setPage}
            />
        </Box>
    );
};

const ReallyResetDialog = props => {
    const { open, onClose, refetch, standard, setPage } = props;
    const classes = BoarderStyle();

    const [resetMonthRoute, { data: resetData }] = useMutation(RESET_MONTH_ROUTE, {
        onCompleted() {
            refetch();
            onClose(false);
        },
    });

    const resetAll = () => {
        resetMonthRoute({
            variables: {
                month: standard.month,
                route: standard.route,
                busId: standard.partitionKey,
            },
        });
        setPage(0);
    };

    useEffect(() => {
        if (resetData) {
            const { success, message } = resetData.resetMonthRoute;
            if (success);
            else console.log(message);
        }
    }, [resetData]);

    return (
        <Dialog open={open} onClose={() => onClose(false)} fullWidth maxWidth="xs">
            <Box px={3} py={2}>
                <Box mb={2}>
                    <Typography className={classes.warningTitle}>
                        {standard.route}노선 탑승객 초기화
                    </Typography>
                </Box>
                <Box mb={3}>
                    <Typography className={classes.warningText}>
                        <strong>{dayjs(standard.month).format('YYYY년 MM월')}</strong>의 모든 신청
                        정보가 사라집니다.
                        <br />
                        정말 초기화 하시겠습니까?
                    </Typography>
                </Box>
                <Box display="flex" justifyContent="flex-end">
                    <Box mr={2} width="50%">
                        <Button
                            variant="contained"
                            onClick={resetAll}
                            className={classes.resetButton}
                            fullWidth
                        >
                            초기화
                        </Button>
                    </Box>
                    <Box width="50%">
                        <Button
                            variant="contained"
                            onClick={() => onClose(false)}
                            className={classes.decideButton}
                            fullWidth
                        >
                            취소
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
};

const AddMonthDialog = props => {
    const { open, onClose, monthSelect, currentRoute, currentKey, refetchMonth } = props;
    const classes = BoarderStyle();

    const lastMonth =
        monthSelect.length === 0
            ? dayjs(new Date()).subtract(1, 'month')
            : monthSelect[monthSelect.length - 1].month;
    const newMonth = dayjs(lastMonth).add(1, 'month').format('YYYY-MM');

    const [addMonthlyRoute] = useMutation(ADD_MONTHLY_ROUTE, {
        onCompleted() {
            refetchMonth();
        },
        fetchPolicy: 'no-cache',
    });

    const addButtonClick = () => {
        addMonthlyRoute({
            variables: { partitionKey: currentKey, route: currentRoute, month: newMonth },
        });
        refetchMonth({ variables: { partitionKey: currentKey } });
        onClose(false);
    };

    return (
        <Dialog open={open} onClose={() => onClose(false)}>
            <MiniHeader
                height="35px"
                headerText="노선 월 추가"
                handleClose={() => onClose(false)}
            />
            <Box p={4}>
                <Box mb={2} display="flex" width="316px">
                    <Box mr={1} width="35%">
                        <TextField
                            variant="outlined"
                            size="small"
                            defaultValue={currentRoute}
                            disabled
                            fullWidth
                            label="노선 명"
                        />
                    </Box>
                    <Box width="65%">
                        <TextField
                            variant="outlined"
                            size="small"
                            defaultValue={newMonth}
                            disabled
                            fullWidth
                            label="월 추가"
                        />
                    </Box>
                </Box>
                <Box display="flex" justifyContent="flex-end">
                    <Button
                        onClick={addButtonClick}
                        variant="contained"
                        className={classes.addButton}
                    >
                        월 추가하기
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default Boarder;
