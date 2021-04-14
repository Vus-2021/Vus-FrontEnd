import React, { useState, useEffect } from 'react';
import { Dialog, Button, Typography, Box } from '@material-ui/core';
import xlsx from 'xlsx';
import MiniHeader from '../layout/MiniHeader';
import ExcelStyle from '../styles/ExcelStyle';
import { SIGNUP_FOR_EXCEL } from '../gql/register/mutation';
import { useMutation } from '@apollo/react-hooks';
import * as dayjs from 'dayjs';

const Excel = props => {
    const { open, onClose, refetch } = props;
    const classes = ExcelStyle();
    const [file, setFile] = useState(null);

    const [signupForExcel, { data }] = useMutation(SIGNUP_FOR_EXCEL, {
        onCompleted() {
            refetch();
            handleClose();
        },
    });

    const handleClose = () => {
        setFile(null);
        onClose(false);
    };

    const excelToJSON = e => {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const fileData = reader.result;
                const wb = xlsx.read(fileData, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const raws = xlsx.utils.sheet_to_json(ws, { header: 1, raw: false });
                const excelArr = [];
                raws.forEach((raw, index) => {
                    if (raw.length === 6 && index !== 0) {
                        let isValid = true;
                        for (let i = 0; i < raw.length; i++) {
                            if (raw[i] == null) {
                                isValid = false;
                                break;
                            }
                        }
                        if (isValid) {
                            excelArr.push({
                                userId: raw[0],
                                password: raw[1],
                                name: raw[2],
                                phoneNumber: raw[3],
                                type: raw[4],
                                registerDate: dayjs(raw[5]).format('YYYY-MM-DD'),
                            });
                        } else console.log(index + '번째 행의 데이터가 유효하지 않음.');
                    }
                });
                signupForExcel({ variables: { input: excelArr } });
            };
            reader.readAsBinaryString(file);
        } else {
            alert('엑셀을 먼저 선택해주세요.');
        }
    };

    useEffect(() => {
        if (data) {
            const { success, message, data: excelData } = data.signupForExcel;
            if (success) {
                console.log('중복된 유저목록: ' + JSON.stringify(excelData));
            } else console.log(message);
        }
    }, [data]);

    return (
        <Dialog open={open} onClose={handleClose}>
            <MiniHeader handleClose={handleClose} headerText="엑셀 업로드" />
            <Box p={4} display="flex" justifyContent="space-between">
                <Box width="80%" mr={2}>
                    <input
                        type="file"
                        accept="application/vnd.ms-excel, 
                    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        id="contained-button-file"
                        style={{ display: 'none' }}
                        onChange={e => setFile(e.target.files[0])}
                    />
                    <label htmlFor="contained-button-file">
                        <Button
                            variant="outlined"
                            component="span"
                            className={classes.excelButton}
                            fullWidth
                        >
                            <Typography noWrap>{file ? file.name : '유저 엑셀 업로드'}</Typography>
                        </Button>
                    </label>
                </Box>
                <Box width="20%">
                    <Button onClick={excelToJSON} fullWidth className={classes.submitButton}>
                        확인
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default Excel;
