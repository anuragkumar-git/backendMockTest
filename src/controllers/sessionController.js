const Paper = require("../models/paper");
const Session = require('../models/testSession')

/*
|--------------------------------------------------------------------------
| START TEST/SESSION
|--------------------------------------------------------------------------
*/
const startSession = async (req, res) => {
  try {
    const { paperId } = req.body;
    const paper = await Paper.findById(paperId);

    if (!paper)
      return res.status(404).json({ error: "Paper not found" });

    const session = new Session({
      paper: paper._id,
      startAt: new Date(),
      timeLimitMinutes: 180,
    });

    await session.save();

    res.json({
      success: true,
      sessionId: session._id,
      timeLimitMinutes: session.timeLimitMinutes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cannot start session" });
  }
}

/*
|--------------------------------------------------------------------------
| SUBMIT TEST/SESSION
|--------------------------------------------------------------------------
*/
const submitSession = async (req, res) => {
  try {
    const { sessionId, answers } = req.body;

    const session = await Session
      .findById(sessionId)
      .populate("paper");

    if (!session)
      return res.status(400).json({ error: "Invalid session" });

    const now = new Date();
    const deadline = new Date(
      session.startAt.getTime() + session.timeLimitMinutes * 60000
    );
    const timedOut = now > deadline;

    const questions = session.paper.questions || [];

    let total = questions.length;
    let attempted = 0;
    let correctCount = 0;
    let wrongCount = 0;

    const wrongQuestions = [];

    for (const q of questions) {
      const qNum = String(q.question_number);
      const selected = answers[qNum];
      const correct =
        q.correct_answer ??
        q.correct_answer_key ??
        null;

      const isAttempted =
        selected !== undefined &&
        selected !== null &&
        selected !== "";

      if (isAttempted) attempted++;

      if (!isAttempted) continue;

      if (String(selected) === String(correct)) {
        correctCount++;
      } else {
        wrongCount++;

        wrongQuestions.push({
          question_number: q.question_number,
          question_text: q.question_text_gu || q.question_text_en || q.question_text || null,
          expression: q.expression || null,
          options: q.options || {},
          selected,
          correct,
          part: q.part || null,
        });
      }
    }

    const finalScore = Number((correctCount - wrongCount * 0.25).toFixed(2));

    session.finishedAt = now;
    session.timedOut = timedOut;
    session.score = finalScore;
    session.attempted = attempted;

    await session.save();

    res.json({
      success: true,
      total,
      correct: correctCount,
      wrong: wrongCount,
      attempted,
      unattempted: total - attempted,
      finalScore,
      wrongQuestions,
      timedOut,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Submitting test failed" });
  }
}

module.exports ={startSession, submitSession}