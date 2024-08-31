import { z, ZodError } from "zod";
import { sheets } from "../sheetClient.js";

//@desc Mark Entry - Enter entry time
//@api /mark-entry
//@access public

const entrySchema = z.object({
  eid: z.string().min(1, { message: "Employee is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  entryTime: z.string().min(1, { message: "Entry time is required" }),
  exitTime: z.string().min(0, { message: "Exit time is required" }),
  scheduleEntryTime: z
    .string()
    .min(1, { message: "Schedule Entry time is required" }),
  scheduleExitTime: z
    .string()
    .min(1, { message: "Schedule Exit time is required" }),
});

export const markEntryController = async (req, res) => {
  try {
    const body = entrySchema.parse(req.body);
    const { eid, ...newBody } = body;
    const row = Object.values(newBody);
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: `${eid}!A2:G`,
      insertDataOption: "INSERT_ROWS",
      valueInputOption: "RAW",
      requestBody: {
        values: [row],
      },
    });
    res.status(200).json({ message: "Entry marked" });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};
