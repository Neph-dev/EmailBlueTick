const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

let emailTrackingData = []
const trackingDataFilePath = 'trackingData.json'

if (fs.existsSync(trackingDataFilePath)) {
    const existingData = fs.readFileSync(trackingDataFilePath, 'utf8');
    emailTrackingData = JSON.parse(existingData);
}

app.get('/image.png', (req, res) => {
    const clientIP = req.ip;
    const emailId = req.query.emailId;

    emailTrackingData.push({
        emailId,
        timestamp: new Date(),
        clientIP,
    });

    const trackingDataJSON = JSON.stringify(emailTrackingData, null, 2)
    fs.writeFile(trackingDataFilePath, trackingDataJSON, (err) => {
        if (err) {
            console.error('Error writing tracking data:', err);
        }
    })
    res.sendFile(__dirname + '/image.png')
})

app.get('/viewTrackingData', (req, res) => {
    res.json(emailTrackingData);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});