import { z } from "zod";
import { sheets } from "../sheetClient.js";

//@desc mark the exit time
//@api /mark-exit
//@acess public

//body schema
const exitSchema = z.object({
  eid: z.string().min(1, { message: "Employee is required" }),
  exitTime: z.string().min(1, { message: "Exit time is required" }),
});

export const markExitController = async (req, res) => {
  try {
    let body = exitSchema.parse(req.body);
    if (body.exitTime > "20:00") {
      body = { ...body, exitTime: "20:00" };
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: `${body.eid}!A2:F`,
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SHEET_ID,
      range: `${body.eid}!E${1 + response.data.values.length}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[body.exitTime]],
      },
    });
    res.status(200).json({ message: "Exit marked" });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};
