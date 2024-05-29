import axios from 'axios';
const BASE_URL_LTA = 'http://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2';
export const apiLTA = axios.create({ baseURL: BASE_URL_LTA });

const BASE_URL_HDB = 'https://api.data.gov.sg/v1/transport/carpark-availability';
export const apiHDB = axios.create({ baseURL: BASE_URL_HDB });
