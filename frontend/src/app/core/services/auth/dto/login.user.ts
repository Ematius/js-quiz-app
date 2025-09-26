export interface loginUserDto{
  email:string;
  pass:string;
}

export interface LoginResponseDto {
  access_token: string;
  user:{
    id:number;
    acc:string;
    email:string;
  }
}


