import { google } from 'googleapis';

const scopes = ['https://www.googleapis.com/auth/spreadsheets'];

const authorizeGoogleAPIs = async () => {
	const auth = new google.auth.GoogleAuth({
		keyFile: 'secrets/digiscord-test-c4b34bfd3dca.json',
		scopes
	});
	const authClient = await auth.getClient();

	// Set as default auth client on every request
	google.options({
		auth: authClient
	});
};

export { authorizeGoogleAPIs };
