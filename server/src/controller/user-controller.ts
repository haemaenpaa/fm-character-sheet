import Router from "express";
import checkJwt, { userInfoClient } from "../auth";
import { User } from "../model/user";
import { convertUserModel } from "../mapper/user-mapper";
import { randomId } from "../model/id-generator";
import { jsonParser } from "../app";
import { UserDto } from "fm-transfer-model";

const UserRouter = Router();
export default UserRouter;

UserRouter.get("", checkJwt, async (req, res) => {
  const user: User = await User.findOne({
    where: { openId: req.auth!.payload!.sub },
  });

  if (user) {
    res.send(convertUserModel(user));
    return;
  }
  const userInfo = (await userInfoClient.getUserInfo(req.auth.token)).data;

  const email: string = (userInfo.email as string) || "";
  const parts = email.split("@");
  const newUser = User.build({
    id: randomId(),
    openId: req.auth.payload.sub,
    emailHost: parts[1],
    emailLocal: parts[0],
    name: userInfo.nickname || parts[0],
  });

  newUser.save().then((created) => {
    const userDto: UserDto = convertUserModel(created);
    userDto.isNew = true;
    res.send(userDto);
  });
});

UserRouter.put("", checkJwt, jsonParser, async (req, res) => {
  const user: User = await User.findOne({
    where: { openId: req.auth!.payload!.sub },
  });

  const userDto = req.body as UserDto;

  if (!user) {
    res.sendStatus(404);
    return;
  }

  user.set("name", userDto.name);

  user.save().then((created) => res.send(convertUserModel(created)));
});
