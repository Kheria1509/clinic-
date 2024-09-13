import React from "react";
import { useState } from "react";
import axios from "axios";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

export default function DeleteDoctor(props) {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        await axios.delete(`/doctors/${props.id}`).then(() => {
            window.location.reload(false);
        });
        handleClose(); // Close dialog after deletion
    };

    return (
        <>
            <Tooltip title="Delete Doctor" arrow>
                <IconButton
                    aria-label="delete"
                    onClick={handleClickOpen}
                    color="error" // Optional: Red color for delete action
                >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this doctor? This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
