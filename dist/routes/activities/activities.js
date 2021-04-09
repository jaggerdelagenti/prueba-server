"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const activity_model_1 = require("../../models/profesionals/activity.model");
//package qrCode
const QRCode = require('qrcode');
const activityRoutes = express_1.Router();
//get Activity
activityRoutes.post('/activity', (req, res) => {
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
