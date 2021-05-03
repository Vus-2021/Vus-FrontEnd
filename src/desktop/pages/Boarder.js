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
    Typography,
    Dialog,
} from '@material-ui/core';
import { Search, DeleteForever } from '@material-ui/icons';
import { DataGrid, GridToolbarContainer } from '@material-ui/data-grid';
import { useForm, Controller } from 'react-hook-form';
import BoarderStyle from '../styles/BoarderStyle';
import { GET_BUS_APPLICANT } from '../gql/boarder/query';
import { RESET_MONTH_ROUTE, INIT_PASSENGERS } from '../gql/boarder/mutation';
import { useQuery, useMutation } from '@apollo/react-hooks';
import * as dayjs from 'dayjs';
import BoarderSelectionDialog from './BoarderSelection';

import DetailBoarderDialog from './DetailBoarder';

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
        case 'reject':
            chipStyle = classes.chipNo;
            chipText = '미당첨';
            break;
        case 'pending':
            chipStyle = classes.chipWait;
            chipText = '대기';
            break;
        case 'cancelled':
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
                        state === 'pending' || state === 'cancelled'
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

const Boarder = props => {
    const { routeItems, month } = props;
    const classes = BoarderStyle();
    const { control, handleSubmit } = useForm();

    const [boardType, setBoardType] = useState(0);
    const [boardRow, setBoardRow] = useState([]);
    const [standard, setStandard] = useState({
        partitionKey: routeItems[0].partitionKey,
        route: routeItems[0].route,
        state: '',
        isCancellation: null,
    }); //  분류 기준(대기자, 노선, 월별)
    const [search, setSearch] = useState({
        name: null,
        userId: null,
        type: null,
    }); //검색 기준(이름, 아이디, 소속)
    const [openApplyDialog, setOpenApplyDialog] = useState(false); //탑승 신청 초기화 Dialog의 open여부
    const [openResetSelectionDialog, setOpenResetSelectionDialog] = useState(false); //대기자 선별 초기화 Dialog의 open여부
    const [openSelectionDialog, setOpenSelectionDialog] = useState(false); //대기자 선별 Dialog open여부
    const [page, setPage] = useState(0);
    const [selection, setSelection] = useState([]); //선택한 탑승객들의 partitionKey를 담음.
    const [boarderData, setBoarderData] = useState({}); //탑승객 한명의 데이터
    const [detailDialog, setDetailDialog] = useState(false); //탑승객 신청 정보 수정 Dialog의 open여부

    const { loading, data, refetch } = useQuery(GET_BUS_APPLICANT, {
        variables: {
            route: standard.route,
            month: month,
            state: null,
            isCancellation: null,
        },
        fetchPolicy: 'no-cache',
    });

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

    const handleCellClick = row => {
        setBoarderData(row);
        setDetailDialog(true);
    };

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
    };

    const changeBoardType = index => {
        const { state, isCancellation } = boardList[index];
        setPage(0);
        setStandard({ ...standard, state: state, isCancellation: isCancellation });
        setBoardType(index);
    };

    const selectionClick = () => {
        //대기자 선별 클릭
        setOpenSelectionDialog(true);
    };

    useEffect(() => {
        if (data) {
            const { success, message, data: applicantData } = data.getBusApplicant;
            if (success) {
                let boardDataChange = applicantData;
                boardDataChange.forEach(board => {
                    board.id = board.userId;
                    board.registerDate = dayjs(board.registerDate).format('YYYY-MM-DD');
                    if (board.isCancellation) board.state = 'cancelled';
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
            month: month,
            state: standard.state,
            name: search.name,
            userId: search.userId,
            type: search.type,
            isCancellation: standard.isCancellation,
        });
    }, [standard, search, refetch, month]);

    return (
        <Box px={15} pt={2} minWidth="600px">
            <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={1}>
                <Box display="flex" flexDirection="row" alignItems="center">
                    <Box mr={1}>
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
                    <Box mr={2}>
                        <FormControl variant="outlined" size="small" fullWidth>
                            <InputLabel>선별 여부</InputLabel>
                            <Select
                                onChange={e => changeBoardType(e.target.value)}
                                label="선별 여부"
                                defaultValue={0}
                            >
                                {boardList.map((data, index) => (
                                    <MenuItem key={data.listName} value={index}>
                                        {data.listName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
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
                    <Box width="100%" minHeight="540px" height="65vh">
                        <DataGrid
                            columns={columns.map(column => ({
                                ...column,
                                disableClickEventBubbling: true,
                            }))}
                            rows={boardRow}
                            checkboxSelection
                            autoPageSize
                            onSelectionModelChange={newSelection => {
                                setSelection(newSelection.selectionModel);
                            }}
                            onCellClick={cellClick => {
                                const { field, row } = cellClick;
                                if (field !== '__check__') handleCellClick(row);
                            }}
                            localeText={{
                                footerRowSelected: count => `${count}명 선택됨.`,
                            }}
                            loading={loading}
                            onPageChange={params => setPage(params.page)}
                            page={page}
                            components={{ Toolbar: CustomToolbar }}
                            componentsProps={{
                                toolbar: {
                                    selection: selection,
                                    deleteBoarderClick: () => setOpenApplyDialog(true),
                                    selectionClick: selectionClick,
                                    setOpenResetSelectionDialog: setOpenResetSelectionDialog,
                                    boardType: boardType,
                                },
                            }}
                        />
                    </Box>
                </Paper>
            </Box>
            <ApplyResetDialog
                open={openApplyDialog}
                onClose={setOpenApplyDialog}
                refetch={refetch}
                standard={standard}
                setPage={setPage}
                selection={selection}
                setSelection={setSelection}
                month={month}
            />
            <BoarderSelectionDialog
                open={openSelectionDialog}
                onClose={setOpenSelectionDialog}
                refetch={refetch}
                standard={standard}
                setPage={setPage}
                month={month}
            />
            <SelectionResetDialog
                open={openResetSelectionDialog}
                onClose={setOpenResetSelectionDialog}
                refetch={refetch}
                standard={standard}
                setPage={setPage}
                month={month}
            />
            <DetailBoarderDialog
                open={detailDialog}
                onClose={setDetailDialog}
                refetch={refetch}
                boarderData={boarderData}
                month={month}
            />
        </Box>
    );
};

const CustomToolbar = props => {
    const {
        selection,
        deleteNoticeClick,
        selectionClick,
        setOpenResetSelectionDialog,
        boardType,
    } = props;
    const classes = BoarderStyle();
    // const deviceMode = useContext(DeviceMode);

    return (
        <GridToolbarContainer className={classes.customToolBar}>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width={boardType === 0 ? '100%' : null}
            >
                <Box display="flex" alignItems="center">
                    <Box mr={2}>
                        <Button
                            size="small"
                            variant="contained"
                            color="secondary"
                            className={classes.buttonDelete}
                            onClick={deleteNoticeClick}
                            disabled={selection.length === 0}
                        >
                            <DeleteForever /> <Typography>&nbsp;삭제</Typography>
                        </Button>
                    </Box>
                    <Box>
                        <Typography>{selection.length}명 선택됨</Typography>
                    </Box>
                </Box>
                {boardType === 0 && (
                    <Box>
                        <Box display="flex" alignItems="center">
                            <Box mr={1}>
                                <Button
                                    variant="contained"
                                    className={classes.selectionDecideButton}
                                    onClick={selectionClick}
                                >
                                    대기자 선별
                                </Button>
                            </Box>
                            <Box>
                                <Button
                                    variant="contained"
                                    className={classes.selectionResetButton}
                                    onClick={() => setOpenResetSelectionDialog(true)}
                                >
                                    선별 초기화
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Box>
        </GridToolbarContainer>
    );
};

const ApplyResetDialog = props => {
    const { open, onClose, refetch, standard, setPage, selection, setSelection, month } = props;
    const classes = BoarderStyle();

    const [resetMonthRoute, { data: resetData }] = useMutation(RESET_MONTH_ROUTE, {
        onCompleted() {
            refetch();
        },
    });

    const resetAll = () => {
        resetMonthRoute({
            variables: {
                month: month,
                route: standard.route,
                busId: standard.partitionKey,
                userId: selection,
            },
        });
        setPage(0);
        setSelection([]);
    };

    useEffect(() => {
        if (resetData) {
            const { success, message } = resetData.resetMonthRoute;
            if (success) onClose(false);
            else console.log(message);
        }
    }, [resetData, onClose]);

    return (
        <Dialog open={open} onClose={() => onClose(false)}>
            <Box px={3} py={2}>
                <Box mb={2}>
                    <Typography className={classes.warningTitle}>
                        {standard.route}노선 탑승객 초기화
                    </Typography>
                </Box>
                <Box mb={3}>
                    <Typography className={classes.warningText}>
                        선택한 <strong>{selection.length}명</strong>의{' '}
                        <strong>{dayjs(month).format('YYYY년 MM월')}</strong> 신청 정보가
                        사라집니다.
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

const SelectionResetDialog = props => {
    const { open, onClose, standard, setPage, refetch, month } = props;
    const classes = BoarderStyle();

    const [initPassengers, { data }] = useMutation(INIT_PASSENGERS, {
        onCompleted() {
            refetch();
        },
    });

    const resetAll = () => {
        initPassengers({
            variables: {
                month: month,
                route: standard.route,
                busId: standard.partitionKey,
            },
        });
        setPage(0);
    };

    useEffect(() => {
        if (data) {
            const { success, message } = data.initPassengers;
            if (success) onClose(false);
            else console.log(message);
        }
    }, [data, onClose]);

    return (
        <Dialog open={open} onClose={() => onClose(false)} fullWidth maxWidth="xs">
            <Box px={3} py={2}>
                <Box mb={2}>
                    <Typography className={classes.warningTitle}>
                        {standard.route}노선 선별 초기화
                    </Typography>
                </Box>
                <Box mb={3}>
                    <Typography className={classes.warningText}>
                        <strong>{dayjs(month).format('YYYY년 MM월')}</strong>의 모든 선별 정보가
                        사라집니다.
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

// const AddMonthDialog = props => {
//     const { open, onClose, monthSelect, currentRoute, currentKey, refetchMonth } = props;
//     const classes = BoarderStyle();

//     const lastMonth =
//         monthSelect.length === 0
//             ? dayjs(new Date()).subtract(1, 'month')
//             : monthSelect[monthSelect.length - 1].month;
//     const newMonth = dayjs(lastMonth).add(1, 'month').format('YYYY-MM');

//     const [addMonthlyRoute] = useMutation(ADD_MONTHLY_ROUTE, {
//         onCompleted() {
//             refetchMonth();
//         },
//         fetchPolicy: 'no-cache',
//     });

//     const addButtonClick = () => {
//         addMonthlyRoute({
//             variables: { partitionKey: currentKey, route: currentRoute, month: newMonth },
//         });
//         refetchMonth({ variables: { partitionKey: currentKey } });
//         onClose(false);
//     };

//     return (
//         <Dialog open={open} onClose={() => onClose(false)}>
//             <MiniHeader
//                 height="35px"
//                 headerText="노선 월 추가"
//                 handleClose={() => onClose(false)}
//             />
//             <Box p={4}>
//                 <Box mb={2} display="flex" width="316px">
//                     <Box mr={1} width="35%">
//                         <TextField
//                             variant="outlined"
//                             size="small"
//                             defaultValue={currentRoute}
//                             disabled
//                             fullWidth
//                             label="노선 명"
//                         />
//                     </Box>
//                     <Box width="65%">
//                         <TextField
//                             variant="outlined"
//                             size="small"
//                             defaultValue={newMonth}
//                             disabled
//                             fullWidth
//                             label="월 추가"
//                         />
//                     </Box>
//                 </Box>
//                 <Box display="flex" justifyContent="flex-end">
//                     <Button
//                         onClick={addButtonClick}
//                         variant="contained"
//                         className={classes.addButton}
//                     >
//                         월 추가하기
//                     </Button>
//                 </Box>
//             </Box>
//         </Dialog>
//     );
// };

export default Boarder;
