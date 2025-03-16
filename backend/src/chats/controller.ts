import BaseController from "../common/base_controller";
import { Chat, chatModel } from "./model";

const chatsController = new BaseController<Chat>(chatModel);

export default chatsController;
