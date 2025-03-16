import BaseController from "../common/base_controller";
import { Chat, chatModel } from "./model";

const usersController = new BaseController<Chat>(chatModel);

export default usersController;
