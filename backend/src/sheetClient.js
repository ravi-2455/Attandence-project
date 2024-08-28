import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config()

const client = new google.auth.JWT(process.env.CLIENT_EMAIL, null, process.env.PRIVATE_KEY, ["https://www.googleapis.com/auth/spreadsheets"]);

export const sheets = google.sheets({ version: "v4", auth: client })
