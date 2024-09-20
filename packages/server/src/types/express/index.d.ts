declare namespace Express {
  interface Request {
      user : {
        id : number,
        username : string,
        isAdmin : boolean
      } | undefined;
  }
}