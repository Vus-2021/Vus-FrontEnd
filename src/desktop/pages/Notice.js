import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    TextField,
    InputAdornment,
    FormControl,
    MenuItem,
    Select,
    Paper,
} from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { DeleteForever, Search } from '@material-ui/icons';
import NoticeStyle from '../styles/NoticeStyle';
import { useForm, Controller } from 'react-hook-form';
import CreateNoticeDialog from './CreateNotice';
import DetailNoticeDialog from './DetailNotice';
import { useQuery } from '@apollo/react-hooks';
import { GET_ADMIN_NOTICE } from '../gql/notice/query';
import * as dayjs from 'dayjs';

const columns = [
    { field: 'notice', headerName: '제목', width: 250 },
    { field: 'author', headerName: '작성자', width: 100 },
    { field: 'userId', headerName: '아이디', width: 130 },
    { field: 'createdAt', headerName: '생성날짜', width: 120 },
    { field: 'updatedAt', headerName: '수정날짜', width: 120 },
];

const Notice = () => {
    const classes = NoticeStyle();
    const [selection, setSelection] = useState([]);
    const [noticeDialog, setNoticeDialog] = useState(false);
    const [detailDialog, setDetailDialog] = useState(false);
    const [detailUserId, setDetailUserId] = useState(''); //공지글 작성자 정보
    const [noticeRows, setNoticeRows] = useState([]);

    const { handleSubmit, control } = useForm();

    const { data, refetch } = useQuery(GET_ADMIN_NOTICE);

    const searchClick = data => {
        console.log(data);
    };

    const deleteUserClick = () => {
        console.log('delete');
    };

    const handleCellClick = data => {
        setDetailDialog(true);
        setDetailUserId(data);
    };

    useEffect(() => {
        refetch();
    }, [noticeDialog, detailDialog, refetch]);

    useEffect(() => {
        if (data) {
            const { success, message, data: noticeData } = data.getAdminNotice;
            if (success) {
                let noticeDataChange = noticeData;
                noticeDataChange.forEach(notice => {
                    notice.id = notice.partitionKey + '+' + notice.sortKey;
                    notice.createdAt = dayjs(notice.createdAt).format('YYYY-MM-DD');
                    notice.updatedAt = dayjs(notice.updatedAt).format('YYYY-MM-DD');
                });
                setNoticeRows(noticeDataChange);
                console.log(noticeDataChange);
            } else {
                console.log(message);
            }
        }
    }, [data]);

    return (
        <Box px={15} pt={5}>
            <Box mb={1} display="flex" justifyContent="space-between" alignItems="flex-end">
                <Box display="flex" flexDirection="row" alignItems="center">
                    <Box mr={2}>
                        <Button
                            size="small"
                            variant="contained"
                            color="secondary"
                            className={classes.buttonDelete}
                            onClick={deleteUserClick}
                            disabled={selection.length === 0}
                        >
                            <DeleteForever /> <Typography>&nbsp;삭제</Typography>
                        </Button>
                    </Box>
                    <Box>
                        <Typography>{selection.length}개 선택됨</Typography>
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
                                                    defaultValue="notice"
                                                    render={props => (
                                                        <FormControl
                                                            size="small"
                                                            variant="standard"
                                                        >
                                                            <Select
                                                                defaultValue="notice"
                                                                onChange={e =>
                                                                    props.onChange(e.target.value)
                                                                }
                                                            >
                                                                <MenuItem value="notice">
                                                                    제목
                                                                </MenuItem>
                                                                <MenuItem value="author">
                                                                    작성자
                                                                </MenuItem>
                                                                <MenuItem value="content">
                                                                    내용
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
                            columns={columns.map(column => ({
                                ...column,
                                disableClickEventBubbling: true,
                            }))}
                            rows={noticeRows}
                            checkboxSelection
                            hideFooterSelectedRowCount
                            autoPageSize
                            onSelectionModelChange={newSelection => {
                                console.log(newSelection);
                                setSelection(newSelection.selectionModel);
                            }}
                            onCellClick={cellClick => {
                                const { field, id } = cellClick;
                                if (field !== '__check__') handleCellClick(id);
                            }}
                        />
                    </Box>
                </Paper>
            </Box>
            <Box display="flex" justifyContent="flex-end">
                <Button
                    variant="contained"
                    className={classes.registerButton}
                    color="primary"
                    onClick={() => setNoticeDialog(true)}
                >
                    <Typography>공지 생성</Typography>
                </Button>
            </Box>
            <CreateNoticeDialog open={noticeDialog} onClose={setNoticeDialog} />
            <DetailNoticeDialog
                open={detailDialog}
                onClose={setDetailDialog}
                userId={detailUserId}
            />
        </Box>
    );
};

export default Notice;
