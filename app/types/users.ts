export type TUserDocument = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "bendahara" | "viewer";
};

export type TUserCollection = TUserDocument[];

export type TUserCreatePayload = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "bendahara" | "viewer";
};

export type TUserUpdatePayload = Partial<TUserCreatePayload>;

export type TUserResponse = {
  message: string;
  user: TUserDocument;
};

export type TUserDeleteResponse = {
  message: string;
};
