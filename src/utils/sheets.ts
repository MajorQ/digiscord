import { google } from 'googleapis';

export { fetchStudentIds, checkEmptyAttendance, sendAttendance };

const sheets = google.sheets('v4');

// TODO: make configurable
let spreadsheetId = '1Sy7BRZI1Dx5FTmdrqvyys-zLOUxGmQq0HcgLy6KEN6U';
let currentModule = 1;
let startingRow = 3;
let startingColumn = 4;
let sheetName = 'Kehadiran';

/**
 * Fetch student ids from the Google Sheet
 * @returns the student ids as an array or null if failed
 */
const fetchStudentIds = () => fetchColumn(1);

/**
 * Check if the attendance column is empty
 * @returns true if empty
 */
const checkEmptyAttendance = async () => {
	const column = getColumn(currentModule);
	const res = await fetchColumn(column);
	if (res) {
		return res.length === 0;
	}

	return res;
};

const sendAttendance = async (attendance: number[]) => {
	const column = columnLetter(getColumn(currentModule));
	try {
		await sheets.spreadsheets.values.update({
			spreadsheetId,
			range: `${sheetName}!${column}${startingRow}`,
			valueInputOption: 'USER-ENTERED',
			requestBody: {
				majorDimension: 'COLUMNS',
				values: [attendance]
			}
		});

		return true;
	} catch (error) {
		console.error(error);
		return null;
	}
};

/**
 * Computes the column number from starting column & module
 * @returns column number
 */
const getColumn = (module: number) => startingColumn + module - 1;

/**
 * Convert column number to letter in Google Sheets
 * @returns Google Sheets column letter
 */
const columnLetter = (columnNumber: number) =>
	String.fromCharCode(64 + columnNumber);

/**
 * Fetch one column from a Google Sheet
 * @param columnNumber the column number inside the Google Sheet
 * @returns the column as an array or null if failed
 */
const fetchColumn = async (columnNumber: number) => {
	const column = columnLetter(columnNumber);
	try {
		const req = await sheets.spreadsheets.values.get({
			spreadsheetId,
			range: `${sheetName}!${column}${startingRow}:${column}`,
			majorDimension: 'COLUMNS'
		});
		const res = req.data;

		return res.values?.at(0) ?? [];
	} catch (error) {
		console.error(error);
		return null;
	}
};
