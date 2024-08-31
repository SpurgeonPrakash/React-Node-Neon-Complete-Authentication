import { NextFunction, Request, Response } from "express";
import CustomError from "../utils/CustomError.js";
import { v4 as uuidv4 } from "uuid";
import {
  createUserValidator,
  forgetPasswordValidator,
  signinUserValidator,
} from "../utils/validators/user/user.js";
import { pool } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_NAME,
  FACEBOOK_APP_ID,
  FACEBOOK_REDIRECT_URI,
  GITHUB_CLIENT_ID,
  JWT_ACCOUNT_ACTIVATION,
  LINKEDIN_CLIENT_ID,
  LINKEDIN_REDIRECT_URI,
  REFRESH_TOKEN_EXPIRY,
  NODE_ENV,
  REFRESH_TOKEN_NAME,
  REFRESH_TOKEN_SECRET,
  FRONTEND_BASE_URL,
  FACEBOOK_APP_SECRET,
  GITHUB_CLIENT_SECRET,
  GITHUB_REDIRECT_URL,
  LINKEDIN_CLIENT_SECRET,
  FORGET_PASSWORD_SECRET,
} from "../config/index.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateAccessToken, generateRefreshToken } from "../utils/auth.js";
import { getGooleOauthURL } from "../utils/oauth/google/getGoogleOAuthURL.js";
import { getFacebookOauthURL } from "../utils/oauth/facebook/getFacebookOAuthURL.js";
import { getGithubOauthURL } from "../utils/oauth/github/getGitHubOauthURL.js";
import { getLinkedinOauthURL } from "../utils/oauth/linkedin/getLinkedinOAuthURL.js";
import { getGoogleUser } from "../utils/oauth/google/getGoogleUser.js";
import axios from "axios";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstname, lastname, email, password } = req.body;

  const client = await pool.connect();

  try {
    const { errors, valid } = createUserValidator(
      firstname,
      lastname,
      email,
      password
    );

    if (!valid) {
      throw new CustomError(errors[Object.keys(errors)[0]], 400);
    }

    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];

    const result = await client.query(query, values);

    if (result.rows.length > 0 && result.rows[0].isverified) {
      throw new CustomError("User already exists", 409);
    }

    const existingUser = result.rows[0];

    let savedUser;
    const hashedPassword = await bcrypt.hash(password, 12);

    if (!existingUser) {
      const createNewUserQuery = `
        INSERT INTO users 
          (email, password, firstname, lastname, loginplatform, isverified)
        VALUES 
          ($1, $2, $3, $4, $5, FALSE)
        RETURNING id, email, firstname, lastname, loginplatform, isverified, created_at
      `;

      const createNewUserValues = [
        email,
        hashedPassword,
        firstname,
        lastname,
        "native",
      ];

      const createUserResult = await client.query(
        createNewUserQuery,
        createNewUserValues
      );

      savedUser = createUserResult.rows[0];
    } else {
      const updateUserIfExistsQuery = `
      UPDATE users
      SET 
        password = $1, firstname = $2, lastname = $3, loginplatform = $4
      WHERE email = $5
      RETURNING id, email, firstname, lastname, loginplatform, isverified, created_at
      `;

      const updateUserIfExistsValues = [
        hashedPassword,
        firstname,
        lastname,
        "native",
        email,
      ];

      const updateUserResult = await client.query(
        updateUserIfExistsQuery,
        updateUserIfExistsValues
      );

      savedUser = updateUserResult.rows[0];
    }

    const payload = savedUser;

    const token = jwt.sign(payload, JWT_ACCOUNT_ACTIVATION, {
      expiresIn: "10m",
    });

    const to = email;
    const subject = "Account Activation Link";
    const html = `
                <h1>Please use the following link to activate your account</h1>
                <p>Click <a href=${FRONTEND_BASE_URL}/activate-account/${token}>here</a></p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>${FRONTEND_BASE_URL}</p>
            `;
    await sendEmail(to, subject, html);

    //    console.log("ACCOUNT ACTIVATION TOKEN");
    //    console.log(token);

    res.status(201).json({
      message:
        "Please verify your account using a verification email that has been sent to your email.",
    });
  } catch (error) {
    //    console.log(error);

    return next(error);
  } finally {
    client.release();
  }
};

export const verifyAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const client = await pool.connect();
  try {
    const { token } = req.body;
    if (!token) {
      throw new CustomError("Unathorized", 401);
    }
    let verified;
    try {
      verified = jwt.verify(token, JWT_ACCOUNT_ACTIVATION);
    } catch (error) {
      console.log(error);

      throw new CustomError("Token Expired", 401);
    }

    if (verified) {
      const { id } = verified;

      const query = "SELECT * FROM users WHERE id = $1";
      const values = [id];
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new CustomError("Unauthorized", 401);
      }

      const updateQuery = `
        Update users 
        SET 
          isverified = $1
        WHERE id = $2
        RETURNING 
          id, email, firstname, lastname, loginplatform, isverified, created_at
      `;
      const updateValues = [true, id];
      await client.query(updateQuery, updateValues);

      return res.status(201).json({
        message: "Your account is verified successfully. Please Sign In",
      });
    } else {
      throw new CustomError("Expired link. Signup again", 500);
    }
  } catch (error) {
    //    console.log(error);

    return next(error);
  } finally {
    client.release();
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const LOGIN_PLATFORM = "native";
  const client = await pool.connect();
  try {
    const { email, password } = req.body;
    const { errors, valid } = signinUserValidator(email, password);

    if (!valid) {
      throw new CustomError(errors[Object.keys(errors)[0]], 400);
    }

    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];

    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      throw new CustomError("User Not Found", 409);
    }

    const existingUser = result.rows[0];

    if (!existingUser.isverified) {
      throw new CustomError("User Not Found", 404);
    }

    if (existingUser.loginplatform !== LOGIN_PLATFORM) {
      throw new CustomError(
        "Try login with " + existingUser.loginplatform,
        409
      );
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      throw new CustomError("email or password invalid", 400);
    }

    const accessToken = generateAccessToken(existingUser.id);
    const refreshToken = generateRefreshToken(existingUser.id);

    const issuedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY).toISOString();
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const isMobile = /mobile/i.test(userAgent);
    const isTablet = /tablet/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;
    const osMatch = userAgent.match(/\(([^)]+)\)/);
    const osInfo = osMatch ? osMatch[1] : "Unknown OS";
    const browserMatch = userAgent.match(
      /(Firefox|Chrome|Safari|Opera|Edge|MSIE|Trident)\/?\s*(\d+)/
    );
    const browserInfo = browserMatch
      ? `${browserMatch[1]} ${browserMatch[2]}`
      : "Unknown Browser";

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

    const authObj = {
      refresh_token: hashedRefreshToken,
      kyc: {
        issued_at: issuedAt,
        expires_at: expiresAt,
        ip_address: ipAddress,
        user_agent: userAgent,
        is_mobile: isMobile,
        is_tablet: isTablet,
        is_desktop: isDesktop,
        os_info: osInfo,
        browser_info: browserInfo,
      },
    };

    const authQuery = `
      UPDATE users
      SET auth = COALESCE(auth, ARRAY[]::jsonb[]) || ARRAY[$1]::jsonb[]
      WHERE email = $2
      RETURNING 
          id, email, firstname, lastname, loginplatform, isverified, created_at
    `;

    const authValues = [JSON.stringify(authObj), email];

    const userData = await client.query(authQuery, authValues);

    const options1: {
      expires: Date;
      httpOnly: boolean;
      secure?: boolean;
      path: string;
      sameSite: boolean | "strict" | "lax" | "none";
      maxAge: number;
    } = {
      expires: new Date(Date.now() + ACCESS_TOKEN_EXPIRY),
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_EXPIRY,
    };

    const options2: {
      expires: Date;
      httpOnly: boolean;
      secure?: boolean;
      path: string;
      sameSite: boolean | "strict" | "lax" | "none";
      maxAge: number;
    } = {
      expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRY,
    };

    if (NODE_ENV === "production") {
      options1.secure = true;
      options2.secure = true;
    }

    //    console.log("Access_Token");
    //    console.log("-------------------------------------");
    //    console.log(accessToken);
    //    console.log("-------------------------------------");
    //    console.log("Refresh_Token");
    //    console.log("-------------------------------------");
    //    console.log(refreshToken);
    //    console.log("-------------------------------------");

    res
      .status(200)
      .cookie(ACCESS_TOKEN_NAME, accessToken, options1)
      .cookie(REFRESH_TOKEN_NAME, refreshToken, options2)
      .json({
        success: true,
        message: "Logged In Successfully",
        user: userData.rows[0],
      });
  } catch (error) {
    return next(error);
  } finally {
    client.release();
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const client = await pool.connect();
  try {
    // //    console.log(req.cookies);

    const refresh_token = req.cookies[REFRESH_TOKEN_NAME];
    if (!refresh_token) {
      throw new CustomError("No Token Found", 401);
    }

    const verified = jwt.verify(refresh_token, REFRESH_TOKEN_SECRET);

    let existingUser;
    let existingUserId;
    if (verified) {
      const existingUserQuery = `
        SELECT *
        FROM users
        WHERE id = $1
      `;

      // const existingUserQuery = `
      // SELECT *
      // FROM users
      // WHERE EXISTS (
      //   SELECT 1
      //   FROM unnest(auth) AS auth_obj
      //   WHERE auth_obj->>'refresh_token' = $1
      // )
      // `;
      const existingUserValues = [verified.id];
      const existingUserResult = await client.query(
        existingUserQuery,
        existingUserValues
      );
      existingUserId = existingUserResult.rows[0].id;
      existingUser = existingUserResult.rows[0].auth.filter(async (d) => {
        const isMatch = await bcrypt.compare(refresh_token, d.refresh_token);
        return isMatch;
      })[0];

      // //    console.log("existingUser", existingUser);

      if (!existingUser) {
        throw new CustomError("You are not allowed here", 401);
      }
    } else {
      throw new CustomError("You are not Authenticated", 401);
    }

    const options: {
      expires: Date;
      httpOnly: boolean;
      secure?: boolean;
      path: string;
      sameSite: boolean | "strict" | "lax" | "none";
      maxAge: number;
    } = {
      expires: new Date(Date.now() + ACCESS_TOKEN_EXPIRY),
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_EXPIRY,
    };

    if (NODE_ENV === "production") {
      options.secure = true;
    }

    const accessToken = generateAccessToken(existingUserId);
    // //    console.log("Final Ccess Token: ", accessToken);

    res
      .status(200)
      .cookie(ACCESS_TOKEN_NAME, accessToken, options)
      .cookie(REFRESH_TOKEN_NAME, refresh_token, options)
      .json({
        success: true,
        message: "Refreshed The Access Token",
      });
  } catch (error) {
    //    console.log(error);

    return next(error);
  } finally {
    client.release();
  }
};

export const logOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const client = await pool.connect();
  try {
    const access_token = req.cookies[ACCESS_TOKEN_NAME];
    const refresh_token = req.cookies[REFRESH_TOKEN_NAME];
    if (access_token && refresh_token) {
      let verified;
      try {
        verified = jwt.verify(refresh_token, REFRESH_TOKEN_SECRET);
      } catch (error) {
        console.log(verified);
        console.log(error);
        const decoded = jwt.decode(refresh_token);

        //    console.log(decoded);

        const query = `
          SELECT *
          FROM users
          WHERE id = $1
        `;
        const value = [decoded.id];

        const result = await client.query(query, value);

        const newAuthArray = [];
        const authValue = result.rows[0].auth;

        for (let i = 0; i < authValue.length; i++) {
          const isValid = await bcrypt.compare(
            refresh_token,
            authValue[i].refresh_token
          );
          if (!isValid) {
            newAuthArray.push(authValue[i]);
          }
        }

        const updateQuery = `
        UPDATE users
          SET auth = $1::jsonb[]
          WHERE id = $2
          `;

        const updateValues = [newAuthArray, decoded.id];

        await client.query(updateQuery, updateValues);
        // if (error instanceof TokenExpiredError) {
        //    console.log(error.message);
        //    console.log("Refresh token expired");

        res.cookie(ACCESS_TOKEN_NAME, "none", {
          expires: new Date(Date.now() - 1000),
          httpOnly: true,
        });

        res.cookie(REFRESH_TOKEN_NAME, "none", {
          expires: new Date(Date.now() - 1000),
          httpOnly: true,
        });

        return res.json({
          message: "Logged Out Successfully",
        });
      }

      // Continue with logout process if token is still valid

      const decoded = jwt.decode(refresh_token);

      //    console.log("decoeded", decoded);

      const query = `
          SELECT *
          FROM users
          WHERE id = $1
        `;
      const value = [decoded.id];

      const result = await client.query(query, value);

      // //    console.log("result ----> ", result);

      const authValue = result.rows[0].auth;

      const finalAuthArray = [];

      for (let i = 0; i < authValue.length; i++) {
        const isValid = await bcrypt.compare(
          refresh_token,
          authValue[i].refresh_token
        );
        if (!isValid) {
          finalAuthArray.push(authValue[i]);
        }
      }

      const updateQuery = `
        UPDATE users
          SET auth = $1::jsonb[]
          WHERE id = $2
          `;

      const updateValues = [finalAuthArray, decoded.id];

      await client.query(updateQuery, updateValues);

      res.cookie(ACCESS_TOKEN_NAME, "none", {
        expires: new Date(Date.now() - 1000),
        httpOnly: true,
      });

      res.cookie(REFRESH_TOKEN_NAME, "none", {
        expires: new Date(Date.now() - 1000),
        httpOnly: true,
      });

      return res.json({
        message: "Logged Out Successfully",
      });
    }

    res.cookie(ACCESS_TOKEN_NAME, "none", {
      expires: new Date(Date.now() - 1000),
      httpOnly: true,
    });

    res.cookie(REFRESH_TOKEN_NAME, "none", {
      expires: new Date(Date.now() - 1000),
      httpOnly: true,
    });

    return res.json({
      message: "Logged Out Successfully",
    });
  } catch (error) {
    //    console.log(error);
    return next(error);
  } finally {
    client.release();
  }
};

interface RequestWithPayload extends Request {
  id: string;
}

export const me = async (
  req: RequestWithPayload,
  res: Response,
  next: NextFunction
) => {
  //    console.log("req.id", req.id);

  const client = await pool.connect();
  try {
    const query = `SELECT 
                    id, email, firstname, lastname, isverified, loginplatform, created_at 
                  FROM users 
                  WHERE id = $1
                `;
    const values = [req.id];

    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      throw new CustomError("Unauthorized", 401);
    }

    res.status(200).json({
      ...result.rows[0],
    });
  } catch (error) {
    //    console.log(error);

    return next(error);
  } finally {
    client.release();
  }
};

export const googleRedirect = async (req: Request, res: Response) => {
  const url = getGooleOauthURL();
  return res.redirect(url);
};

export const facebookRedirect = async (req: Request, res: Response) => {
  const url = getFacebookOauthURL({
    appID: FACEBOOK_APP_ID,
    appRedirectURI: FACEBOOK_REDIRECT_URI,
  });
  return res.redirect(url);
};

export const githubRedirect = async (req: Request, res: Response) => {
  const url = getGithubOauthURL({
    appID: GITHUB_CLIENT_ID,
  });
  return res.redirect(url);
};

export const linkedinRedirect = async (req: Request, res: Response) => {
  const url = getLinkedinOauthURL({
    clientId: LINKEDIN_CLIENT_ID,
    appRedirectURI: LINKEDIN_REDIRECT_URI,
  });
  return res.redirect(url);
};

export const googleLogin = async (req: Request, res: Response) => {
  const LOGIN_PLATFORM = "google";
  const { code, error } = req.query;
  const client = await pool.connect();
  try {
    if (error) {
      throw new CustomError("Login With Google Failed", 404);
    }

    if (!code || typeof code !== "string") {
      throw new CustomError("You are not Authenticated using google", 404);
    }

    const userInfo = await getGoogleUser({ code });

    const {
      verified_email,
      email,
      given_name,
      family_name,
      id: public_id,
    } = userInfo;

    if (!verified_email) {
      throw new CustomError(
        "Your google account is not yet verified through google"
      );
    }

    if (!given_name || !family_name || !email || !public_id) {
      throw new CustomError("Error getting google user info", 404);
    }

    const query = `SELECT 
                      id, 
                      firstname, 
                      lastname, 
                      email, 
                      loginplatform, 
                      isverified, 
                      created_at
                    FROM users
                    WHERE email = $1
                  `;
    const values = [email];
    const result = await client.query(query, values);

    const existingUser = result.rows[0];

    if (existingUser) {
      const loginPlatformString =
        existingUser.loginplatform === "native"
          ? "email and password login"
          : existingUser.loginplatform + " login";

      if (
        existingUser.loginplatform === "native" &&
        existingUser.isverified === true
      ) {
        throw new CustomError("Try Login with: " + loginPlatformString, 409);
      } else if (
        existingUser.loginplatform !== LOGIN_PLATFORM &&
        existingUser.loginplatform !== "native"
      ) {
        throw new CustomError("Try Login with: " + loginPlatformString, 409);
      }
    }
    const password = email + uuidv4();

    let savedUser;
    if (existingUser) {
      const updateUserQuery = `
      UPDATE users
      SET 
        password = $1, firstname = $2, lastname = $3, loginplatform = $4, isverified = $5
      WHERE email = $6
      RETURNING id, email, firstname, lastname, loginplatform, isverified, created_at
      `;
      const updateUserValues = [
        password,
        given_name,
        family_name,
        LOGIN_PLATFORM,
        true,
        email,
      ];

      const updateUserResult = await client.query(
        updateUserQuery,
        updateUserValues
      );

      savedUser = updateUserResult.rows[0];
    } else {
      const createNewUserQuery = `
        INSERT INTO users 
          (email, password, firstname, lastname, loginplatform, isverified)
        VALUES 
          ($1, $2, $3, $4, $5, TRUE)
        RETURNING id, email, firstname, lastname, loginplatform, isverified, created_at
      `;

      const createNewUserValues = [
        email,
        password,
        given_name,
        family_name,
        LOGIN_PLATFORM,
      ];

      const createNewUserResult = await client.query(
        createNewUserQuery,
        createNewUserValues
      );

      savedUser = createNewUserResult.rows[0];
    }

    //    console.log(savedUser);

    const accessToken = generateAccessToken(savedUser.id);
    const refreshToken = generateRefreshToken(savedUser.id);

    const issuedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY).toISOString();
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const isMobile = /mobile/i.test(userAgent);
    const isTablet = /tablet/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;
    const osMatch = userAgent.match(/\(([^)]+)\)/);
    const osInfo = osMatch ? osMatch[1] : "Unknown OS";
    const browserMatch = userAgent.match(
      /(Firefox|Chrome|Safari|Opera|Edge|MSIE|Trident)\/?\s*(\d+)/
    );
    const browserInfo = browserMatch
      ? `${browserMatch[1]} ${browserMatch[2]}`
      : "Unknown Browser";

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

    const authObj = {
      refresh_token: hashedRefreshToken,
      kyc: {
        issued_at: issuedAt,
        expires_at: expiresAt,
        ip_address: ipAddress,
        user_agent: userAgent,
        is_mobile: isMobile,
        is_tablet: isTablet,
        is_desktop: isDesktop,
        os_info: osInfo,
        browser_info: browserInfo,
      },
    };

    const authQuery = `
      UPDATE users
      SET auth = COALESCE(auth, ARRAY[]::jsonb[]) || ARRAY[$1]::jsonb[]
      WHERE email = $2
      RETURNING 
          id, email, firstname, lastname, loginplatform, isverified, created_at
    `;

    const authValues = [JSON.stringify(authObj), email];

    await client.query(authQuery, authValues);

    const options1: {
      expires: Date;
      httpOnly: boolean;
      secure?: boolean;
      path: string;
      sameSite: boolean | "strict" | "lax" | "none";
      maxAge: number;
    } = {
      expires: new Date(Date.now() + ACCESS_TOKEN_EXPIRY),
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_EXPIRY,
    };

    const options2: {
      expires: Date;
      httpOnly: boolean;
      secure?: boolean;
      path: string;
      sameSite: boolean | "strict" | "lax" | "none";
      maxAge: number;
    } = {
      expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRY,
    };

    if (NODE_ENV === "production") {
      options1.secure = true;
      options2.secure = true;
    }

    res
      .status(200)
      .cookie(ACCESS_TOKEN_NAME, accessToken, options1)
      .cookie(REFRESH_TOKEN_NAME, refreshToken, options2)
      .redirect(FRONTEND_BASE_URL);
  } catch (error) {
    //    console.log(error);
    return res.redirect(
      `${FRONTEND_BASE_URL}/success-or-error?type=danger&message=${error.message}`
    );
  } finally {
    client.release();
  }
};
export const facebookLogin = async (req: Request, res: Response) => {
  const LOGIN_PLATFORM = "facebook";
  const { code, error } = req.query;
  const client = await pool.connect();
  try {
    if (error) {
      throw new CustomError("Login With Google Failed", 404);
    }

    if (!code || typeof code !== "string") {
      throw new CustomError("You are not Authenticated using facebook", 404);
    }

    const { data } = await axios.get(
      `https://graph.facebook.com/v20.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&redirect_uri=${FACEBOOK_REDIRECT_URI}&client_secret=${FACEBOOK_APP_SECRET}&code=${code}&scope=email`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const { access_token } = data;

    if (!access_token) {
      throw new CustomError("No access_token recieved", 400);
    }

    const { data: userData } = await axios.get(
      `https://graph.facebook.com/v20.0/me?access_token=${access_token}&fields=id,name,first_name,last_name,email,picture`
    );

    const { email, first_name, last_name, id: public_id } = userData;

    if (!first_name || !last_name || !email || !public_id) {
      throw new CustomError("Error getting facebook user info", 404);
    }

    const query = `SELECT
                      id,
                      firstname,
                      lastname,
                      email,
                      loginplatform,
                      isverified,
                      created_at
                    FROM users
                    WHERE email = $1
                  `;
    const values = [email];
    const result = await client.query(query, values);

    const existingUser = result.rows[0];

    if (existingUser) {
      const loginPlatformString =
        existingUser.loginplatform === "native"
          ? "email and password login"
          : existingUser.loginplatform + " login";

      if (
        existingUser.loginplatform === "native" &&
        existingUser.isverified === true
      ) {
        throw new CustomError("Try Login with: " + loginPlatformString, 409);
      } else if (
        existingUser.loginplatform !== LOGIN_PLATFORM &&
        existingUser.loginplatform !== "native"
      ) {
        throw new CustomError("Try Login with: " + loginPlatformString, 409);
      }
    }
    const password = email + uuidv4();

    let savedUser;
    if (existingUser) {
      const updateUserQuery = `
      UPDATE users
      SET
        password = $1, firstname = $2, lastname = $3, loginplatform = $4, isverified = $5
      WHERE email = $6
      RETURNING id, email, firstname, lastname, loginplatform, isverified, created_at
      `;
      const updateUserValues = [
        password,
        first_name,
        last_name,
        LOGIN_PLATFORM,
        true,
        email,
      ];

      const updateUserResult = await client.query(
        updateUserQuery,
        updateUserValues
      );

      savedUser = updateUserResult.rows[0];
    } else {
      const createNewUserQuery = `
        INSERT INTO users
          (email, password, firstname, lastname, loginplatform, isverified)
        VALUES
          ($1, $2, $3, $4, $5, TRUE)
        RETURNING id, email, firstname, lastname, loginplatform, isverified, created_at
      `;

      const createNewUserValues = [
        email,
        password,
        first_name,
        last_name,
        LOGIN_PLATFORM,
      ];

      const createNewUserResult = await client.query(
        createNewUserQuery,
        createNewUserValues
      );

      savedUser = createNewUserResult.rows[0];
    }

    //    console.log(savedUser);

    const accessToken = generateAccessToken(savedUser.id);
    const refreshToken = generateRefreshToken(savedUser.id);

    const issuedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY).toISOString();
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const isMobile = /mobile/i.test(userAgent);
    const isTablet = /tablet/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;
    const osMatch = userAgent.match(/\(([^)]+)\)/);
    const osInfo = osMatch ? osMatch[1] : "Unknown OS";
    const browserMatch = userAgent.match(
      /(Firefox|Chrome|Safari|Opera|Edge|MSIE|Trident)\/?\s*(\d+)/
    );
    const browserInfo = browserMatch
      ? `${browserMatch[1]} ${browserMatch[2]}`
      : "Unknown Browser";

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

    const authObj = {
      refresh_token: hashedRefreshToken,
      kyc: {
        issued_at: issuedAt,
        expires_at: expiresAt,
        ip_address: ipAddress,
        user_agent: userAgent,
        is_mobile: isMobile,
        is_tablet: isTablet,
        is_desktop: isDesktop,
        os_info: osInfo,
        browser_info: browserInfo,
      },
    };

    const authQuery = `
      UPDATE users
      SET auth = COALESCE(auth, ARRAY[]::jsonb[]) || ARRAY[$1]::jsonb[]
      WHERE email = $2
      RETURNING
          id, email, firstname, lastname, loginplatform, isverified, created_at
    `;

    const authValues = [JSON.stringify(authObj), email];

    await client.query(authQuery, authValues);

    const options1: {
      expires: Date;
      httpOnly: boolean;
      secure?: boolean;
      path: string;
      sameSite: boolean | "strict" | "lax" | "none";
      maxAge: number;
    } = {
      expires: new Date(Date.now() + ACCESS_TOKEN_EXPIRY),
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_EXPIRY,
    };

    const options2: {
      expires: Date;
      httpOnly: boolean;
      secure?: boolean;
      path: string;
      sameSite: boolean | "strict" | "lax" | "none";
      maxAge: number;
    } = {
      expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRY,
    };

    if (NODE_ENV === "production") {
      options1.secure = true;
      options2.secure = true;
    }

    res
      .status(200)
      .cookie(ACCESS_TOKEN_NAME, accessToken, options1)
      .cookie(REFRESH_TOKEN_NAME, refreshToken, options2)
      .redirect(FRONTEND_BASE_URL);
  } catch (error) {
    //    console.log(error);
    return res.redirect(
      `${FRONTEND_BASE_URL}/success-or-error?type=danger&message=${error.message}`
    );
  } finally {
    client.release();
  }
};
export const githubLogin = async (req: Request, res: Response) => {
  const LOGIN_PLATFORM = "github";
  const { code, error } = req.query;
  const client = await pool.connect();
  try {
    if (error) {
      throw new CustomError("Login With github Failed", 404);
    }

    if (!code || typeof code !== "string") {
      throw new CustomError("You are not Authenticated using github", 404);
    }

    const { data: accessTokenData } = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
        redirect_uri: GITHUB_REDIRECT_URL,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const { access_token } = accessTokenData;

    if (!access_token) {
      throw new CustomError(accessTokenData.error_description, 400);
    }

    const { data } = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });

    const { email, name, id: public_id } = data;

    const nameArray = name.split(" ");
    const firstname = nameArray.slice(0, nameArray.length - 1).join(" ");
    const lastname = nameArray.slice(nameArray.length - 1).join(" ");

    if (!firstname || !lastname || !email || !public_id) {
      throw new CustomError("Error getting github user info", 404);
    }

    const query = `SELECT
                      id,
                      firstname,
                      lastname,
                      email,
                      loginplatform,
                      isverified,
                      created_at
                    FROM users
                    WHERE email = $1
                  `;
    const values = [email];
    const result = await client.query(query, values);

    const existingUser = result.rows[0];

    if (existingUser) {
      const loginPlatformString =
        existingUser.loginplatform === "native"
          ? "email and password login"
          : existingUser.loginplatform + " login";

      if (
        existingUser.loginplatform === "native" &&
        existingUser.isverified === true
      ) {
        throw new CustomError("Try Login with: " + loginPlatformString, 409);
      } else if (
        existingUser.loginplatform !== LOGIN_PLATFORM &&
        existingUser.loginplatform !== "native"
      ) {
        throw new CustomError("Try Login with: " + loginPlatformString, 409);
      }
    }
    const password = email + uuidv4();

    let savedUser;
    if (existingUser) {
      const updateUserQuery = `
      UPDATE users
      SET
        password = $1, firstname = $2, lastname = $3, loginplatform = $4, isverified = $5
      WHERE email = $6
      RETURNING id, email, firstname, lastname, loginplatform, isverified, created_at
      `;
      const updateUserValues = [
        password,
        firstname,
        lastname,
        LOGIN_PLATFORM,
        true,
        email,
      ];

      const updateUserResult = await client.query(
        updateUserQuery,
        updateUserValues
      );

      savedUser = updateUserResult.rows[0];
    } else {
      const createNewUserQuery = `
        INSERT INTO users
          (email, password, firstname, lastname, loginplatform, isverified)
        VALUES
          ($1, $2, $3, $4, $5, TRUE)
        RETURNING id, email, firstname, lastname, loginplatform, isverified, created_at
      `;

      const createNewUserValues = [
        email,
        password,
        firstname,
        lastname,
        LOGIN_PLATFORM,
      ];

      const createNewUserResult = await client.query(
        createNewUserQuery,
        createNewUserValues
      );

      savedUser = createNewUserResult.rows[0];
    }

    const accessToken = generateAccessToken(savedUser.id);
    const refreshToken = generateRefreshToken(savedUser.id);

    const issuedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY).toISOString();
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const isMobile = /mobile/i.test(userAgent);
    const isTablet = /tablet/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;
    const osMatch = userAgent.match(/\(([^)]+)\)/);
    const osInfo = osMatch ? osMatch[1] : "Unknown OS";
    const browserMatch = userAgent.match(
      /(Firefox|Chrome|Safari|Opera|Edge|MSIE|Trident)\/?\s*(\d+)/
    );
    const browserInfo = browserMatch
      ? `${browserMatch[1]} ${browserMatch[2]}`
      : "Unknown Browser";

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

    const authObj = {
      refresh_token: hashedRefreshToken,
      kyc: {
        issued_at: issuedAt,
        expires_at: expiresAt,
        ip_address: ipAddress,
        user_agent: userAgent,
        is_mobile: isMobile,
        is_tablet: isTablet,
        is_desktop: isDesktop,
        os_info: osInfo,
        browser_info: browserInfo,
      },
    };

    const authQuery = `
      UPDATE users
      SET auth = COALESCE(auth, ARRAY[]::jsonb[]) || ARRAY[$1]::jsonb[]
      WHERE email = $2
      RETURNING
          id, email, firstname, lastname, loginplatform, isverified, created_at
    `;

    const authValues = [JSON.stringify(authObj), email];

    await client.query(authQuery, authValues);

    const options1: {
      expires: Date;
      httpOnly: boolean;
      secure?: boolean;
      path: string;
      sameSite: boolean | "strict" | "lax" | "none";
      maxAge: number;
    } = {
      expires: new Date(Date.now() + ACCESS_TOKEN_EXPIRY),
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_EXPIRY,
    };

    const options2: {
      expires: Date;
      httpOnly: boolean;
      secure?: boolean;
      path: string;
      sameSite: boolean | "strict" | "lax" | "none";
      maxAge: number;
    } = {
      expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRY,
    };

    if (NODE_ENV === "production") {
      options1.secure = true;
      options2.secure = true;
    }

    res
      .status(200)
      .cookie(ACCESS_TOKEN_NAME, accessToken, options1)
      .cookie(REFRESH_TOKEN_NAME, refreshToken, options2)
      .redirect(FRONTEND_BASE_URL);
  } catch (error) {
    //    console.log(error);
    return res.redirect(
      `${FRONTEND_BASE_URL}/success-or-error?type=danger&message=${error.message}`
    );
  } finally {
    client.release();
  }
};
export const linkedinLogin = async (req: Request, res: Response) => {
  const LOGIN_PLATFORM = "linkedin";
  const { code, error } = req.query;
  const client = await pool.connect();
  try {
    if (error) {
      throw new CustomError("Login With Google Failed", 404);
    }

    if (!code || typeof code !== "string") {
      throw new CustomError("You are not Authenticated using google", 404);
    }

    const { data: accessTokenData } = await axios.get(
      `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&redirect_uri=${LINKEDIN_REDIRECT_URI}&client_id=${LINKEDIN_CLIENT_ID}&client_secret=${LINKEDIN_CLIENT_SECRET}&code=${code}`
    );

    const { access_token } = accessTokenData;

    const { data: userInfo } = await axios.get(
      `https://api.linkedin.com/v2/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: `application/json`,
        },
      }
    );

    const {
      email_verified,
      email,
      given_name,
      family_name,
      sub: public_id,
    } = userInfo;

    if (!email_verified) {
      throw new CustomError(
        "Your linkedin account is not yet verified through linkedin"
      );
    }

    if (!given_name || !family_name || !email || !public_id) {
      throw new CustomError("Error getting linkedin user info", 404);
    }

    const query = `SELECT
                      id,
                      firstname,
                      lastname,
                      email,
                      loginplatform,
                      isverified,
                      created_at
                    FROM users
                    WHERE email = $1
                  `;
    const values = [email];
    const result = await client.query(query, values);

    const existingUser = result.rows[0];

    if (existingUser) {
      console.log(existingUser);

      const loginPlatformString =
        existingUser.loginplatform === "native"
          ? "email and password login"
          : existingUser.loginplatform + " login";

      if (
        existingUser.loginplatform === "native" &&
        existingUser.isverified === true
      ) {
        throw new CustomError("Try Login with: " + loginPlatformString, 409);
      } else if (
        existingUser.loginplatform !== LOGIN_PLATFORM &&
        existingUser.loginplatform !== "native"
      ) {
        throw new CustomError("Try Login with: " + loginPlatformString, 409);
      }
    }
    const password = email + uuidv4();

    let savedUser;
    if (existingUser) {
      const updateUserQuery = `
      UPDATE users
      SET
        password = $1, firstname = $2, lastname = $3, loginplatform = $4, isverified = $5
      WHERE email = $6
      RETURNING id, email, firstname, lastname, loginplatform, isverified, created_at
      `;
      const updateUserValues = [
        password,
        given_name,
        family_name,
        LOGIN_PLATFORM,
        true,
        email,
      ];

      const updateUserResult = await client.query(
        updateUserQuery,
        updateUserValues
      );

      savedUser = updateUserResult.rows[0];
    } else {
      const createNewUserQuery = `
        INSERT INTO users
          (email, password, firstname, lastname, loginplatform, isverified)
        VALUES
          ($1, $2, $3, $4, $5, TRUE)
        RETURNING id, email, firstname, lastname, loginplatform, isverified, created_at
      `;

      const createNewUserValues = [
        email,
        password,
        given_name,
        family_name,
        LOGIN_PLATFORM,
      ];

      const createNewUserResult = await client.query(
        createNewUserQuery,
        createNewUserValues
      );

      savedUser = createNewUserResult.rows[0];
    }

    const accessToken = generateAccessToken(savedUser.id);
    const refreshToken = generateRefreshToken(savedUser.id);

    const issuedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY).toISOString();
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const isMobile = /mobile/i.test(userAgent);
    const isTablet = /tablet/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;
    const osMatch = userAgent.match(/\(([^)]+)\)/);
    const osInfo = osMatch ? osMatch[1] : "Unknown OS";
    const browserMatch = userAgent.match(
      /(Firefox|Chrome|Safari|Opera|Edge|MSIE|Trident)\/?\s*(\d+)/
    );
    const browserInfo = browserMatch
      ? `${browserMatch[1]} ${browserMatch[2]}`
      : "Unknown Browser";

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

    const authObj = {
      refresh_token: hashedRefreshToken,
      kyc: {
        issued_at: issuedAt,
        expires_at: expiresAt,
        ip_address: ipAddress,
        user_agent: userAgent,
        is_mobile: isMobile,
        is_tablet: isTablet,
        is_desktop: isDesktop,
        os_info: osInfo,
        browser_info: browserInfo,
      },
    };

    const authQuery = `
      UPDATE users
      SET auth = COALESCE(auth, ARRAY[]::jsonb[]) || ARRAY[$1]::jsonb[]
      WHERE email = $2
      RETURNING
          id, email, firstname, lastname, loginplatform, isverified, created_at
    `;

    const authValues = [JSON.stringify(authObj), email];

    await client.query(authQuery, authValues);

    const options1: {
      expires: Date;
      httpOnly: boolean;
      secure?: boolean;
      path: string;
      sameSite: boolean | "strict" | "lax" | "none";
      maxAge: number;
    } = {
      expires: new Date(Date.now() + ACCESS_TOKEN_EXPIRY),
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_EXPIRY,
    };

    const options2: {
      expires: Date;
      httpOnly: boolean;
      secure?: boolean;
      path: string;
      sameSite: boolean | "strict" | "lax" | "none";
      maxAge: number;
    } = {
      expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRY,
    };

    if (NODE_ENV === "production") {
      options1.secure = true;
      options2.secure = true;
    }

    res
      .status(200)
      .cookie(ACCESS_TOKEN_NAME, accessToken, options1)
      .cookie(REFRESH_TOKEN_NAME, refreshToken, options2)
      .redirect(FRONTEND_BASE_URL);
  } catch (error) {
    //    console.log(error);
    return res.redirect(
      `${FRONTEND_BASE_URL}/success-or-error?type=danger&message=${error.message}`
    );
  } finally {
    client.release();
  }
};

export const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  const client = await pool.connect();
  try {
    const { errors, valid } = forgetPasswordValidator(email);

    if (!valid) {
      throw new CustomError(errors[Object.keys(errors)[0]], 400);
    }

    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];

    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      throw new CustomError("User Not Found", 409);
    }

    const existingUser = result.rows[0];

    if (!existingUser || !existingUser.isverified) {
      throw new CustomError(
        "If we find your account, We will send a Reset Password Link to your registered email. Please check your email.",
        404
      );
    }

    if (existingUser.loginplatform !== "native") {
      throw new CustomError(
        `Please try ${existingUser.loginplatform} login`,
        401
      );
    }

    const payload = { id: existingUser.id };
    if (!FORGET_PASSWORD_SECRET) {
      throw new CustomError("secret must be provided to verify token", 500);
    }

    const token = jwt.sign(payload, FORGET_PASSWORD_SECRET, {
      expiresIn: "10m",
    });

    const updateQuery = `UPDATE users
                         SET isresetpasswordused = $1
                         WHERE email = $2
                         RETURNING id, email, firstname, lastname   
                          `;
    const updateValues = [false, email];

    await client.query(updateQuery, updateValues);

    const to = email;
    const subject = "Reset Password Link";
    const html = `
                <h1>Please use the following link to reset your password</h1>
                <p>Click <a href=${FRONTEND_BASE_URL}/reset-password/${token}>here</a></p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>${FRONTEND_BASE_URL}</p>
            `;
    await sendEmail(to, subject, html);

    res.status(200).json({
      message:
        "If we find your account, We will send a Reset Password Link to your registered email. Please check your email.",
    });
  } catch (error) {
    //    console.log(error);

    return next(error);
  } finally {
    client.release();
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token, password } = req.body;

  const client = await pool.connect();
  try {
    if (!token || token.trim() === "") {
      throw new CustomError("Unauthorized", 401);
    }

    if (!FORGET_PASSWORD_SECRET) {
      throw new CustomError("secret must be provided to verify token", 500);
    }
    let verified;
    let userId;
    try {
      verified = jwt.verify(token, FORGET_PASSWORD_SECRET);
    } catch (error) {
      console.log(error.message);

      throw new CustomError("Unauthorized", 401);
    }

    if (verified) {
      userId = verified.id;
    } else {
      throw new CustomError("Invalid token or token expired", 401);
    }

    const query = `SELECT id, firstname, lastname, email, isverified, loginplatform FROM users WHERE id = $1`;

    const values = [userId];

    const result = await client.query(query, values);

    const existingUser = result.rows[0];

    if (existingUser.isresetpasswordused) {
      throw new CustomError("You Already Reset Your Password");
    }

    if (!existingUser || !existingUser.isverified) {
      throw new CustomError(`User not found`, 401);
    }

    if (existingUser.loginplatform !== "native") {
      throw new CustomError(
        `Please try ${existingUser.loginplatform} login`,
        401
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const updateQuery = `
      UPDATE users 
      SET password = $1 
      WHERE id = $2 
      RETURNING id, firstname, lastname, email
    `;
    const updateValues = [hashedPassword, existingUser.id];

    await client.query(updateQuery, updateValues);

    res.status(201).json({
      message: "Password Reset Successfull, Please Login",
    });
  } catch (error) {
    //    console.log(error);

    return next(error);
  } finally {
    client.release();
  }
};
