import express from "express";
import { prisma } from "@repo/db/client";

const app = express();

app.use(express.json());

app.post("/signin", async (req, res) => {
  try {
    const { email, password ,username } = req.body;

    // dummy user creation for testing
    const user = await prisma.user.create({
      data: {
        email,
        password,
        username
      },
    });

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

app.get("/", (req, res) => {
  res.send("HTTP Backend Running 🚀");
});

app.listen(3002, () => {
  console.log("Server running on port 3002");
});