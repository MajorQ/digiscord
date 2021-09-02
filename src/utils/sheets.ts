import { google } from 'googleapis';

const sheets = google.sheets('v4');
const rowOffset = 2;

export const getNPM = async () => {
	try {
		const req = await sheets.spreadsheets.values.get({
			spreadsheetId: '1Sy7BRZI1Dx5FTmdrqvyys-zLOUxGmQq0HcgLy6KEN6U',
			range: `Kehadiran!A:A`,
			majorDimension: 'COLUMNS'
		});
		const res = req.data;

		return res.values?.at(0)?.slice(rowOffset);
	} catch (error) {
		console.error(error);
	}
};

// const req = await sheets.spreadsheets.values.update({
// 	spreadsheetId: '1Sy7BRZI1Dx5FTmdrqvyys-zLOUxGmQq0HcgLy6KEN6U',
// 	range: `Kehadiran!D3`,
// 	valueInputOption: 'USER-ENTERED',
// 	requestBody: {
// 		values: [[1]]
// 	}
// });
