import React, { useState, useEffect } from 'react';
import {
    Box,
    Dialog,
    Typography,
    Paper,
    Button,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    FormControlLabel,
} from '@material-ui/core';
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@material-ui/core';
import { ImportExport } from '@material-ui/icons';
import MiniHeader from '../layout/MiniHeader';
import BoarderSelectionStyle from '../styles/BoarderSelectionStyle';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useMutation } from '@apollo/react-hooks';
import { TRIGGER_PASSENGERS } from '../gql/boarder/mutation';

const radioList = [
    {
        value: 'registerDate',
        name: '입사일',
    },
    {
        value: 'applyDate',
        name: '신청일',
    },
    {
        value: 'random',
        name: '랜덤',
    },
];

const BoarderSelection = props => {
    const { open, onClose, setPage, standard, refetch } = props;
    const classes = BoarderSelectionStyle();

    const defaultColumn = {
        selected: {
            id: 'selected',
            list: [],
        },
        waiting: {
            id: 'waiting',
            list: [
                { id: '1', content: '입사일 기준', function: 'selectByRegisterDate' },
                { id: '2', content: '전월 미당첨자', function: 'selectByPreNotPassengers' },
            ],
        },
    };

    // eslint-disable-next-line no-unused-vars
    const [columns, setColumns] = useState(defaultColumn);

    const [sortType, setSortType] = useState(radioList[0].value);
    const [monthArg, setMonthArg] = useState(3);

    const [triggerPassengers, { data: passengersData }] = useMutation(TRIGGER_PASSENGERS, {
        onCompleted() {
            refetch();
        },
    });

    const handleClose = () => {
        setPage(0);
        onClose(false);
    };

    const selectionClick = () => {
        const methodList = [];
        const selectedList = columns.selected.list;
        methodList.push('sortPeople');
        selectedList.forEach(data => {
            methodList.push(data.function);
        });
        methodList.push('selectByQueue');

        triggerPassengers({
            variables: {
                month: standard.month,
                route: standard.route,
                busId: standard.partitionKey,
                methodList: methodList,
                sortType: sortType,
                monthArg: parseInt(monthArg),
            },
        });
    };

    const onDragEnd = ({ source, destination }) => {
        if (destination === undefined || destination === null) return null;
        if (source.droppableId === destination.droppableId && destination.index === source.index)
            return null;

        const start = columns[source.droppableId];
        const end = columns[destination.droppableId];

        if (start === end) {
            const newList = start.list.filter((_, idx) => idx !== source.index);
            newList.splice(destination.index, 0, start.list[source.index]);

            const newCol = {
                id: start.id,
                list: newList,
            };

            setColumns({ ...columns, [newCol.id]: newCol });
        } else {
            const newStartList = start.list.filter((_, idx) => idx !== source.index);
            const newStartCol = {
                id: start.id,
                list: newStartList,
            };

            const newEndList = end.list;
            newEndList.splice(destination.index, 0, start.list[source.index]);
            const newEndCol = {
                id: end.id,
                list: newEndList,
            };

            setColumns({ ...columns, [newStartCol.id]: newStartCol, [newEndCol.id]: newEndCol });
        }
    };

    useEffect(() => {
        if (passengersData) {
            const { success, message } = passengersData.triggerPassengers;
            if (success) {
                setPage(0);
                onClose(false);
            } else console.log(message);
        }
    }, [passengersData, onClose, setPage]);

    return (
        <Dialog open={open} onClose={handleClose}>
            <MiniHeader
                headerText={`${standard.month}월 ${standard.route}노선 선별`}
                handleClose={handleClose}
                width="500px"
            />
            <Box minHeight="500px" px={3}>
                <Box mt={3} mb={1} display="flex" justifyContent="center">
                    <SelectionRadio setSortType={setSortType} sortType={sortType} />
                </Box>
                <Box mb={1}>
                    <Typography className={classes.selectedTitle}>선택목록</Typography>
                </Box>
                <DragDropContext onDragEnd={onDragEnd}>
                    <SelectedTable
                        selected={columns.selected}
                        monthArg={monthArg}
                        setMonthArg={setMonthArg}
                        sortType={sortType}
                    />
                    <Box
                        width="100%"
                        height="35px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        my={1}
                    >
                        <ImportExport fontSize="large" />
                    </Box>
                    <WaitingTable waiting={columns.waiting} />
                </DragDropContext>
                <Box mx={1} my={4} display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        onClick={selectionClick}
                        className={classes.selectionButton}
                    >
                        선별하기
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

const SelectionRadio = props => {
    const { setSortType, sortType } = props;

    return (
        <FormControl component="fieldset">
            <FormLabel component="legend" color="secondary">
                선별 기준
            </FormLabel>

            <RadioGroup row value={sortType} onChange={e => setSortType(e.target.value)}>
                {radioList.map((radio, index) => (
                    <FormControlLabel
                        control={<Radio color="secondary" />}
                        label={radio.name}
                        value={radio.value}
                        key={radio.value}
                        disabled={index === 1}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
};

const SelectedTable = props => {
    const classes = BoarderSelectionStyle();
    const { selected, monthArg, setMonthArg, sortType } = props;

    const monthChange = e => {
        const num = e.target.value;
        if (num.length <= 2 && !isNaN(num)) {
            setMonthArg(num);
        }
    };

    return (
        <Box mx={1} display="flex">
            <Box width="20%" mr={0.2}>
                <TableContainer
                    component={Paper}
                    elevation={5}
                    square
                    className={classes.selectedTable}
                >
                    <Table>
                        <TableHead className={classes.tableHead}>
                            <TableRow>
                                <TableCell className={classes.tableHeadCell} align="center">
                                    우선순위
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selected.list.map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center" className={classes.tableBodyCell}>
                                        {index + 1}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box width="80%">
                <Droppable droppableId="selected">
                    {provided => (
                        <TableContainer
                            component={Paper}
                            elevation={5}
                            square
                            className={classes.selectedTable}
                            ref={provided.innerRef}
                            style={{ maxWidth: '365px' }}
                        >
                            <Table component="div" style={{ overflow: 'hidden' }}>
                                <TableHead className={classes.tableHead} component="div">
                                    <TableRow component="div">
                                        <TableCell
                                            className={classes.tableHeadCell}
                                            align="center"
                                            component="div"
                                        >
                                            선별 내용
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody component="div">
                                    {selected.list.length > 0 ? (
                                        selected.list.map((data, index) => (
                                            <TableRow key={data.id} component="div">
                                                <Draggable draggableId={data.id} index={index}>
                                                    {provided => (
                                                        <TableCell
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            align="center"
                                                            component="div"
                                                            className={classes.tableBodyCell}
                                                        >
                                                            {data.content}
                                                            {data.content === '입사일 기준' && (
                                                                <React.Fragment>
                                                                    &nbsp;(&nbsp;
                                                                    <TextField
                                                                        value={monthArg}
                                                                        variant="outlined"
                                                                        onChange={monthChange}
                                                                        inputProps={{
                                                                            style: {
                                                                                padding:
                                                                                    '2px 5px 2px 5px',
                                                                                textAlign: 'right',
                                                                            },
                                                                        }}
                                                                        className={
                                                                            classes.monthText
                                                                        }
                                                                    />
                                                                    개월 이내)
                                                                </React.Fragment>
                                                            )}
                                                        </TableCell>
                                                    )}
                                                </Draggable>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow component="div">
                                            <TableCell
                                                component="div"
                                                align="center"
                                                style={{ borderBottom: 'none' }}
                                            >
                                                비어 있음 (기준 : {sortType})
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {provided.placeholder}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Droppable>
            </Box>
        </Box>
    );
};

const WaitingTable = props => {
    const classes = BoarderSelectionStyle();
    const { waiting } = props;

    return (
        <React.Fragment>
            <Box mb={1}>
                <Typography className={classes.selectedTitle}>대기목록</Typography>
            </Box>
            <Box mx={1}>
                <Droppable droppableId="waiting">
                    {provided => (
                        <TableContainer
                            component={Paper}
                            elevation={5}
                            square
                            className={classes.selectedTable}
                            style={{ width: '436px' }}
                            ref={provided.innerRef}
                        >
                            <Table component="div">
                                <TableHead className={classes.tableHead} component="div">
                                    <TableRow component="div">
                                        <TableCell
                                            className={classes.tableHeadCell}
                                            align="center"
                                            component="div"
                                        >
                                            선별 내용
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody component="div">
                                    {waiting.list.length > 0 ? (
                                        waiting.list.map((data, index) => (
                                            <TableRow component="div" key={data.id}>
                                                <Draggable draggableId={data.id} index={index}>
                                                    {provided => (
                                                        <TableCell
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            align="center"
                                                            component="div"
                                                            className={classes.tableBodyCell}
                                                        >
                                                            <Typography>{data.content}</Typography>
                                                        </TableCell>
                                                    )}
                                                </Draggable>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow component="div">
                                            <TableCell
                                                component="div"
                                                align="center"
                                                style={{ borderBottom: 'none' }}
                                            >
                                                비어 있음
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {provided.placeholder}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Droppable>
            </Box>
        </React.Fragment>
    );
};

export default BoarderSelection;
