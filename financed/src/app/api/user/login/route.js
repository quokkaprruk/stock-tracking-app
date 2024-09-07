import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { sign } from "jsonwebtoken";
export async function POST(request) {
  const { username, password } = await request.json();
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return Response.json({ message: "Invalid credentials" }, { status: 400 });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return Response.json({ msg: "Invalid credentials" }, { status: 400 });
    }
    const payload = { id: user.id, username: user.username };
    const token = sign(payload, process.env.JWT_SECRET);
    return Response.json({ success: true, token: "Bearer " + token });
  } catch (err) {
    console.error(err.message);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
