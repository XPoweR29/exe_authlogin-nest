export interface User {
  id?: string;
  username: string;
  email: string;
  pwd: string;
  currentTokenId?: string | null;
  userRole?: string;
}
