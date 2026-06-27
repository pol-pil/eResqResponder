/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as alert from "../alert.js";
import type * as alertNode from "../alertNode.js";
import type * as alerts from "../alerts.js";
import type * as alertstats from "../alertstats.js";
import type * as firebaseAdmin from "../firebaseAdmin.js";
import type * as getLiveAlerts from "../getLiveAlerts.js";
import type * as getUsers from "../getUsers.js";
import type * as http from "../http.js";
import type * as sessions from "../sessions.js";
import type * as userTokens from "../userTokens.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  alert: typeof alert;
  alertNode: typeof alertNode;
  alerts: typeof alerts;
  alertstats: typeof alertstats;
  firebaseAdmin: typeof firebaseAdmin;
  getLiveAlerts: typeof getLiveAlerts;
  getUsers: typeof getUsers;
  http: typeof http;
  sessions: typeof sessions;
  userTokens: typeof userTokens;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
