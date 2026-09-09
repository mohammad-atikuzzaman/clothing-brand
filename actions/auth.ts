"use server";

import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongoose";
import { UserModel, UserRole } from "@/lib/models/User";
import { loginSchema, registerSchema, LoginInput, RegisterInput } from "@/lib/validations/auth";
import {
  signAuthToken,
  setSessionCookie,
  clearSessionCookie,
  getSession,
  getClientIp,
  AuthSessionPayload,
} from "@/lib/auth";
import {
  checkRateLimit,
  isIpBanned,
  recordFailedLogin,
  recordSuccessfulLogin,
} from "@/lib/security";

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
  };
  errors?: Record<string, string[]>;
  isBanned?: boolean;
}

/**
 * Server Action: Secure User Login with Rate Limiting & Brute-Force Defense
 */
export async function loginAction(input: LoginInput): Promise<AuthResponse> {
  try {
    const ip = await getClientIp();

    // 1. IP Ban check
    const banStatus = await isIpBanned(ip);
    if (banStatus.banned) {
      return {
        success: false,
        isBanned: true,
        message:
          banStatus.reason ||
          "Access denied: Your IP address has been restricted due to suspicious activities.",
      };
    }

    // 2. High-frequency rate limit: max 10 login requests per minute per IP
    const rateLimit = checkRateLimit(`login:${ip}`, 10, 60);
    if (!rateLimit.allowed) {
      return {
        success: false,
        message: `Too many login attempts. Please wait ${rateLimit.resetInSeconds} seconds before trying again.`,
      };
    }

    // 3. Schema validation
    const parsed = loginSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        message: "Invalid login credentials format.",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const { email, password } = parsed.data;

    await connectDB();

    // 4. Find user with password explicitly selected
    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      const failure = await recordFailedLogin(ip, email, "Account not found");
      if (failure.bannedNow) {
        return {
          success: false,
          isBanned: true,
          message:
            "Too many failed login attempts! Your IP address has been temporarily locked for 30 minutes.",
        };
      }
      return {
        success: false,
        message: `Invalid email or password. (${failure.remainingAttempts} attempts remaining before IP lock)`,
      };
    }

    // 5. Check if user account is disabled/banned
    if (user.isBanned) {
      return {
        success: false,
        message:
          user.banReason ||
          "Your account has been suspended by administration. Please contact customer support.",
      };
    }

    // 6. Verify password securely using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password || "");
    if (!isPasswordValid) {
      const failure = await recordFailedLogin(ip, email, "Incorrect password");
      if (failure.bannedNow) {
        return {
          success: false,
          isBanned: true,
          message:
            "Too many failed attempts! Your IP address has been locked for 30 minutes.",
        };
      }
      return {
        success: false,
        message: `Invalid email or password. (${failure.remainingAttempts} attempts remaining before IP lock)`,
      };
    }

    // 7. Login successful: reset counters & update login metadata
    await recordSuccessfulLogin(ip, email);

    user.lastLoginAt = new Date();
    user.lastLoginIp = ip;
    user.failedLoginAttempts = 0;
    await user.save();

    // 8. Sign JWT token and set HttpOnly secure cookie
    const token = await signAuthToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await setSessionCookie(token);

    return {
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    };
  } catch (error: any) {
    console.error("Login server action error:", error);
    return {
      success: false,
      message: "An unexpected security or network error occurred during login.",
    };
  }
}

/**
 * Server Action: Register a new customer user
 */
export async function registerAction(input: RegisterInput): Promise<AuthResponse> {
  try {
    const ip = await getClientIp();

    // 1. IP Ban check
    const banStatus = await isIpBanned(ip);
    if (banStatus.banned) {
      return {
        success: false,
        isBanned: true,
        message: "Your IP is currently restricted.",
      };
    }

    // 2. Anti-spam rate limit: max 5 registrations per hour per IP
    const rateLimit = checkRateLimit(`reg:${ip}`, 5, 3600);
    if (!rateLimit.allowed) {
      return {
        success: false,
        message: "Registration limit exceeded from this network. Please try again later.",
      };
    }

    // 3. Schema validation
    const parsed = registerSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        message: "Please correct the errors in the registration form.",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const { name, email, phone, password } = parsed.data;

    await connectDB();

    // 4. Ensure email is unique
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return {
        success: false,
        message: "An account is already registered with this email address.",
        errors: { email: ["Email address is already in use"] },
      };
    }

    // 5. Securely hash password with bcrypt (12 rounds)
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Create user in MongoDB
    const newUser = await UserModel.create({
      name,
      email,
      phone: phone || "",
      password: hashedPassword,
      role: "customer",
      lastLoginAt: new Date(),
      lastLoginIp: ip,
    });

    // 7. Sign session and set cookie
    const token = await signAuthToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });

    await setSessionCookie(token);

    return {
      success: true,
      message: `Welcome to Izhaan, ${newUser.name}! Your account has been created.`,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
      },
    };
  } catch (error: any) {
    console.error("Registration server action error:", error);
    return {
      success: false,
      message: "An unexpected error occurred while creating your account.",
    };
  }
}

/**
 * Server Action: User Logout
 */
export async function logoutAction(): Promise<{ success: boolean }> {
  try {
    await clearSessionCookie();
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false };
  }
}

/**
 * Server Action: Get currently logged in user profile (safe payload)
 */
export async function getCurrentUserAction(): Promise<{
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
  } | null;
}> {
  try {
    const session = await getSession();
    if (!session) return { user: null };

    await connectDB();
    const dbUser = await UserModel.findById(session.userId);

    if (!dbUser || dbUser.isBanned) {
      await clearSessionCookie();
      return { user: null };
    }

    return {
      user: {
        id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        phone: dbUser.phone,
      },
    };
  } catch (error) {
    console.error("getCurrentUserAction error:", error);
    return { user: null };
  }
}
