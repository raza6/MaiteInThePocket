enum EAuthOrigin {
  Github,
}

interface User {
  name: string;
  avatar?: string;
  id: number;
  lastConnection: Date;
  origin: EAuthOrigin;
}

interface AuthCheck {
  success: boolean;
  user: User;
}

export {
  EAuthOrigin,
};
export type {
  User,
  AuthCheck
};
