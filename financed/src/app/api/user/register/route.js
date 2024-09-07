import { NextResponse } from "next/server";
import { User } from "@/models/User";

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    console.log(username);
    let user = await User.findOne({ username });
    if (user) {
      return Response.json({ msg: "Username already exists" }, { status: 400 });
    }
    user = new User({ username, password });
    await user.save();
    return Response.json({ msg: "User registered successfully" });
  } catch (err) {
    console.error(err.message);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
