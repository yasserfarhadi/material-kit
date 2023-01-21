import { useState, memo, useLayoutEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

import TextField from '@mui/material/TextField';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

function BasicModal({ open, modalCloseHandler, data, submitChangeHander }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useLayoutEffect(() => {
    setTitle(data.title);
    setBody(data.body);
  }, [data]);

  return (
    <div>
      <Modal
        open={open}
        onClose={modalCloseHandler}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField id="outlined-basic" label="id" variant="outlined" value={data.id} disabled />
          <TextField
            label="title"
            id="outlined-basic"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            id="outlined-multiline-static"
            label="body"
            multiline
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="modal-cta">
            <Button onClick={() => submitChangeHander({ id: data.id, title, body })} variant="outlined">
              Submit
            </Button>
            <Button sx={{ mx: 1 }} onClick={modalCloseHandler} variant="outlined">
              Close
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default memo(BasicModal);
