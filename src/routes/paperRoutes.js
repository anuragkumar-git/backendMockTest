const express = require('express');
const router = express.Router();

const {listPapers, getSinglePaper, addPaper, deletePaper} = require('../controllers/paperController')


// GET ALL PAPERS (NO QUESTIONS) |--------------------------------------------------------------------------
router.get("/paperslist", listPapers);

// GET SINGLE PAPER |--------------------------------------------------------------------------
router.get("/papers/:paperid", getSinglePaper )

// ADD PAPER |--------------------------------------------------------------------------
router.post("/addpaper", addPaper);

// DELETE PAPER |--------------------------------------------------------------------------
router.delete("/deletepaper/:id", deletePaper );

module.exports = router