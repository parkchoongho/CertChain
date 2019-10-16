const express = require("express");
const mysql = require("mysql");
const router = express.Router();

function XSS_Check(value) {
  value = value.replace(/\<|\>|\"|\'|\%|\;|\(|\)|\&|\+|\-/g, "");
  value = value.replace(/\</g, "&lt;");
  value = value.replace(/\>/g, "&gt;");
  return value;
}

router.post("/", function(req, res) {
  console.log(req.body);
  if (
    req.body.degree_type == "" ||
    req.body.degree_name == "" ||
    req.body.degree_birth == "" ||
    req.body.degree_dept == "" ||
    req.body.degree_date == "" ||
    req.body.degree_degree == "" ||
    req.body.degree_code == "" ||
    req.body.degree_key == ""
  ) {
    const msg = {
      msg:
        "Null Point 역참조 발생 (계속 반복 된다면 해킹 우려가 있으니 고객센터에 문의주세요.)"
    };
    res.json(JSON.stringify(msg));
  } else {
    let conn = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "mysql",
      database: "nodejs"
    });
    conn.connect(err => {
      if (err) {
        return console.error(err.message);
      }

      const email = XSS_Check(req.session.email);
      const degree_key = req.body.degree_key;
      const degree_type = XSS_Check(req.body.degree_type);
      const degree_name = XSS_Check(req.body.degree_name);
      const degree_birth = XSS_Check(req.body.degree_birth);
      const degree_dept = XSS_Check(req.body.degree_dept);
      const degree_date = XSS_Check(req.body.degree_date);
      const degree_degree = XSS_Check(req.body.degree_degree);
      const degree_code = XSS_Check(req.body.degree_code);

      console.log(degree_key);

      const sql = `insert into certchain_degree(from_no, to_no, type, name, birth, dept, date, degree, code) 
       values((select no from certchain_account where email=?), (select account_no from certchain_key_encoded where encoded_key=?), ?, ?, ?, ?, ?, ?, ?)`;
      conn.query(sql, [email, degree_key, degree_type, degree_name, degree_birth, degree_dept, degree_date, degree_degree, degree_code], (err, result, fields) => {
          if (err) {
            console.error(err.message);
          } else {
            const msg = { msg: "졸업 증명서 발급을 완료했습니다." };
            res.json(JSON.stringify(msg));
          }
          conn.end();
        }
      );
    });
  }
});
module.exports = router;