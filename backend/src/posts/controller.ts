import { Post, postModel } from "./model";
import { Request, Response } from "express";
import BaseController from "../common/base_controller";
import { deleteFile, uploadFile } from "../common/storage";

class PostsController extends BaseController<Post> {
  constructor() {
    super(postModel);
  }

  async create(req: Request, res: Response) {
    const sender = req.params.userId;

    try {
      await uploadFile(req, res);
      const post: Post = {
        ...JSON.parse(req.body.post),
        sender,
        likedBy: [],
        comments: [],
        photoSrc: req.file?.filename ?? "",
      };

      req.body = post;

      await super.create(req, res);
    } catch (error) {
      console.error("Error creating post:", error);
      req.file?.filename && deleteFile(req.file.filename);
      res.status(500).send({
        message: "Internal Server Error",
        details: "Error saving photoSrc",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      await uploadFile(req, res);
      const postId: string = req.params.postId;
      const updatedPost: Post = JSON.parse(req.body.updatedPostContent);

      if (req.file?.filename) {
        updatedPost.photoSrc = req.file.filename;
        const oldPhoto = (await postModel.findById(postId))?.photoSrc;
        if (oldPhoto) deleteFile(oldPhoto);
      }
      req.body = updatedPost;
      await super.update(req, res);
    } catch (error) {
      req.file?.filename && deleteFile(req.file.filename);
      res.status(500).send({
        message: "Internal Server Error",
        details: "Error saving photoSrc",
      });
    }
  }

  async getAll(req: Request, res: Response) {
    if (Object.keys(req.query).length === 0) {
      super.getAll(req, res);
    } else {
      try {
        const posts = await this.model
          .find(req.query as Partial<Post>)
          .sort({ createdAt: -1 })
          .populate("owner", "-tokens -email -password")
          .populate("likedBy")
          .populate({ path: "comments", populate: { path: "user" } });
        res.send(posts);
      } catch (error) {
        const err = error as Error;
        if (err.name === "MongoServerSelectionError") {
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

export default new PostsController();
