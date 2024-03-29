var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('register_page_ent', {
    email: req.session.email,
    name: req.session.name,
    loginState: req.session.loginState,
    loginCount: req.session.loginCount,
    dupState: req.session.dupState,
    dupEmail: req.session.dupEmail,
    account_page_state: req.session.account_page_state = false,
    reg_page: req.session.reg_page = true,
    accountType: req.session.accountType
  }); 
});

module.exports = router;