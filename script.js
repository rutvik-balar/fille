const connectDB = require('./config/db');
const File = require('./models/file');
const fs = require('fs');

connectDB();
// we delete file into database 

//first connect db than make async function to fetch file with help of (createdat this is a attribute in db which 
// store date whene file uplode into db using this we fatch all file 24 hour ago than run for loop apon all file and using fs module we delete file using fs.unlinksynk() than we also delete file into the database also   

async function fetchData() {
  const files = await File.find({
    createdAt: {
      $lt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  })
  if (files.length) {
    for (const file of files) {
      try {
        fs.unlinkSync(file.path);
        await file.remove();
        console.log(`successfully deleted ${file.filename}`);
      } catch (err) {
        console.log(`error while deleting file ${err} `);
      }
    }
  }
  console.log('Job done!');
}

fetchData().then(process.exit);