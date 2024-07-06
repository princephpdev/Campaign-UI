import api from "./api";
import { Campaign } from "../types";

export const getCampaigns = async () => {
  const response = await api.get("/campaigns");
  return response.data;
};

export const createCampaign = async (campaign: Campaign) => {
  const response = await api.post("/campaigns", campaign);
  return response.data;
};

export const updateCampaign = async (id: number, campaign: Campaign) => {
  const response = await api.put(`/campaigns/${id}`, campaign);
  return response.data;
};

export const deleteCampaign = async (id: number) => {
  const response = await api.delete(`/campaigns/${id}`);
  return response.data;
};
