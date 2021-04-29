const http = require('http');
const express = require('express');
const errorHandler = require('errorhandler');
const { GoogleSpreadsheet } = require("google-spreadsheet");

const app = express();

app.set('port', process.env.PORT || 3000);
app.set('statics', process.cwd() + '/public');
app.set('view engine', 'html');
app.use(express.static(app.get('statics')));
app.use(errorHandler());

const server = http.createServer(app);

if (!process.env.SHEET_KEY) {
    console.error('Environment varialbe SHEET_KEY is missing.');
    process.exit(1);
}

if (!process.env.GOOGLE_API_KEY) {
    console.error('Environment varialbe GOOGLE_API_KEY is missing.');
    process.exit(1);
}

const sheetKey = process.env.SHEET_KEY;
const apiKey = process.env.GOOGLE_API_KEY;

const loadWords = async handler => {
    const workbook = new GoogleSpreadsheet(sheetKey);
    workbook.useApiKey(apiKey);
    await workbook.loadInfo(); // loads document properties and worksheets
    const sheets = {};

    async function getSheet(sheetNo) {
        const sheet = workbook.sheetsByIndex[sheetNo];
        const rows = await sheet.getRows();
        sheets[sheet.title] = rows.map(row => row.title);
        if (sheetNo === workbook.sheetCount - 1) {
            return sheets;
        } else {
            return await getSheet(sheetNo + 1);
        }
    }

    return await getSheet(0);
};

app.get('/wordlists', async (req, res) => {
    try {
        res.json(await loadWords());
    } catch (err) {
        res.send(500, err);
    }
});

server.listen(app.get('port'), () => console.log("Express server listening on port " + app.get('port')));

