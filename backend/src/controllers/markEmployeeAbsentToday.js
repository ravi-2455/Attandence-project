import { z, ZodError } from "zod";
import { sheets } from "../sheetClient.js";
//@desc to get employee Today's Status
//@api /mark-employee-absent-today
//@access public

const markEmployeeAbsentTodaySchema = z.object({
  eid: z.string().min(1, { message: "Employee Id is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  name: z.string().min(1, { message: "Name is required" }),
});

export const markEmployeeAbsentToday = async (req, res) => {
  try {
    const body = markEmployeeAbsentTodaySchema.parse(req.body);
    const { eid, date, name } = body;
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: `${eid}!A2:C`,
      insertDataOption: "INSERT_ROWS",
      valueInputOption: "RAW",
      requestBody: {
        values: [[date, name, "A"]],
      },
    });
    res.status(200).json({ message: "Marked Absent" });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};
