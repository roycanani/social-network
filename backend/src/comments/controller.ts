import { Request, Response } from "express";
import BaseController from "../common/base_controller";
import { Comment, commentModel } from "./model";
import { postModel } from "../posts/model";

class CommentsController extends BaseController<Comment> {
  constructor() {
    super(commentModel);
  }

  async create(req: Request, res: Response) {
    const sender = req.params.userId;
    const comment = {
      ...req.body,
      sender,
    };
    req.body = comment;
    // Check if the post exists by finding the post ID
    const postExists = await postModel.findById(req.body.post);

    if (!postExists) {
      res.status(404).json({ message: "Post not found" });
    } else {
      super.create(req, res);
    }
  }

  async update(req: Request, res: Response) {
    const sender = req.params.userId;
    const comment = {
      ...req.body,
      sender,
    };
    req.body = comment;
    if (req.body.post) {
      // Check if the post exists by finding the post ID
      const postExists = await postModel.findById(req.body.post);

      if (!postExists) {
        res.status(404).send({ message: "Post not found" });
      } else {
        super.update(req, res);
      }
    } else super.update(req, res);
  }

  async getAll(req: Request, res: Response): Promise<void> {
    if (Object.keys(req.query).length === 0) super.getAll(req, res);
    else {
      try {
        const comments = await commentModel
          .find(req.query as Partial<Comment>)
          .populate("post", "user");
        res.send(comments);
      } catch (err) {
        res.status(400).send(err);
      }
    }
  }
}

export default new CommentsController();
