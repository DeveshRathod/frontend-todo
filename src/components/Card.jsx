import React, { useState, useEffect } from "react";
import {
  IconButton,
  TextField,
  Tooltip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";

const Card = ({ title, description, status, dueDate, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedStatus, setEditedStatus] = useState(status);
  const [editedDescription, setEditedDescription] = useState(description);
  const [originalStatus, setOriginalStatus] = useState(status);

  useEffect(() => {
    setEditedTitle(title);
    setEditedStatus(status);
    setEditedDescription(description);
    setOriginalStatus(status);
  }, [title, status, description]);

  const handleEditToggle = () => {
    if (isEditing) {
      onEdit({
        title: editedTitle,
        status: editedStatus,
        description: editedDescription,
      });
      setIsEditing(false);
    } else {
      if (originalStatus !== "completed" && originalStatus !== "expired") {
        setIsEditing(true);
      }
    }
  };

  const getTitleStyle = () => {
    if (editedStatus === "expired") {
      return "line-through text-red-600";
    }
    if (editedStatus === "completed") {
      return "line-through text-green-600";
    }
    return "text-gray-800";
  };

  const isEditingDisabled =
    editedStatus === "completed" || editedStatus === "expired";

  const formattedDueDate = dueDate
    ? format(new Date(dueDate), "MMM dd, yyyy HH:mm:ss")
    : "N/A";

  return (
    <div className="relative p-6 bg-white shadow-lg rounded-lg mb-6 flex items-center">
      <div className="flex-grow pl-6">
        {isEditing ? (
          <div className="flex flex-col space-y-4">
            <TextField
              label="Title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              variant="outlined"
              fullWidth
              disabled={isEditingDisabled}
            />
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={editedStatus}
                onChange={(e) => setEditedStatus(e.target.value)}
                disabled={isEditingDisabled}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              disabled={isEditingDisabled}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <h3 className={`text-2xl font-semibold ${getTitleStyle()}`}>
              {title}
            </h3>
            <p className="text-gray-500">
              <strong>Status:</strong> {status}
            </p>
            <p className="text-gray-500">
              <strong>Due Date:</strong> {formattedDueDate}
            </p>
            <p className="text-gray-600">{description}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-2 ml-4">
        <span>
          <Tooltip title={isEditing ? "Save" : "Edit"}>
            <span>
              <IconButton
                color="primary"
                onClick={handleEditToggle}
                className="bg-white rounded-full"
                disabled={isEditingDisabled && !isEditing}
              >
                {isEditing ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </span>
          </Tooltip>
        </span>
        <Tooltip title="Delete">
          <span>
            <IconButton
              color="error"
              onClick={onDelete}
              className="bg-white shadow-md rounded-full"
            >
              <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

export default Card;
