const express = require('express');
const auth = require('../middleware/auth');
const Category = require('../models/category');

const router = new express.Router();

const baseUrl = '/api/categories';

/**
 * API creates new account
 */
router.post(baseUrl, auth, async (req, res) => {
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

/**
 * API return list of categories created by User
 */
router.get(baseUrl, auth, async (req, res) => {
    try {

        await req.user.populate({
            path: 'categories'
        }).execPopulate();

        res.send(req.user.categories);

    } catch (e) {
        res.status(500).send(e);
    }
});


/**
 * API deletes acount by ID
 */
router.delete(baseUrl + '/id::id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const category = await Category.findOne({_id, owner: req.user._id});

        if (!category) {
            return res.status(404).send();
        }

        category.remove();

        res.send(category);
    } catch (e) {
        res.status(500).send();
    }
})



module.exports = router;
