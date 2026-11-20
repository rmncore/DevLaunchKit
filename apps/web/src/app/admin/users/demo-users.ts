export interface DisplayUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  provider: string;
  role: string;
  plan: string;
  status: string;
  createdAt: string;
}

export const demoUsers: DisplayUser[] = [
  {
    id: "u_1",
    name: "Alice Vance",
    email: "alice.vance@clerk.com",
    avatarUrl: "https://avatar.vercel.sh/alice",
    provider: "clerk",
    role: "admin",
    plan: "Enterprise Plan",
    status: "active",
    createdAt: "2026-01-10T12:00:00Z",
  },
  {
    id: "u_2",
    name: "Bob Carter",
    email: "bob.carter@gmail.com",
    avatarUrl: "https://avatar.vercel.sh/bob",
    provider: "google",
    role: "user",
    plan: "Pro Plan",
    status: "active",
    createdAt: "2026-03-15T14:30:00Z",
  },
  {
    id: "u_3",
    name: "Charlie Ding",
    email: "charlie@stripe.dev",
    avatarUrl: "https://avatar.vercel.sh/charlie",
    provider: "github",
    role: "user",
    plan: "Pro Plan",
    status: "suspended",
    createdAt: "2026-04-20T09:15:00Z",
  },
  {
    id: "u_4",
    name: "Dave Miller",
    email: "dave.miller@yahoo.com",
    avatarUrl: "https://avatar.vercel.sh/dave",
    provider: "email",
    role: "user",
    plan: "Free Plan",
    status: "active",
    createdAt: "2026-05-02T10:45:00Z",
  },
  {
    id: "u_5",
    name: "Emma Watson",
    email: "emma.watson@gmail.com",
    avatarUrl: "https://avatar.vercel.sh/emma",
    provider: "google",
    role: "user",
    plan: "Enterprise Plan",
    status: "active",
    createdAt: "2026-05-18T16:20:00Z",
  },
  {
    id: "u_6",
    name: "Frank Lampard",
    email: "frank@chelsea.fc",
    avatarUrl: "https://avatar.vercel.sh/frank",
    provider: "email",
    role: "user",
    plan: "Free Plan",
    status: "suspended",
    createdAt: "2026-06-01T11:00:00Z",
  },
  {
    id: "u_7",
    name: "Grace Hopper",
    email: "grace.hopper@navy.mil",
    avatarUrl: "https://avatar.vercel.sh/grace",
    provider: "github",
    role: "admin",
    plan: "Pro Plan",
    status: "active",
    createdAt: "2026-06-12T08:30:00Z",
  },
  {
    id: "u_8",
    name: "Henry Cavill",
    email: "henry@superman.com",
    avatarUrl: "https://avatar.vercel.sh/henry",
    provider: "email",
    role: "user",
    plan: "Free Plan",
    status: "active",
    createdAt: "2026-07-04T13:40:00Z",
  },
];
