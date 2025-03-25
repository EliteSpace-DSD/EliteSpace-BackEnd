import express, { Request, Response } from "express";
import { getTenantByEmail, getTenantInfoByUserId } from "../db/models/tenant";
import { initiatePasswordReset, linkUserToTenant, signInWithEmail, signUpNewUser, updatePassword, verifyOtp, signout } from "../authClient/authFunctions";
import { authClient } from "../authClient";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, phone, dob, first_name } = req.body;
    const isExistingTenant = await getTenantByEmail(email);

    if (!isExistingTenant) {
      res.status(404).json({
        message: "Unable to register account. Contact Elite Space Leasing.",
      });
      return;
    }

    const { data, error } = await signUpNewUser(email, password, first_name);

    if (error) {
      const errorMsg = error.code === "weak_password" ? "Password not strong enough. Must be atleast 6 characters." : "Error signing up";
      res.status(500).json({ message: errorMsg });
      return;
    }

    if (data.user) {
      if (!email || !data.user.id || !phone || !dob) {
        console.error("Missing certain mandatory info");
        res.status(500).json({message: "Empty mandatory fields"});
        return;
      }
  
      const { error: dbError } = await linkUserToTenant(email, data.user.id, phone, dob);
      console.log("CHECK POINT 1");
      console.log(data.user);
      console.log("CHECK POINT 2");
      console.log(dbError);
      if (dbError) {
        res.status(500).json({ message: "Server error" });
        return;
      }

      res.status(200).json({ message: "Account registered." });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    return;
  }
});

router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const { data, error } = await initiatePasswordReset(email);

    if (error) {
      res.status(400).json({ message: "something went wrong" });
      return;
    }

    res.status(200).json({ message: "Password reset email sent." });
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    return;
  }
});

router.post("/update-password", async (req: Request, res: Response) => {
  const { data, error } = await updatePassword(req, res);

  if (error) {
    console.log(error);
    res.status(400).json({ message: "Not authorized. Unable to reset password." });
    return;
  }

  res.status(200).json({ message: "Password reset successfully." });
  return;
});

router.get("/confirm", async function (req: Request, res: Response) {
  const { token_hash, type, next } = req.query;
  const ERROR_PAGE_URL = process.env.ERROR_PAGE_URL;

  /*
    query parameters are typed in Express as string | ParsedQs (when query param is an obj) | (string | ParsedQs[]). This last one represents an array of those types. These values are passed to to verifyOtp, which expects only a string type that matches specific enums. So there is a type mismatch. Using type narrowing here to ensure that the
    variables are the expected type before calling verifyOtp to prevent crashing the server*/
  if (typeof token_hash === "string" && typeof type === "string" && type === "recovery") {
    const error = await verifyOtp({ type, token_hash, req, res });

    if (!error) {
      if (next) {
        res.redirect(303, `${next}`);
        return;
      }
    }
  }

  res.redirect(303, ERROR_PAGE_URL!);
  return;
});

// Note: users needs to click confirm on their confirmation email before being able to sign in
router.post("/signin", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await signInWithEmail(email, password);

    if (error) {
      if (error.code === "email_not_confirmed") {
        res.status(400).json({ message: "Check email and verify account to log in." });
        return;
      }

      res.status(401).json({ message: "Invalid email or password. Please try again." });
      return;
    }

    // Set session cookie (for persistence)
    const { session } = data;
    if (!session) {
      res.status(500).json({ message: "failed to retrieve session." });
      return;
    }

    // access token expires_in by default is 3600 seconds, * 1000 = 3600000 milliseconds = 1 hour
    res.cookie("sb-access-token", session.access_token, {
      httpOnly: true, //Prevents JS access
      // secure: true, // only sent over HTTPS, set as true only in production
      sameSite: "strict",
      maxAge: session.expires_in * 1000,
    });

    res.status(200).json({ message: "Signed in successfully" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    return;
  }
});

router.get("/verify-user", async (req: Request, res: Response) => {
      try {
          const token = req.cookies['sb-access-token'];
          if (!token) {
              res.status(401).json({message: "Unauthorized. No session found."});
              return;
          }
  
          const {data, error} = await authClient.auth.getUser(token);
  
          if (error || !data.user) {
              res.status(401).json({message: "Invalid or expired session."});
              return;
          }
  
          //  Adding user property (object) to request object
          req.user = {
              userId: data.user.id, 
              email: data.user.email
          };
  
          const tenantInfo = await getTenantInfoByUserId(data.user.id);
          if (!tenantInfo) {
              res.status(401).json({message: "unable to find tenant in query"});
              return;          
          }
  
          res.status(200).json(tenantInfo);
          return;
      } catch (err) {
          console.error('Auth middleware error:', err)        
          res.status(500).json({ message: 'Server error' });
          return;
      }
});

router.post("");
router.post("/signout", async (req: Request, res: Response) => {
  try {
    const error = await signout();
    if (error) {
      res.status(401).json({ message: "Sign out error." });
      return;
    }

    res.status(200).json({ message: "Signed out successfully" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    return;
  }
});
router.get("/reset-test", (req: Request, res: Response) => {
  res.redirect("http://localhost:5173/update-password");
});

export default router;
