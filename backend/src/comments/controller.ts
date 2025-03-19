import { Request, Response } from "express";
import { postModel } from "../posts/model";
import { commentModel } from "./model";

class CommentsController {
  async create(req: Request, res: Response) {
    const { postId, comment } = req.body;

    const post = await postModel.findById(postId);

    if (!post) {
      res.status(404).json({ message: "Post not found" });
    } else {
      const sender = req.params.userId;
      const fullComment = {
        ...comment,
        sender,
      };
      try {
        const newComment = await commentModel.create(fullComment);
        await postModel.updateOne(
          { _id: postId },
          { $push: { comments: newComment._id } }
        );
        res.status(201).send(newComment);
      } catch (error) {
        const err = error as Error;
        if (err.name === "ValidationError") {
          res
            .status(400)
            .send({ message: "Bad Request", details: err.message });
        } else if (err.name === "MongoServerSelectionError") {
          res.status(500).send({
            message: "Internal Server Error",
            details: "Database connection error",
          });
        } else {
          res
            .status(500)
            .send({ message: "Internal Server Error", details: err.message });
        }
      }
    }
  }
}

export default new CommentsController();
