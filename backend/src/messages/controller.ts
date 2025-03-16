import BaseController from "../common/base_controller";
import { Message, messageModel } from "./model";

const messagesController = new BaseController<Message>(messageModel);

export default messagesController;
