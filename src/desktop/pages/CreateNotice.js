import React, { useEffect, useState, useContext } from 'react';
import {
    Box,
    Dialog,
    TextField,
    Button,
    IconButton,
    Snackbar,
    FormControl,
    FormLabel,
    FormHelperText,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Cancel } from '@material-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import NoticeStyle from '../styles/NoticeStyle';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_ADMIN_NOTICE } from '../gql/notice/mutation';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import editorConfiguration from './customTextEditor';
import { DeviceMode } from '../../App';

const CreateNotice = props => {
    const { open, onClose, refetch } = props;
    const deviceMode = useContext(DeviceMode);
    const classes = NoticeStyle();
    const { handleSubmit, control, errors, setValue } = useForm();
    const [openSnackbar, setSnackbar] = useState(false);

    const [createAdminNotice, { data }] = useMutation(CREATE_ADMIN_NOTICE, {
        onCompleted() {
            refetch();
        },
    });

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
            <Box px={6} pt={2} pb={4} overflow="auto">
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
                            rules={{
                                required: '제목을 입력해주세요.',
                            }}
                            error={errors.notice ? true : false}
                            helperText={errors.notice ? errors.notice.message : ' '}
                        />
                    </Box>
                    <Box width="100%" mb={1}>
                        <Controller
                            name="content"
                            defaultValue=""
                            control={control}
                            rules={{ required: true }}
                            render={() => (
                                <FormControl error={errors.content ? true : false}>
                                    <FormLabel>내용</FormLabel>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        config={editorConfiguration}
                                        onReady={editor => {
                                            editor.ui.view.element.style.width = deviceMode
                                                ? '100%'
                                                : '504px';
                                            editor.editing.view.change(writer => {
                                                writer.setStyle(
                                                    'height',
                                                    deviceMode ? '220px' : '400px',
                                                    editor.editing.view.document.getRoot(),
                                                );
                                                writer.setStyle(
                                                    'overflow',
                                                    'auto',
                                                    editor.editing.view.document.getRoot(),
                                                );
                                            });
                                        }}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            setValue('content', data);
                                        }}
                                    />
                                    <FormHelperText>
                                        {errors.content ? '내용을 입력해주세요.' : ' '}
                                    </FormHelperText>
                                </FormControl>
                            )}
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
