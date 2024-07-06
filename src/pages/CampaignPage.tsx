import React, { useState } from "react";
import CampaignList from "../components/CampaignList";
import CampaignForm from "../components/CampaignForm";
import { Campaign } from "../types";
import { Box, Container, Grid, Paper } from "@mui/material";

const CampaignPage: React.FC = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );

  const handleEdit = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
  };

  const handleSuccess = () => {
    setSelectedCampaign(null);
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <CampaignList onEdit={handleEdit} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <CampaignForm
                campaign={selectedCampaign}
                onSuccess={handleSuccess}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CampaignPage;
