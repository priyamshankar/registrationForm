const express = require("express");
const bcrypt=require("bcryptjs");
// const mongoose =require("mongoose");
const router = new express.Router();
const app = express();
const userDetModel = require("./userDet");
require("./dbConnection");
router.use(express.json())
router.use(express.urlencoded({ extended: false }));
router.get("/", (req, res) => {
    // res.send("this is the home page");
    res.render("index")
})
router.get("/registration", (req, res) => {
    // res.send("this is the registration page");
    res.render("registrationPage");
})

router.post("/registration", async (req, res) => {
    try {
        const fetchPwd=req.body.password;
        const secPwd=await bcrypt.hash(fetchPwd,10);
        const pwComp=await bcrypt.compare(req.body.cnfmPassword,secPwd);
        if (pwComp) {
            console.log(req.body);
            res.render("loginPage");
            const saveUserDet = new userDetModel({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                userName: req.body.userName,
                city: req.body.city,
                state: req.body.state,
                zip: req.body.zip,
                password: secPwd,
                cnfmPassword: secPwd
            });
            await saveUserDet.save();
        }
        else {
            res.send("password didn't matche");
        }
    } catch (err) {
        console.log(err);
    }
})

router.get("/login", (req, res) => {
    res.render("loginPage");
})

router.post("/login", async (req, res) => {
    try {
        const userName = req.body.userName;
        const loginDetDb = await userDetModel.findOne({ userName: userName });
        const password = req.body.password;

        console.log(loginDetDb);
        // res.send("index");
        if (loginDetDb.password === password) {
            res.render("index");
        }
        else {
            res.send("password or user id wrong")
        }

    } catch (err) {
        res.send("error");
        console.log(err);
    }
})
module.exports = router; 