import { Post, postModel } from "./model";
import { Request, Response } from "express";
import BaseController from "../common/base_controller";
import { deleteFile, uploadFile } from "../common/storage";

class PostsController extends BaseController<Post> {
  constructor() {
    super(postModel);
  }

  async uploadImage(req: Request, res: Response) {
    try {
      await uploadFile(req, res);
    } catch (e) {
      console.error("Error creating post:", e);
      if (req.file?.filename) deleteFile(req.file.filename);
      res.status(500).send({
        message: "Internal Server Error",
        details: "Error saving photoSrc",
      });
    }
  }
  async create(req: Request, res: Response) {
    await this.uploadImage(req, res);
    try {
      const sender = req.params.userId;
      const post: Post = {
        ...JSON.parse(req.body.post),
        sender,
        likedBy: [],
        comments: [],
        photoSrc: req.file?.filename ?? "",
      };
      req.body = post;
      await super.create(req, res);
    } catch (e) {
      console.error("Error creating post:", e);
      res.status(400).send({
        message: "Bad Request",
        details: "Invalid post data",
      });
    }
  }

  async update(req: Request, res: Response) {
    await this.uploadImage(req, res);
    try {
      const postId: string = req.params.postId;

      const updatedPost: Post = JSON.parse(req.body.post);

      if (req.file?.filename) {
        updatedPost.photoSrc = req.file.filename;
        const oldPhoto = (await postModel.findById(postId))?.photoSrc;
        if (oldPhoto) deleteFile(oldPhoto);
      }

      req.body = updatedPost;
      await super.update(req, res);
    } catch (e) {
      console.error("Error updating post:", e);
      res.status(400).send({
        message: "Bad Request",
        details: "Invalid post data",
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const { offset, ...query } = req.query;
      const posts = await this.model
        .find(query as Partial<Post>)
        .sort({ createdAt: -1 })
        .skip(Number(offset ?? "0"))
        .limit(5)
        .populate("sender", "-tokens -email -password")
        .populate("likedBy") // Populate likedBy
        .populate({ path: "comments", populate: { path: "sender" } });
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

export default new PostsController();
