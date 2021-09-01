import { google } from 'googleapis';

const scopes = ['https:/www.googleapis.com/auth/spreadsheets'];

export async function authorize() {
	const auth = new google.auth.GoogleAuth({
		keyFile: '../secrets/digiscord-test-c4b34bfd3dca.json',
		scopes: scopes
	});

	google.options({
		auth: auth
	});
}
