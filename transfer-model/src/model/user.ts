export interface UserDto {
  id?: number;
  name?: string;
  email?: string;
  isNew?: boolean;
}

export interface UserCharacterDto {
  userId?: number;
  characterId: number;
  role?: string;
}
