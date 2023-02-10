const express = require("express");
const bodyParser = require("body-parser");
const xlsx = require("xlsx");
const cors = require("cors");
const app = express();
const Excel = require("exceljs");
var spread_sheet = require("spread_sheet");

app.options("*", cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());
app.set("view engine", "ejs");
app.use("/", express.static(__dirname + "/"));
app.get("/", async (req, res) => {
  res.render("mcqForm");
});
app.post("/", (req, res) => {
  //check if user already has written
  const checkFile = xlsx.readFile("./result.xlsx");
  let checkSheet = checkFile.Sheets["Sheet1"];
  let checkData = xlsx.utils.sheet_to_json(checkSheet);
  for(var i=0;i<checkData.length;i++){
    if(checkData[i].RollNumber && checkData[i].RollNumber.toUpperCase() === req.body.RollNumber.toUpperCase())
    {
      return res.send("You have already attempted this Contest");
    }
  }
  const file = xlsx.readFile("./key.xlsx");
  let sheet = file.Sheets["Sheet1"];
  let data = xlsx.utils.sheet_to_json(sheet);
  let score = 0;
  for (var i = 0; i < data.length; i++) {
    var option = data[i].option;
    if (
      req.body[data[i].questionNo] &&
      option.toUpperCase() === req.body[data[i].questionNo].toUpperCase()
    ) {
      score += 1;
    }
  }
  //write
  const workbook = new Excel.Workbook();
  workbook.xlsx.readFile("./result.xlsx").then(() => {
    // Get the first sheet in the workbook
    const sheet = workbook.getWorksheet(1);

    // Get the highest row in the sheet
    const row = sheet.rowCount + 1;

    // Add data to the new row
    sheet.getCell(row, 1).value = req.body.RollNumber;
    sheet.getCell(row, 2).value = score;

    // Save the workbook to the same file
    workbook.xlsx.writeFile("./result.xlsx");
  });

  // Printing data
  res.send("Your Score is : " + score);
  // res.redirect("/");
});

app.listen(4000, () => {
  console.log("Listening on port 4000");
});
