const Board = require("../models/board");
const Comment = require("../models/comment");

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({}).sort({ createdAt: -1 });

    res.send(comments);
  } catch (error) {
    console.error(error);

    res.status(500).send({ message: error.message });
  }
};

const getBoardComments = async (req, res) => {
  try {
    const { boardId } = req.params;

    // μ‘°κΈ° λ¦¬ν΄
    const board = await Board.findById(boardId);
    if (board === null) {
      return res.status(400).send({ message: "π κ²μκΈμ΄ μμ΅λλ€." });
    }

    const comment = await Comment.find({ boardId }).sort({ createdAt: -1 });

    res.send(comment);
  } catch (error) {
    console.error(error);

    res.status(500).send({ message: error.message });
  }
};

const postBoardComment = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { body, userName } = req.body;

    // μ‘°κΈ° λ¦¬ν΄
    const board = await Board.findById(boardId);
    if (board === null) {
      return res.status(400).send({ message: "π κ²μκΈμ΄ μμ΅λλ€." });
      // return μλΆμμλ μλ¬ νμ€νΈ
      // boardID = 63a31e030f1338b7fba2990c
      // res.send({message: "π κ²μκΈμ΄ μμ΅λλ€."});
    }

    if (Object.keys(req.body).length !== 2) {
      return res.status(400).send({ message: "νλΌλ―Έν°λ₯Ό νμΈνμΈμ" });
    }

    if (body === "") {
      return res.status(400).send("π λκΈ λ΄μ©μ μλ ₯ν΄μ£ΌμΈμ");
    }

    const comment = await Comment.create({
      body,
      userName,
      boardId,
    });

    console.log(comment);

    res.send(comment);
  } catch (error) {
    console.error(error);

    res.status(500).send(error.message);
  }
};

const putBoardComment = async (req, res) => {
  try {
    const { boardId, commentId } = req.params;
    const { body, userName } = req.body;

    // μ‘°κΈ° λ¦¬ν΄
    const board = await Board.findById(boardId);
    if (board === null) {
      return res.status(400).send({ message: "π κ²μκΈμ΄ μμ΅λλ€." });
    }

    const _comment = await Comment.findById(commentId);
    if (_comment === null) {
      return res.status(400).send({ message: "π λκΈμ΄ μμ΅λλ€." });
    }

    if (Object.keys(req.body).length !== 2) {
      return res.status(400).send({ message: "νλΌλ―Έν°λ₯Ό νμΈνμΈμ" });
    }

    if (body === "") {
      return res.status(400).send("π λκΈ λ΄μ©μ μλ ₯ν΄μ£ΌμΈμ");
    }

    const result = await Comment.findByIdAndUpdate(
      commentId,
      {
        body,
        userName,
      },
      { new: true }
    );

    console.log("result", result);

    res.send({ message: "success" });
  } catch (error) {
    console.error(error);

    res.status(500).send(error.message);
  }
};

const deleteBoardComments = async (req, res) => {
  try {
    const { boardId, commentId } = req.params;

    // μ‘°κΈ° λ¦¬ν΄
    const board = await Board.findById(boardId);
    if (board === null) {
      return res.status(400).send({ message: "π κ²μκΈμ΄ μμ΅λλ€." });
    }

    const _comment = await Comment.findById(commentId);
    if (_comment === null) {
      return res.status(400).send({ message: "π λκΈμ΄ μμ΅λλ€." });
    }

    const comment = await Comment.findByIdAndDelete(commentId);

    res.send(comment);
  } catch (error) {
    console.error(error);

    res.status(500).send(error.message);
  }
};

const deleteComments = async (req, res) => {
  try {
    const result = await Comment.deleteMany();

    console.log("result", result);

    if (result.deletedCount > 0) {
      return res.send({ message: "success" });
    } else {
      return res.send({ message: "nothing to delete" });
    }
  } catch (error) {
    console.error(error);

    res.status(500).send(error.message);
  }
};

module.exports = {
  getComments,
  getBoardComments,
  postBoardComment,
  putBoardComment,
  deleteBoardComments,
  deleteComments,
};