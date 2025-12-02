// Models
const Paper = require("../models/paper");
/*
|--------------------------------------------------------------------------
| GET ALL PAPERS (NO QUESTIONS)
|--------------------------------------------------------------------------
*/
const listPapers = async (req, res) => {
    try {
        const papers = await Paper.find({}, { questions: 0 });
        res.status(200).json({ success: true, papers });
    } catch (err) {
        console.error(`Failed to fetch paper list: ${err}`);
        res.status(500).json({ error: "Failed to load papers -From server" });
    }
}

/*
|--------------------------------------------------------------------------
| GET SINGLE PAPER
|--------------------------------------------------------------------------
*/

const getSinglePaper = async (req, res) => {
    try {
        const id = req.params.paperid;

        const paperData = await Paper.findById(id);

        if (!paperData)
            return res.status(404).json({ error: "Paper not found" });

        res.status(200).json({
            success: true,
            data: paperData,
            message: "Successfully fetched",
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching paper" });
    }
}

/*
|--------------------------------------------------------------------------
| ADD PAPER
|--------------------------------------------------------------------------
*/
const addPaper = async (req, res) => {
    try {
        const { title, description, questionsJSON } = req.body;

        if (!title || !questionsJSON) {
            return res
                .status(400)
                .json({ error: "Title and Questions JSON are required" });
        }

        // Ensure questionsJSON is an array
        let questions = questionsJSON;

        if (typeof questionsJSON === "string") {
            try {
                questions = JSON.parse(questionsJSON);
            } catch (err) {
                return res
                    .status(400)
                    .json({ error: "Invalid JSON format for questions" });
            }
        }

        if (!Array.isArray(questions)) {
            return res
                .status(400)
                .json({ error: "questionsJSON must be an array" });
        }

        const paper = new Paper({
            title,
            description: description || "",
            questions,
        });

        await paper.save();

        return res.status(201).json({
            success: true,
            message: "Paper added successfully",
            paperId: paper._id,
            totalQuestions: questions.length,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error while adding paper" });
    }
}

/*
|--------------------------------------------------------------------------
| DELETE PAPER
|--------------------------------------------------------------------------
*/
const deletePaper = async (req, res) => {
    try {
        const paperId = req.params.id;

        const deleted = await Paper.findByIdAndDelete(paperId);

        if (!deleted) {
            return res.status(404).json({ error: "Paper not found" });
        }

        res.status(200).json({ success: true, message: "Paper deleted successfully" });
    } catch (error) {
        console.log(`Paper delete error: ${error}`);
        res.status(500).json({ error: "Error deleting paper" });
    }
}
module.exports = { listPapers, getSinglePaper, addPaper, deletePaper }