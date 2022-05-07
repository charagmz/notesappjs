const express = require('express');
const router = express.Router();
const Note = require('../models/Note');//class
const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    const {title, description} = req.body;
    const errors = [];
    if (!title) {
        errors.push({text: 'Please Write a Title'});
    }
    if (!description) {
        errors.push({text: 'Please Write a Description'});
    }
    if (errors.length>0) {
        res.render('notes/new-note', {
            errors, 
            title, 
            description
        });
    } else {
        const newNote = new Note({title, description});
        await newNote.save();
        req.flash('success_msg', 'Note Added Successfully');
        //console.log(newNote);
        res.redirect('/notes');
    }
});

router.get('/notes', isAuthenticated, async (req, res) => {
    //console.log(req.user)
    const notes = await Note.find().sort({date: 'desc'}).lean();
    //console.log(notes);
    res.render('notes/list', { notes });
    //res.send('Notes from database');
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id).lean();
    //console.log(note);
    res.render('notes/edit-note', {note});
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const {title, description} = req.body;
    const note = await Note.findByIdAndUpdate(req.params.id, {title, description});
    req.flash('success_msg', 'Note Updated Successfully');
    //console.log(note);
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note Deleted Successfully');
    //console.log(req.params.id);
    res.redirect('/notes');
});

module.exports = router;
