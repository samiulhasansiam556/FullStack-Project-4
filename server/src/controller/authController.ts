import { Request, Response } from "express";
import prisma from "../lib/PrismaClient";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import transporter from "../config/emailConfig";
import { addHours } from "date-fns"; // helper for expiry

export const signUp = async (req: Request, res: Response) => {
  //console.log("signup invoked")
  const { name, username, email, password } = req.body;
  //console.log(name,username,password,email)
  if (!name || !username || !email || !password) {
    return res.status(200).json({ message: "All field are required" });
  }

  try {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail)
      return res.status(400).json({ message: "Email already exists" });

    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername)
      return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // create verification token
    const token = crypto.randomBytes(32).toString("hex");

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        verificationToken: token,
        verificationExpiry: addHours(new Date(), 1), // valid for 1 hour
      },
    });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

    // send email
    await transporter.sendMail({
      from: `"Campus Share" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email",
      html: `<p>Click here to verify your account: <a href="${verifyUrl}">Verify</a><br/>
             This link is valid for 1 hour.</p>`,
    });

    return res
      .status(201)
      .json({ message: "User registered. Check your email to verify." });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const token = req.params.id;

    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    //console.log(token,user)
    if (!user) return res.status(400).json({ message: "Invalid token" });

    // check expiry
    if (!user.verificationExpiry || user.verificationExpiry < new Date()) {
      return res
        .status(400)
        .json({ message: "Token expired. Please sign up again." });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationExpiry: null,
      },
    });

    res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // console.log(req)
    // console.log(email,password)

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and Password are required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid Credential" });

    if (!user.isVerified)
      return res.status(400).json({ message: "verify your email" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true, // safer (not accessible from JS)
      secure: false, // must be false in dev (no HTTPS on localhost)
      sameSite: "lax", // works fine for same-origin dev
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: { id: user.id, email: user.email, role: user.role },
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.isVerified)
      return res.status(400).json({ message: "Verify email Address" });
    // generate token
    const token = crypto.randomBytes(32).toString("hex");

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpiry: addHours(new Date(), 1), // valid for 1 hour
      },
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: `"Campus Share" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your password",
      html: `<p>You requested a password reset.</p>
             <p>Click here to reset: <a href="${resetUrl}">Reset Password</a></p>
             <p>This link is valid for 1 hour.</p>`,
    });

    res.json({ message: "Password reset email sent. Check your inbox." });
  } catch (error) {
    console.error("forgotPassword error", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password)
      return res.status(400).json({ message: "Password is required" });

    // console.log(token,password)

    const user = await prisma.user.findFirst({
      where: { resetPasswordToken: token },
    });

    if (!user) return res.status(400).json({ message: "Invalid token" });

    if (!user.resetPasswordExpiry || user.resetPasswordExpiry < new Date()) {
      return res
        .status(400)
        .json({ message: "Token expired. Please request again." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiry: null,
      },
    });

    res.json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    console.error("resetPassword error", error);
    res.status(500).json({ message: "Server error" });
  }
};
