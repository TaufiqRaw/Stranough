import ax from 'axios';
import { Constants } from "~/constants";

export const axios = ax.create({
  baseURL : Constants.serverUrl,
  headers : {
    'ngrok-skip-browser-warning': 'true' 
  }
})