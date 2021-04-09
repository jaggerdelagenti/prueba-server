"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const activity_model_1 = require("../../models/profesionals/activity.model");
//package qrCode
const QRCode = require('qrcode');
const activityRoutes = express_1.Router();
//create activity
activityRoutes.post('/create', (req, res) => {
    const activity = {
        activityname: req.body.activityname,
        activitydate: req.body.activitydate,
        activitybegintime: req.body.activitybegintime,
        activityfinishtime: req.body.activityfinishtime,
        availableplaces: req.body.availableplaces,
        intensity: req.body.intensity,
        localizationlat: req.body.localizationlat,
        localizationlong: req.body.localizationlong,
        localization: req.body.localization,
        price: req.body.price,
        requirements: req.body.requirements,
        activitytype: req.body.activitytype,
        durationmins: req.body.durationmins,
        hex: ""
    };
    let qrcode = JSON.stringify(activity);
    activity.hex = qrcode;
    activity_model_1.Activity.create(activity).then(activityDB => {
        const newActivity = {
            _id: activityDB.id,
            activityname: activityDB.activityname,
            activitydate: activityDB.activitydate,
            activitybegintime: activityDB.activitybegintime,
            activityfinishtime: activityDB.activityfinishtime,
            availableplaces: activityDB.availableplaces,
            intensity: activityDB.intensity,
            localizationlat: activityDB.localizationlat,
            localizationlong: activityDB.localizationlong,
            localization: activityDB.localization,
            price: activityDB.price,
            requirements: activityDB.requirements,
            activitytype: activityDB.activitytype,
            durationmins: activityDB.durationmins,
            hex: activityDB.hex
        };
        res.json({
            ok: true,
            activity: newActivity
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
//get Activity
activityRoutes.get('/activity', (req, res) => {
    activity_model_1.Activity.findById(req.body.activityid, (err, activityDB) => {
        if (err)
            throw err;
        if (!activityDB) {
            return res.json({
                ok: false,
                message: 'activity not found'
            });
        }
        const retActivity = {
            _id: activityDB._id,
            activityname: activityDB.activityname,
            activitydate: activityDB.activitydate,
            activitybegintime: activityDB.activitybegintime,
            activityfinishtime: activityDB.activityfinishtime,
            availableplaces: activityDB.availableplaces,
            intensity: activityDB.intensity,
            localizationlat: activityDB.localizationlat,
            localizationlong: activityDB.localizationlong,
            localization: activityDB.localization,
            price: activityDB.price,
            requeriments: activityDB.requirements,
            activitytype: activityDB.activitytype,
            durationmins: activityDB.durationmins,
            hex: activityDB.hex
        };
        // Converting the data into base64
        QRCode.toDataURL(activityDB.hex, function (err, code) {
            if (err)
                return console.log("error occurred");
            // Printing the code
            retActivity.hex = code;
            res.json({
                ok: true,
                activity: retActivity
            });
        });
    });
});
//get All Activities
activityRoutes.get('/activities', (req, res) => {
    let filter = {};
    activity_model_1.Activity.find(filter, (err, activitiesDB) => {
        if (err)
            throw err;
        if (!activitiesDB) {
            return res.json({
                ok: false,
                message: 'activities not founded'
            });
        }
        res.json({
            ok: true,
            activities: activitiesDB
        });
    });
});
//delete Activity
exports.default = activityRoutes;
