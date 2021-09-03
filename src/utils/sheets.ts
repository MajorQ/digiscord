import { google } from 'googleapis';

export { getStudentIds, sendAttendance };

const sheets = google.sheets('v4');

// TODO: make configurable
let spreadsheetId = '1Sy7BRZI1Dx5FTmdrqvyys-zLOUxGmQq0HcgLy6KEN6U';
let module = 1;
let startingRow = 3;
let startingColumn = 4;
let sheetName = 'Kehadiran';

// Compute column number from starting column and module
const getColumn = () => startingColumn + module - 1;

// Convert module number to letter in Google Sheets
const columnLetter = () => String.fromCharCode(64 + getColumn());

const getStudentIds = async () => {
	try {
		const req = await sheets.spreadsheets.values.get({
			spreadsheetId,
			range: `${sheetName}!A${startingRow}:A`,
			majorDimension: 'COLUMNS'
		});
		const res = req.data;

		return res.values?.at(0);
	} catch (error) {
		console.error(error);
	}
};

const sendAttendance = async (attendance: number[]) => {
	try {
		await sheets.spreadsheets.values.update({
			spreadsheetId,
			range: `${sheetName}!${columnLetter()}${startingRow}`,
			valueInputOption: 'USER-ENTERED',
			requestBody: {
				majorDimension: 'COLUMNS',
				values: [attendance]
			}
		});

		return true;
	} catch (error) {
		console.error(error);
	}
};
