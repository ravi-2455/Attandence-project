import { z, ZodError } from "zod";
import { sheets } from "../sheetClient.js";
//@desc to get employee Today's Status
//@api /get-employee-today-status
//@access public

const getEmpolyeeTodayStatusSchema = z.object({
  eid: z.string().min(1, { message: "Employee Id is required" }),
  date: z.string().min(1, { message: "Date is required" }),
});

export const getEmpolyeeTodayStatusController = async (req, res) => {
  try {
    const body = getEmpolyeeTodayStatusSchema.parse(req.body);
    const { eid, date } = body;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: `${eid}!A1:E`,
    });
    const sheetData = response.data.values;

    const transformedData = sheetData.map(
      ([date, name, status, entryTime, exitTime]) => ({
        date,
        name,
        status,
        entryTime,
        exitTime,
      })
    );
    const responseData = transformedData.filter((data) => data.date === date);
    res.status(200).json({ data: responseData });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};
