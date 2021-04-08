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
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import { GET_ADMIN_NOTICE, GET_ONE_ADMIN_NOTICE } from '../gql/notice/query';
import { DELETE_NOTICE } from '../gql/notice/mutation';
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
    const [selection, setSelection] = useState([]); //선택한 공지글들의 partitionKey를 담음.
    const [noticeDialog, setNoticeDialog] = useState(false); //noticeDialog의 open 여부
    const [detailDialog, setDetailDialog] = useState(false); //detailDialog의 open 여부
    const [noticeRows, setNoticeRows] = useState([]); //공지글 항목
    const [partitionKey, setPartitionKey] = useState(''); //공지글 partitionKey
    const [search, setSearch] = useState({
        notice: null,
        author: null,
        content: null,
    });
    const [page, setPage] = useState(0);

    const { handleSubmit, control } = useForm();

    const { data, loading, refetch } = useQuery(GET_ADMIN_NOTICE);

    const [getOneAdminNotice, { data: oneNoticeData }] = useLazyQuery(GET_ONE_ADMIN_NOTICE, {
        fetchPolicy: 'no-cache',
    });

    const [deleteNotice] = useMutation(DELETE_NOTICE, {
        onCompleted() {
            refetch();
        },
    });

    const searchClick = data => {
        setPage(0);
        setSearch({
            [data.select]: data.search,
        });
    };

    const deleteUserClick = () => {
        deleteNotice({ variables: { partitionKey: selection } });
        setSelection([]);
        setPage(0);
    };

    const handleCellClick = pk => {
        getOneAdminNotice({ variables: { partitionKey: pk } });
        setDetailDialog(true);
        setPartitionKey(pk);
    };

    useEffect(() => {
        refetch({
            notice: search.notice,
            author: search.author,
            content: search.content,
        });
    }, [search, refetch]);

    useEffect(() => {
        if (data) {
            const { success, message, data: noticeData } = data.getAdminNotice;
            if (success) {
                let noticeDataChange = noticeData;
                noticeDataChange.forEach(notice => {
                    notice.id = notice.partitionKey;
                    notice.createdAt = dayjs(notice.createdAt).format('YYYY-MM-DD');
                    notice.updatedAt = dayjs(notice.updatedAt).format('YYYY-MM-DD');
                });
                setNoticeRows(noticeDataChange);
            } else {
                console.log(message);
            }
        }
    }, [data]);

    return (
        <Box px={15} pt={5} minWidth="600px">
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
                                                        <FormControl variant="standard">
                                                            <Select
                                                                defaultValue="notice"
                                                                onChange={e =>
                                                                    props.onChange(e.target.value)
                                                                }
                                                                disableUnderline
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
                    <Box width="100%" minHeight="500px" height="65vh">
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
                                setSelection(newSelection.selectionModel);
                            }}
                            onCellClick={cellClick => {
                                const { field, id } = cellClick;
                                if (field !== '__check__') handleCellClick(id);
                            }}
                            onPageChange={params => setPage(params.page)}
                            page={page}
                            loading={loading}
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
            <CreateNoticeDialog open={noticeDialog} onClose={setNoticeDialog} refetch={refetch} />
            <DetailNoticeDialog
                open={detailDialog}
                onClose={setDetailDialog}
                noticeData={oneNoticeData}
                partitionKey={partitionKey}
                refetch={refetch}
            />
        </Box>
    );
};

export default Notice;
