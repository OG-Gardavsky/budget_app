const express = require('express');
const auth = require('../middleware/auth');
const Category = require('../models/category');

const router = new express.Router();


/**
 * API creates new account
 */
router.post('/categories', auth, async (req, res) => {
    const category = new Category({
        //... copies content of req.body
        ...req.body,
        owner: req.user._id
    });

    try {
        await category.save();
        res.status(201).send(category);
    } catch (e) {
        res.status(400).send(e);
    }
});




module.exports = router;