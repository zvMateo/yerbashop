import { Url } from "next/dist/shared/lib/router/router";

export interface User {
    name: string;
    email: string;
    avatar: Url | string;
}

export const data = {
  user: {
    name: "YerbaXanaes",
    email: "admin@example.com",
    avatar: "/avatars/yerbaxanaes.jpg",
  },
};