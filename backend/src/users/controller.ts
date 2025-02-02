import BaseController from "../common/base_controller";
import { User, userModel } from "./model";

const usersController = new BaseController<User>(userModel);

export default usersController;
