import { z, ZodError } from "zod";
import { sheets } from "../sheetClient.js";

//@desc update the status of tuition
//@route /add-tuition-status
//@access public

//tuition status schema
const tuitionStatusSchema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  status: z.string().min(1, { message: "status is required" }),
  reason: z.string().min(1, { message: "reason is required" }),
});

const markEmployeeStatusClose = async (date, ele) => {
  //mark this employee status close
  const eid = ele[0];
  ele[0] = date;
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: `${eid}!A3:C`,
    insertDataOption: "INSERT_ROWS",
    valueInputOption: "RAW",
    requestBody: {
      values: [ele],
    },
  });
};

const markAllEmployeeStatusClose = async (date) => {
  //eid,name,status as closed
  //get eid of all the employee
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: "Empolyee-Information!A2:B",
  });

  const sheetData = response.data.values;

  sheetData.map((ele) => {
    ele.push("close");
    markEmployeeStatusClose(date, ele);
  });
};

export const addTuitionStatus = async (req, res) => {
  try {
    const body = tuitionStatusSchema.parse(req.body);
    const { date, status, reason } = body;
    if (status === "close") {
      markAllEmployeeStatusClose(date);
    }

    const row = Object.values(body);
    //geting the data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "tuition-status!A2:C",
    });
    //data from get request
    const sheetData = response.data.values;
    //checking for empty condition in data recieved from the get call
    if (sheetData) {
      if (row[0] === sheetData[sheetData.length - 1][0]) {
        res.status(400).json({ message: "Status already recorded for day" });
      } else {
        await sheets.spreadsheets.values.append({
          spreadsheetId: process.env.SHEET_ID,
          range: "tuition-status!A2:C",
          insertDataOption: "INSERT_ROWS",
          valueInputOption: "RAW",
          requestBody: {
            values: [row],
          },
        });
        res.status(200).json({ message: "Status recorded" });
      }
    } else {
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SHEET_ID,
        range: "tuition-status!A2:C",
        insertDataOption: "INSERT_ROWS",
        valueInputOption: "RAW",
        requestBody: {
          values: [row],
        },
      });
      res.status(200).json({ message: "Status recorded" });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};
