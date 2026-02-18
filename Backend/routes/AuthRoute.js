const express = require('express')

const {register,login}=require('../auth/auth');
const {CreateGroup} = require('../api/GroupsAPI');
const {FetchGroups} = require('../api/GroupsAPI');
const verifyToken = require('../middleware/AuthMiddleware');
const {RemoveMember} = require('../api/GroupsAPI');
const {AddNewMember} = require('../api/GroupsAPI');
const {UpdateMemberName} = require('../api/GroupsAPI');
const {AddExpense} = require("../api/Expense");
const {DeleteExpense} = require("../api/Expense");
const { GetGroupBalance } = require('../api/GroupBalance');
const { GetGroupExpenses } = require('../api/ExpenseHistory');
const { MakePayment } = require("../api/MakePayment");
const {SettleUp} = require("../api/SettleUp")
const { JoinGroup } = require("../api/GroupsAPI");
const { forgotPassword,resetPassword } = require("../api/ForgotPassword");
const router =express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/creategroup",verifyToken,CreateGroup);
router.get("/groups",verifyToken,FetchGroups);
router.delete("/remove-member/:groupId", verifyToken, RemoveMember);
router.put("/addmember/:groupId",verifyToken,AddNewMember)
router.put("/update-member/:groupId", verifyToken, UpdateMemberName);
router.post("/addexpense", verifyToken, AddExpense);
router.delete("/delete-transaction/:expenseId", verifyToken, DeleteExpense);
router.get("/expenses/:groupId", verifyToken, GetGroupExpenses);
router.get("/groupbalance/:groupId", verifyToken, GetGroupBalance);
router.post("/make-payment", verifyToken, MakePayment);
router.get("/settle-up/:groupId", verifyToken, SettleUp);
router.post("/join-group", verifyToken, JoinGroup);
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)


module.exports= router;

