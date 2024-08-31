import { z, ZodError } from "zod";
import { sheets } from "../sheetClient.js";
//@desc get tuition status
//@api /get-tuition-status
//@access public

const getTuitionStatusSchema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
});

export const getTuitionStatus = async (req, res) => {
  try {
    const body = getTuitionStatusSchema.parse(req.body);
    //get status.
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "tuition-status!A1:C",
    });
    const sheetData = response.data.values;

    if (sheetData) {
      //write logic
      const transformedData = sheetData.map(([date, status, reason]) => ({
        date,
        status,
        reason,
      }));

      const status = transformedData.filter(
        (status) => status.date === body.date
      );
      res.status(200).json({ statusData: status });
    } else {
      res.status(404).json({ message: "No status found" });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};
