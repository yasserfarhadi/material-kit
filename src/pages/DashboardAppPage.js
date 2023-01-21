import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';

// @mui
import {
  Card,
  Table,
  Stack,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead } from '../sections/@dashboard/user';
// mock
import { deleteItem, editItem, getItems } from '../api';
import Modal from '../components/modal';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'title', alignRight: false },
  { id: 'body', label: 'body', alignRight: false },
  { id: 'cta', label: 'actions', alignRight: false },
];

// ----------------------------------------------------------------------

export default function UserPage() {
  const [modalState, setModalState] = useState({ open: false, data: {} });
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [list, setList] = useState([]);

  async function handleDeleteItem(id) {
    try {
      const response = await deleteItem(id);
      if (response.status === 200) {
        const newList = JSON.parse(JSON.stringify(list)).filter((item) => item.id !== id);
        setList(newList);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    (async () => {
      const response = await getItems();
      const list = await response.json();
      setList(list);
    })();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = list.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleSubmitEdit = async ({ id, body, title }) => {
    const payload = {};
    if (body !== modalState.data.body) {
      payload.body = body;
    }
    if (title !== modalState.data.title) {
      payload.title = title;
    }
    if (Object.keys(payload).length > 0) {
      try {
        const response = await editItem(id, payload);
        if (response.status === 200) {
          const newList = JSON.parse(JSON.stringify(list)).map((item) => {
            if (item.id === id) {
              return { ...item, ...payload };
            }
            return item;
          });
          setList(newList);
          setModalState({ open: false, data: {} });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleModalClose = () => {
    setModalState({ open: false, data: {} });
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - list.length) : 0;

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={list.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, body, title } = row;
                    const selectedUser = selected.indexOf(title) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, title)} />
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          padding="none"
                          width={'200px'}
                          sx={{ overflow: 'hidden' }}
                        >
                          <p
                            style={{
                              width: '200px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {title}
                          </p>
                        </TableCell>

                        <TableCell sx={{ overflow: 'hidden' }} width={'450px'} align="left">
                          <p
                            style={{
                              width: '450px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {body}
                          </p>
                        </TableCell>
                        <TableCell align="right">
                          <Button onClick={() => setModalState({ open: true, data: row })}>
                            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                          </Button>
                          <Button onClick={() => handleDeleteItem(id)}>
                            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={list.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Modal
            open={modalState.open}
            modalCloseHandler={handleModalClose}
            data={modalState.data}
            submitChangeHander={handleSubmitEdit}
          />
        </Card>
      </Container>
    </>
  );
}
