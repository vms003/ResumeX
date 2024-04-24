const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');

const app = express();

// Set EJS as view engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/generate', (req, res) => {
    const { name, email, phone, address, summary, experienceTitle, experienceDescription, educationTitle, educationDescription } = req.body;

    // Create resume data object
    const resumeData = {
        name,
        email,
        phone,
        address,
        summary,
        experienceTitle,
        experienceDescription,
        educationTitle,
        educationDescription
    };

    // Render resume.ejs with the resumeData
    res.render('resume', { resume: resumeData });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
