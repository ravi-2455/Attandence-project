import express from "express";
import { z, ZodError } from "zod";
import { sheets } from "./sheetClient.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT;


//body schema
const entrySchema = z.object({
    eid: z.string().min(1, { message: "Employee is required" }),
    date: z.string().min(1, { message: "Date is required" }),
    name: z.string().min(1, { message: "Name is required" }),
    entryTime: z.string().min(1, { message: "Entry time is required" })
})

const exitSchema = z.object({
    eid: z.string().min(1, { message: "Employee is required" }),
    exitTime: z.string().min(1, { message: "Exit time is required" })
})

//middleware
app.use(express.json());

//main route
app.get("/get-employee-details", async (req, res) => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SHEET_ID,
            range: "Empolyee-Information!A2:G"
        })
        res.status(200).json({ data: response.data.values })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

app.post("/mark-entry", async (req, res) => {
    try {
        const body = entrySchema.parse(req.body);
        const { eid, ...newBody } = body;
        const row = Object.values(newBody);
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SHEET_ID,
            range: `${eid}!A3:C`,
            insertDataOption: "INSERT_ROWS",
            valueInputOption: "RAW",
            requestBody: {
                values: [row]
            }
        })
        res.status(200).json({ message: "Entry marked" })
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
})

app.post("/mark-exit", async (req, res) => {
    try {
        const body = exitSchema.parse(req.body);
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SHEET_ID,
            range: `${body.eid}!A3:C`
        })
        await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.SHEET_ID,
            range: `${body.eid}!D${2 + response.data.values.length}`,
            valueInputOption: "RAW",
            requestBody: {
                values: [[body.exitTime]]
            }
        })
        res.status(200).json({ message: "Exit marked" })
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
})

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})