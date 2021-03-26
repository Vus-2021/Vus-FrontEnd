import React, { useEffect, useState } from 'react';
import { Box, Dialog, TextField, Button, IconButton, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Cancel } from '@material-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import NoticeStyle from '../styles/NoticeStyle';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_ADMIN_NOTICE } from '../gql/notice/mutation';

const CreateNotice = props => {
    const { open, onClose } = props;
    const classes = NoticeStyle();
    const { handleSubmit, control, errors } = useForm();
    const [openSnackbar, setSnackbar] = useState(false);

    const [createAdminNotice, { data }] = useMutation(CREATE_ADMIN_NOTICE);

    const handleClose = () => {
        onClose(false);
        setSnackbar(false);
    };

    const createNoticeClick = data => {
        console.log(data);
        createAdminNotice({
            variables: {
                noticeType: 'ADMIN',
                notice: data.notice,
                content: data.content,
            },
        });
        setSnackbar(true);
    };

    useEffect(() => {
        if (data) {
            const { success, message } = data.createAdminNotice;
            if (!success) console.log(message);
        }
    }, [data]);

    return (
        <Dialog open={open} fullWidth maxWidth="sm" onClose={handleClose}>
            <Box display="flex" justifyContent="flex-end" mb={1}>
                <IconButton onClick={() => onClose(false)}>
                    <Cancel className={classes.iconStyle} />
                </IconButton>
            </Box>
            <Box px={6} pt={2} pb={4}>
                <form onSubmit={handleSubmit(createNoticeClick)}>
                    <Box height="100px" width="100%">
                        <Controller
                            as={TextField}
                            name="notice"
                            control={control}
                            defaultValue=""
                            label="제목"
                            fullWidth
                            variant="outlined"
                            size="medium"
                            rules={{ required: true }}
                            error={errors.notice ? true : false}
                            helperText={errors.notice ? '내용을 입력해주세요.' : ' '}
                        />
                    </Box>
                    <Box width="100%" mb={1}>
                        <Controller
                            as={TextField}
                            name="content"
                            control={control}
                            defaultValue=""
                            label="내용"
                            fullWidth
                            variant="outlined"
                            size="medium"
                            rows={20}
                            multiline
                            rules={{ required: true }}
                            error={errors.content ? true : false}
                            helperText={errors.content ? '내용을 입력해주세요.' : ' '}
                        />
                    </Box>
                    <Box height="40px" mb={2} display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            type="submit"
                            size="medium"
                            className={classes.createButton}
                        >
                            생성
                        </Button>
                    </Box>
                </form>
            </Box>
            <Snackbar open={openSnackbar} autoHideDuration={1500} onClose={handleClose}>
                <Alert severity="success">공지가 생성되었습니다.</Alert>
            </Snackbar>
        </Dialog>
    );
};

export default CreateNotice;
