const express = require('express');
const router = new express.Router();
const { getListOfCurrencies } = require("../utils/currencyConvert");

const baseUrl = '/api/currency';


router.get(`${baseUrl}/list`, async (req, res) => {
    try{
        const body = await getListOfCurrencies();

        res.send(body)

    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;
