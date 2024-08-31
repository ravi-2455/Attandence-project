import { sheets } from "../sheetClient.js";

//@desc get employee details
//@api /get-employee-details
//@access public

export const getEmployeeDetailsController = async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "Empolyee-Information!A2:H",
    });
    res.status(200).json({ data: response.data.values });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
