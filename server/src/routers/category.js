const express = require('express');
const auth = require('../middleware/auth');
const Category = require('../models/category');
const Transaction = require('../models/transaction');

const router = new express.Router();

const baseUrl = '/api/categories';

/**
 * API creates new category
 */
router.post(baseUrl, auth, async (req, res) => {

    try {
        if (req.body.name){
            const categoryWithSameName = await Category.find({owner: req.user._id, name: req.body.name });
            if (categoryWithSameName.length > 0) {
                return  res.status(400).send({error: 'category with same name already exists'})
            }
        }

        const category = new Category({
            //... copies content of req.body
            ...req.body,
            owner: req.user._id
        });

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


router.put(baseUrl + '/id::id' , auth, async (req, res) => {

    const categoryId = req.params.id;

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid body of request, in request should be only fields ' + allowedUpdates.toString() });
    }

    try {
        const category = await Category.findOne({_id: categoryId, owner: req.user._id});

        //duplicity chceck
        const categoryWithsameName =  await Category.find({owner: req.user._id, name: req.body.name });
        if (categoryWithsameName.length > 0) {
            if (categoryWithsameName[0]._id.toString() !== category._id.toString()) {
                return  res.status(400).send({error: 'category with same name already exists'});
            }
        }

        updates.forEach((update) => category[update] = req.body[update]);
        await category.save();
        res.send(category);

    } catch (e) {
        res.status(500).send();
    }
});



/**
 * API deletes category by ID
 */
router.delete(baseUrl + '/id::id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const category = await Category.findOne({_id, owner: req.user._id});

        if (!category) {
            return res.status(404).send();
        }

        const transactions = await Transaction.find({ categoryId: category._id, owner: req.user._id});

        if (transactions[0] === undefined) {
            category.remove();
        } else {
            return res.status(400).send({error: 'Catogory is linked with transactions, so cannot be deleted.' } );
        }

        res.send(category);
    } catch (e) {
        res.status(500).send();
    }
})



module.exports = router;
