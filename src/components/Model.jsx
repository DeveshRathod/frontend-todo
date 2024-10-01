import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    setTitle("");
    setDescription("");
    setTime("");
  }, [isOpen]);

  const handleSubmit = () => {
    if (!title || !description || !time) {
      alert("Please fill out all fields.");
      return;
    }

    const todoData = {
      title,
      description,
      time,
    };

    onSubmit(todoData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          color: (theme) => theme.palette.primary.contrastText,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" component="div">
          Add New Todo
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: 3,
        }}
      >
        <TextField
          margin="dense"
          label="Title"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Time"
          type="datetime-local"
          fullWidth
          variant="outlined"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
