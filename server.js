var express = require("express");
var fileuploader = require("express-fileupload");
var mysql = require("mysql2");
const bodyParser = require("body-parser");
var cors = require("cors");//cross platform
//node and postman are different software's


var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(3000, function () {
  console.log("Server Started...");
});
app.use(express.urlencoded(true));
//it allows html files to find all requested API in the server file
//============================================================
app.use(express.static("public"));
app.use(fileuploader());
app.get("/newproject", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/newproject.html");
});
app.get("/", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/index.html");
});

//==================| DB Operations |=========================
var config = {
  host: "127.0.0.1",
  user: "root",
  password: "kashish123",
  database: "project"
};


//==============| Creating Connection |=======================
var dbConn = mysql.createConnection(config);

dbConn.connect(function (jasoos) {
  if (jasoos == null) console.log("Connected to DataBase....");
  else console.log(jasoos);
});

//===================| API's for Ajax |==========================

//----------===| Index Page |===----------

//------------------| Signup Button |---------------------------
app.get("/signup", function (req, resp) {
  dbConn.query(
    "insert into users(email,pwd,type,dos,status) values(?,?,?,current_date(),1)",
    [req.query.kuchEmail, req.query.kuchPwd, req.query.kuchType],
    function (err) {
      if (err == null) resp.send("You are sucessfully Signed Up");
      else console.log(err);
    }
  );
});

//------------------| SignIn Button |---------------------------
app.get("/signin", function (req, resp) {
  // var email = req.query.kuchSinEmail;

  // var password = req.query.kuchSinPwd;
  dbConn.query(
    "select type,status from users where email = ? and pwd = ?",
    [req.query.kuchSinEmail, req.query.kuchSinPwd], //carefull
    function (err, resultTable) {
      if (err == null) {
        if (resultTable.length == 1) {
          if (resultTable[0].status == 1) resp.send(resultTable[0].type);
          else resp.send("U R Blocked");
        } else resp.send("Invalid User Id/Password");
      } else resp.send(err.toString());
    }
  );
});

//----------===| Index Page Ends |===----------

//----------------------------------------------------------------

//=============================| Angular |=========================================

//----------===| Admin Page |===----------

//--------------| Fetch-All-Users Button  |-----------------------
app.get("/get-angular-all-records", function (req, resp) {
  //fixed
  dbConn.query("select * from users", function (err, resultTable) {
    if (err == null) resp.send(resultTable);
    else resp.send(err);
  });
});

//--------------------| Block Button  |------------------------
app.get("/do-angular-block", function (req, resp) {
  //saving data in table
  var email = req.query.emailKuch;
  //fixed                             //same seq. as in table
  dbConn.query(
    "update users set status = (0) where email=?",
    [email],
    function (err) {
      if (err == null) {
        resp.send("Account Blocked Successfully");
      } else resp.send(err);
    }
  );
});

//--------------------| Resume Button  |------------------------
app.get("/do-angular-resume", function (req, resp) {
  //saving data in table
  var email = req.query.emailKuch; //emailKuch is local to this
  //fixed                             //same seq. as in table
  dbConn.query(
    "update users set status = (1) where email=?",
    [email],
    function (err) {
      if (err == null) {
        resp.send("Account Resumed Successfully");
      } else resp.send(err);
    }
  );
});
//-----------------------------------------

//------------------| Show-Donors Button  |-----------------------
app.get("/get-angular-donors-records", function (req, resp) {
  //fixed
  dbConn.query("select * from donors", function (err, resultTable) {
    if (err == null) resp.send(resultTable);
    else resp.send(err);
  });
});

//------------------| Show-Needy's Button  |-----------------------
app.get("/get-angular-needys-records", function (req, resp) {
  //fixed
  dbConn.query("select * from needy", function (err, resultTable) {
    if (err == null) resp.send(resultTable);
    else resp.send(err);
  });
});

//----------===| Admin Page Ends |===----------

//----------------------------------------------------------------

//----------===| Med-Manager Page |===----------

//--------------| Fetch Available Medicine |-------------
app.get("/get-med-avail-records", function (req, resp) {
  //fixed
  dbConn.query("select * from medsavailable", function (err, resultTable) {
    if (err == null) resp.send(resultTable);
    else resp.send(err);
  });
});

//-----------------| UnAvail Button  |-----------------
app.get("/do-angular-unAvail", function (req, resp) {
  //saving data in table
  var srno = req.query.srnoKuch;

  dbConn.query(
    "delete from medsavailable where srno = ?",
    [srno],
    function (err) {
      if (err == null) {
        resp.send("Clothes UnAvailed Successfully");
      } else resp.send(err);
    }
  );
});

//----------===| Med-Manager Page Ends |===----------

//----------------------------------------------------------------------------------------------

//====================== |Checking Emails |==========================

//----------| checking Email for SignUp |-----------
app.get("/chk-signup-email", function (req, resp) {
  //fixed
  dbConn.query(
    "select * from users where email=?",
    [req.query.kuchemail],
    function (err, resultTable) {
      if (err == null) {
        if (resultTable.length == 1) resp.send("Already Taken...");
        else resp.send("Available....!!!!");
      } else resp.send(err);
    }
  );
});

//----------| checking Email for Profile-Donor  |----------
app.get("/chk-donor-profile-email", function (req, resp) {
  // console.log(req.query.kuchEmail);
  dbConn.query(
    "select * from users where email = ?",
    [req.query.kuchEmail],
    function (err, resultTable) {
      if (err == null) {
        console.log("here");
        if (resultTable.length == 1) resp.send("");
        else resp.send("Invalid Email-Id");
      } else {
        console.log(err);
      }
    }
  );
});

//---------| checking Email for Avail-Med  |-----------
app.get("/chk-avail-med-email", function (req, resp) {
  // console.log(req.query.kuchEmail);
  dbConn.query(
    "select * from users where email = ?",
    [req.query.kuchEmail],
    function (err, resultTable) {
      if (err == null) {
        console.log("here");
        if (resultTable.length == 1) resp.send("");
        else resp.send("Invalid Email-Id");
      } else {
        console.log(err);
      }
    }
  );
});

//---------| checking Email for Settings  |------------
app.get("/chk-settings-email", function (req, resp) {
  // console.log(req.query.kuchEmail);
  dbConn.query(
    "select * from users where email = ?",
    [req.query.kuchEmail],
    function (err, resultTable) {
      if (err == null) {
        console.log("here");
        if (resultTable.length == 1) resp.send("");
        else resp.send("Invalid Email-Id");
      } else {
        console.log(err);
      }
    }
  );
});

//---------| checking Email for Med-Manager  |-----------
app.get("/chk-med-manager-email", function (req, resp) {
  // console.log(req.query.kuchEmail);
  dbConn.query(
    "select * from users where email = ?",
    [req.query.kuchEmail],
    function (err, resultTable) {
      if (err == null) {
        console.log("here");
        if (resultTable.length == 1) resp.send("");
        else resp.send("Invalid Email-Id");
      } else {
        console.log(err);
      }
    }
  );
});
//----------------------------------------------------------------------------------------------

//======================| Updating Passwords |==========================

//------------------| Update Password Button of Donor Page |-----------------------
app.get("/updatePwd", function (req, resp) {
  dbConn.query(
    "update users set pwd = ? where email = ? and pwd = ? ",
    [req.query.newPwd, req.query.email, req.query.oldPwd],
    function (err) {
      if (err == null) resp.send("Password Updated SuccessFully");
      else resp.send(err);
    }
  );
});

//----------------------------------------------------------------------------------------------

//----------===| Avail-Med Page |===----------

//--------------------| Avail-Med Button |-------------------------
app.get("/availMed", function (req, resp) {
  dbConn.query(
    "insert into medsavailable values(0,?,?,?,?,?)",
    [
      req.query.email,
      req.query.medName,
      req.query.expDate,
      req.query.package,
      req.query.quantity,
    ],
    function (err) {
      if (err == null) resp.send("Clothes Records Saved SuccessFully");
      else resp.send(err);
    }
  );
});

//----------===| Avail-Med Page Ends |===----------

//----------------------------------------------------------------------------------------------

//----------===| Finder-Med Page |===----------

//------------------| Fetching Cities |-------------------
app.get("/fetch-city-from-donors", function (req, resp) {
  //fixed
  dbConn.query("select distinct city from donors", function (err, resultTable) {
    if (err == null) resp.send(resultTable);
    else resp.send(err);
  });
});

//------------------| Fetching Medicine |------------------
app.get("/fetch-med-from-availMeds", function (req, resp) {
  //fixed
  dbConn.query(
    "select distinct med from medsavailable",
    function (err, resultTable) {
      if (err == null) resp.send(resultTable);
      else resp.send(err);
    }
  );
});

//------------------| Finding Donors Button |----------------
app.get("/fetch-donors", function (req, resp) {
  // console.log(req.query.medName);
  // console.log(req.query.cityName);
  var innerJoinAry =
    "select donors.name,donors.address,donors.city,donors.email from donors inner join medsavailable on donors.email= medsavailable.email where medsavailable.med=? and donors.city=?";
  dbConn.query(
    innerJoinAry,
    [req.query.medName, req.query.cityName],
    function (err, resultTable) {
      console.log(resultTable);
      if (err == null) resp.send(resultTable);
      else resp.send(err);
    }
  );
});

//----------===| Finder-Med Page Ends |===----------

//----------------------------------------------------------------------------------------------

//==================================================================================================

//============| DataBase Operations for Profile-Donor |==============
app.post("/db-submit-process", function (req, resp) {
  //-------------| File(Pic) Uploading |----------------------
  var fileName = "nopic.jpg";
  if (req.files != null) {
    // console.log(process.cwd());
    fileName = req.files.npPic.name;
    var path = process.cwd() + "/public/uploads/" + fileName;
    req.files.npPic.mv(path);
  }
  console.log(req.body);

  //--------------| saving data in table |---------------------
  var email = req.body.txtEmail;
  var name = req.body.txtName;
  var mobile = req.body.txtContact;
  var address = req.body.txtAddress;
  var city = req.body.listCity.toString();
  var proof = req.body.listProof.toString();

  //fixed for database connectivity .query
  dbConn.query(
    //      same sequence should be maintained as in the table
    "insert into donors(email,name,mobile,address,city,proof,pic) values(?,?,?,?,?,?,?)",
    [email, name, mobile, address, city, proof, fileName],
    function (err) {
      if (err == null) resp.send("Record Saved Successfully...");
      else resp.send(err);
    }
  );
});

//-----------------| Updating data in table |----------------------
app.post("/db-update-process", function (req, resp) {
  //-----------File(Pic) Uploading----------------
  var fileName = "nopic.jpg";
  if (req.files != null) {
    // console.log(process.cwd());
    fileName = req.files.npPic.name;
    var path = process.cwd() + "/public/uploads/" + fileName;
    req.files.npPic.mv(path);
  } else {
    fileName = req.body.hdn;
  }
  console.log(req.body);

  //----------------| saving data in table |------------------------
  var email = req.body.txtEmail;
  var name = req.body.txtName;
  var mobile = req.body.txtContact;
  var address = req.body.txtAddress;
  var city = req.body.listCity.toString();
  var proof = req.body.listProof.toString();

  dbConn.query(
    //      same sequence should be maintained as in the table
    "update donors set name = ?,mobile = ?,address = ?,city = ? ,proof = ? ,picname = ? where email = ?",
    [name, mobile, address, city, proof, fileName, email],
    function (err) {
      if (err == null) resp.send("Record Updated Successfully...");
      else resp.send(err);
    }
  );
});

//============| DataBase Operations for Profile-Needy |==============
app.post("/db-submit-process", function (req, resp) {
  //-------------| File(Pic) Uploading |----------------------
  var fileName = "nopic.jpg";
  if (req.files != null) {
    // console.log(process.cwd());
    fileName = req.files.npPic.name;
    var path = process.cwd() + "/public/uploads/" + fileName;
    req.files.npPic.mv(path);
  }
  console.log(req.body);

  //--------------| saving data in table |---------------------
  var email = req.body.txtEmail;
  var name = req.body.txtName;
  var mobile = req.body.txtContact;
  var gender = req.send.listGender.toString();
  var dob = req.query.dob;
  var address = req.body.txtAddress;
  var city = req.body.listCity.toString();
  var proof = req.body.listProof.toString();

  //fixed for database connectivity .query
  dbConn.query(
    //      same sequence should be maintained as in the table
    "insert into needy(email,name,mobile,gender,dob,address,city,proof,pic) values(?,?,?,?,?,?,?)",
    [email, name, mobile, gender, dob, address, city, proof, fileName],
    function (err) {
      if (err == null) resp.send("Record Saved Successfully...");
      else resp.send(err);
    }
  );
});

//-----------------| Updating data in table |----------------------
app.post("/db-update-process", function (req, resp) {
  //-----------File(Pic) Uploading----------------
  var fileName = "nopic.jpg";
  if (req.files != null) {
    // console.log(process.cwd());
    fileName = req.files.npPic.name;
    var path = process.cwd() + "/public/uploads/" + fileName;
    req.files.npPic.mv(path);
  } else {
    fileName = req.body.hdn;
  }
  console.log(req.body);

  //----------------| saving data in table |------------------------
  var email = req.body.txtEmail;
  var name = req.body.txtName;
  var mobile = req.body.txtContact;
  var gender = req.send.listGender.toString();
  var dob = req.query.dob;
  var address = req.body.txtAddress;
  var city = req.body.listCity.toString();
  var proof = req.body.listProof.toString();

  dbConn.query(
    //      same sequence should be maintained as in the table
    "update needy set name = ?,mobile = ?,gender = ?,dob = ?,address = ?,city = ? ,proof = ? ,picname = ? where email = ?",
    [name, mobile, gender, dob, address, city, proof, fileName, email],
    function (err) {
      if (err == null) resp.send("Record Updated Successfully...");
      else resp.send(err);
    }
  );
});
