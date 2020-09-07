const router = require('express').Router()
const { stringify } = require('querystring')
const fetch = require('node-fetch')
const crypto = require("crypto");
const path = require("path");
const squareConnect = require("square-connect");
const Appointment = require('../models/Appointment')
const Date = require('../models/Date')



const accessToken =
    "EAAAEKGQCP2rT91Sea3EqWYjuAzfsfJPuNPnLEuQ9lnzAv6Wmo5mU5WKm-p5gSHQ";
// Set Square Connect credentials and environment
const defaultClient = squareConnect.ApiClient.instance;

// Configure OAuth2 access token for authorization: oauth2
const oauth2 = defaultClient.authentications["oauth2"];
oauth2.accessToken = accessToken;

// Set 'basePath' to switch between sandbox env and production env
// sandbox: https://connect.squareupsandbox.com
// production: https://connect.squareup.com
defaultClient.basePath = "https://connect.squareupsandbox.com"

router.get("/:id/process-payment", (req, res) => {
    Appointment.findById(req.params.id)
        .then((data) => {
            if (!data) {
                res.send("no data ")
            } else {
                const total = data.orderType 
                // res.sendFile(path.join(__dirname+'/payment.html'))
                res.render("payment", { data , total})
            }
        })
        .catch((err) => console.log(err))
});

router.post("/:id/process-payment", async (req, res) => {
    const request_params = req.body

    // length of idempotency_key should be less than 45
    const idempotency_key = crypto.randomBytes(22).toString("hex")

    // Charge the customer's card
    const payments_api = new squareConnect.PaymentsApi()
    const request_body = {
        source_id: request_params.nonce,
        amount_money: {
            amount: 100 * req.body.price, // $1.00 charge
            currency: "USD",
        },
        idempotency_key: idempotency_key,
    }

    try {
        const response = await payments_api.createPayment(request_body)
        Appointment.findById(req.params.id).then(appointment => {
            appointment.toShow = true
            appointment.save()
        }).catch(err => console.log(err))
        res.status(200).json({
            title: "Payment Successful",
            result: response,
        });
        // console.log(response)
        console.log(req.body.cardData)
    } catch (error) {
        res.status(500).json({
            title: "Payment Failure",
            result: error.response,
        })
        console.log(error)
    }
})


router.route('/after-payment').get((req, res) => {
    res.render('completePayment')
})


module.exports = router