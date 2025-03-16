import BaseController from "../common/base_controller";
import { Message, messageModel } from "./model";

const usersController = new BaseController<Message>(messageModel);

export default usersController;
