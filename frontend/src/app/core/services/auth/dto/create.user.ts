export interface createUserDto {
  acc: string;
  email: string;
  pass: string;
}

export interface RegisterResponseDto {
  access_token: string;
  user:{
    id:number;
    acc:string;
    email:string;
  }
}

export interface UserDto {
  id: number;
  acc: string;
  email: string;
}
