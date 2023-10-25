import { UserDto } from "fm-transfer-model";
import { User } from "../model/user";

export function convertUserDto(dto: UserDto): User {
  const email = dto.email || "@";
  const parts = email.split("@");
  const emailLocal = parts[0];
  const emailHost = parts[1];
  return User.build({
    id: dto.id,
    emailHost,
    emailLocal,
  });
}

export function convertUserModel(userModel: User): UserDto {
  const emailLocal = userModel.getDataValue("emailLocal");
  const emailHost = userModel.getDataValue("emailHost");
  const email = `${emailLocal}@${emailHost}`;
  return {
    id: userModel.getDataValue("id") as number,
    name: userModel.getDataValue("name") as string,
    email,
  };
}
