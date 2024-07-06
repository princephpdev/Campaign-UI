import React, { useEffect, useState } from "react";
import { getCampaigns, deleteCampaign } from "../services/campaignService";
import { Campaign } from "../types";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface CampaignListProps {
  onEdit: (campaign: Campaign) => void;
}

const CampaignList: React.FC<CampaignListProps> = ({ onEdit }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    const data = await getCampaigns();
    setCampaigns(data.campaigns);
  };

  const handleDelete = async (id: number) => {
    await deleteCampaign(id);
    fetchCampaigns();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Campaigns
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Schedules</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell>{campaign.type}</TableCell>
                <TableCell>
                  {new Date(campaign.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(campaign.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {campaign.schedules.map((schedule, index) => (
                    <div key={index}>
                      {schedule.dayOfWeek}: {schedule.startTime} -{" "}
                      {schedule.endTime}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => onEdit(campaign)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(campaign.id!)}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CampaignList;
