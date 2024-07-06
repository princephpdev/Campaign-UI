import React, { useState, useEffect } from "react";
import { Campaign, Schedule } from "../types";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { createCampaign, updateCampaign } from "../services/campaignService";
import { format } from "date-fns";

interface CampaignFormProps {
  campaign?: Campaign | null;
  onSuccess: () => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ campaign, onSuccess }) => {
  const [type, setType] = useState(campaign?.type || "");
  const [startDate, setStartDate] = useState<Date | null>(
    campaign ? new Date(campaign.startDate) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    campaign ? new Date(campaign.endDate) : null
  );
  const [schedules, setSchedules] = useState<Schedule[]>(
    campaign?.schedules || []
  );
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  useEffect(() => {
    if (campaign) {
      setType(campaign.type);
      setStartDate(new Date(campaign.startDate));
      setEndDate(new Date(campaign.endDate));
      setSchedules(campaign.schedules);
    }
  }, [campaign]);

  const handleAddSchedule = () => {
    setSchedules([...schedules, { dayOfWeek: "", startTime: "", endTime: "" }]);
  };

  const handleRemoveSchedule = (index: number) => {
    const newSchedules = schedules.filter((_, i) => i !== index);
    setSchedules(newSchedules);
  };

  const handleScheduleChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newSchedules = [...schedules];
    (newSchedules[index] as any)[field] = value;
    setSchedules(newSchedules);
  };

  const validateSchedules = () => {
    for (const schedule of schedules) {
      if (!schedule.dayOfWeek || !schedule.startTime || !schedule.endTime) {
        setError("All schedule fields must be filled out.");
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateSchedules()) {
      return;
    }

    const newCampaign: Campaign = {
      type,
      startDate: format(startDate!, "yyyy-MM-dd"),
      endDate: format(endDate!, "yyyy-MM-dd"),
      schedules,
    };

    try {
      if (campaign && campaign.id) {
        await updateCampaign(campaign.id, newCampaign);
      } else {
        await createCampaign(newCampaign);
      }

      onSuccess();
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message || "An error occurred");
        setOpenSnackbar(true);
      } else {
        setError("An unexpected error occurred");
        setOpenSnackbar(true);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        {campaign ? "Edit Campaign" : "Create Campaign"}
      </Typography>
      {/* {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )} */}
      <TextField
        select
        label="Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        fullWidth
        margin="normal"
      >
        <MenuItem value="Cost per Order">Cost per Order</MenuItem>
        <MenuItem value="Cost per Click">Cost per Click</MenuItem>
        <MenuItem value="Buy One Get One">Buy One Get One</MenuItem>
      </TextField>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopDatePicker
          label="Start Date"
          value={startDate}
          onChange={(date) => setStartDate(date)}
          // renderInput={(params) => (
          //   <TextField {...params} fullWidth margin="normal" />
          // )}
        />
        <DesktopDatePicker
          label="End Date"
          value={endDate}
          onChange={(date) => setEndDate(date)}
          // renderInput={(params) => (
          //   <TextField {...params} fullWidth margin="normal" />
          // )}
        />
      </LocalizationProvider>
      {schedules.map((schedule, index) => (
        <Box key={index} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                select
                label="Day of Week"
                value={schedule.dayOfWeek}
                onChange={(e) =>
                  handleScheduleChange(index, "dayOfWeek", e.target.value)
                }
                fullWidth
              >
                <MenuItem value="Monday">Monday</MenuItem>
                <MenuItem value="Tuesday">Tuesday</MenuItem>
                <MenuItem value="Wednesday">Wednesday</MenuItem>
                <MenuItem value="Thursday">Thursday</MenuItem>
                <MenuItem value="Friday">Friday</MenuItem>
                <MenuItem value="Saturday">Saturday</MenuItem>
                <MenuItem value="Sunday">Sunday</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Start Time"
                type="time"
                value={schedule.startTime}
                onChange={(e) =>
                  handleScheduleChange(index, "startTime", e.target.value)
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="End Time"
                type="time"
                value={schedule.endTime}
                onChange={(e) =>
                  handleScheduleChange(index, "endTime", e.target.value)
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleRemoveSchedule(index)}
              >
                Remove
              </Button>
            </Grid>
          </Grid>
        </Box>
      ))}
      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={handleAddSchedule}>
          Add Schedule
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          {campaign ? "Update Campaign" : "Create Campaign"}
        </Button>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CampaignForm;
