import { google } from "googleapis";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_REDIRECT_URL,
  GOOGLE_CLIENT_SECRET,
} from "../../../config/index.js";
const { OAuth2 } = google.auth;

const oauth2Client = new OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_REDIRECT_URL,
);

export default oauth2Client;
