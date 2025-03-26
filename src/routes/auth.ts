import express, { Request, Response } from "express";
import {
  initiatePasswordReset,
  linkUserToTenant,
  signInWithEmail,
  signUpNewUser,
  updatePassword,
  verifyOtp,
  signout,
} from "../authClient/authFunctions";
import { tenants } from "../db/schema";
import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { getTenantByEmail, getTenantInfoByUserId } from "../db/models/tenant";
import { authClient } from "../authClient";
import "dotenv/config";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, phone, dob } = req.body;

    if (!email || !password || !phone || !dob) {
      res.status(400).json({ message: "Missing mandatory fields." });
      return;
    }

    const isExistingTenant = await getTenantByEmail(email);
    if (!isExistingTenant) {
      res.status(404).json({
        message: "Unable to register account. Contact Elite Space Leasing.",
      });
      return;
    }

    const { data, error } = await signUpNewUser(email, password, "DefaultName");
    if (error) {
      const errorMsg =
        error.code === "weak_password"
          ? "Password not strong enough. Must be at least 6 characters."
          : "Error signing up";
      res.status(500).json({ message: errorMsg });
      return;
    }

    if (data.user) {
      const { error: dbError } = await linkUserToTenant(
        email,
        data.user.id,
        phone,
        dob
      );
      if (dbError) {
        res.status(500).json({ message: "Server error while linking tenant." });
        return;
      }

      res.status(200).json({ message: "Account registered." });
      return;
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
});

router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const { error } = await initiatePasswordReset(email);

    if (error) {
      res.status(400).json({ message: "Something went wrong." });
      return;
    }

    res.status(200).json({ message: "Password reset email sent." });
    return;
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
});

router.post("/update-password", async (req: Request, res: Response) => {
  try {
    const { error } = await updatePassword(req, res);

    if (error) {
      res
        .status(400)
        .json({ message: "Not authorized. Unable to reset password." });
      return;
    }

    res.status(200).json({ message: "Password reset successfully." });
    return;
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
});

router.get("/confirm", async (req: Request, res: Response) => {
  const { token_hash, type, next } = req.query;
  const ERROR_PAGE_URL = process.env.ERROR_PAGE_URL;

  if (
    typeof token_hash === "string" &&
    typeof type === "string" &&
    type === "recovery"
  ) {
    const error = await verifyOtp({ type, token_hash, req, res });

    if (!error && next) {
      res.redirect(303, `${next}`);
      return;
    }
  }

  res.redirect(303, ERROR_PAGE_URL!);
  return;
});

router.post("/signin", async (req: Request, res: Response) => {
  try {
    const secureFlag = Boolean(process.env.SECURE_FLAG);
    const { email, password } = req.body;
    const { data, error } = await signInWithEmail(email, password);

    if (error) {
      const errorMsg =
        error.code === "email_not_confirmed"
          ? "Check email and verify account to log in."
          : "Invalid email or password. Please try again.";
      res.status(401).json({ message: errorMsg });
      return;
    }

    const { session, user } = data;
    if (!session || !user) {
      res.status(500).json({ message: "Failed to retrieve session or user." });
      return;
    }

    const tenantRecord = await db.query.tenants.findFirst({
      where: eq(tenants.email, email),
      columns: { id: true },
    });

    if (!tenantRecord) {
      res.status(404).json({ message: "Tenant not found for this user." });
      return;
    }

    res.cookie("sb-access-token", session.access_token, {
      httpOnly: true, //Prevents JS access
      secure: secureFlag, // only sent over HTTPS, set as true only in production
      sameSite: "none",
      maxAge: session.expires_in * 1000,
    });

    res.status(200).json({
      message: "Signed in successfully",
      tenantId: tenantRecord.id,
    });
    return;
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
});

router.get("/verify-user", async (req: Request, res: Response) => {
  try {
    const token = req.cookies["sb-access-token"];
    if (!token) {
      res.status(401).json({ message: "Unauthorized. No session found." });
      return;
    }

    const { data, error } = await authClient.auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({ message: "Invalid or expired session." });
      return;
    }

    const tenantInfo = await getTenantInfoByUserId(data.user.id);
    if (!tenantInfo) {
      res.status(401).json({ message: "Unable to find tenant in query." });
      return;
    }

    res.status(200).json(tenantInfo);
    return;
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
});

router.post("/signout", async (req: Request, res: Response) => {
  try {
    const error = await signout();
    if (error) {
      res.status(401).json({ message: "Sign out error." });
      return;
    }

    res.status(200).json({ message: "Signed out successfully." });
    return;
  } catch (error) {
    console.error("Error during sign-out:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
});

export default router;
