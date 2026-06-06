/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as cases from "../cases.js";
import type * as devSeed from "../devSeed.js";
import type * as generation from "../generation.js";
import type * as http from "../http.js";
import type * as intake from "../intake.js";
import type * as lib_adminAuth from "../lib/adminAuth.js";
import type * as lib_checkGenerator from "../lib/checkGenerator.js";
import type * as lib_devSeed from "../lib/devSeed.js";
import type * as lib_intakeAnswers from "../lib/intakeAnswers.js";
import type * as lib_livingGenerator from "../lib/livingGenerator.js";
import type * as lib_packageCatalog from "../lib/packageCatalog.js";
import type * as lib_reviewMode from "../lib/reviewMode.js";
import type * as lib_routeConfigs from "../lib/routeConfigs.js";
import type * as lib_routeKnowledge from "../lib/routeKnowledge.js";
import type * as lib_routeRiskScoring from "../lib/routeRiskScoring.js";
import type * as lib_sectionDependencies from "../lib/sectionDependencies.js";
import type * as lib_sectionTitles from "../lib/sectionTitles.js";
import type * as packages from "../packages.js";
import type * as paymentMutations from "../paymentMutations.js";
import type * as reports from "../reports.js";
import type * as routes from "../routes.js";
import type * as stripe from "../stripe.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  auth: typeof auth;
  cases: typeof cases;
  devSeed: typeof devSeed;
  generation: typeof generation;
  http: typeof http;
  intake: typeof intake;
  "lib/adminAuth": typeof lib_adminAuth;
  "lib/checkGenerator": typeof lib_checkGenerator;
  "lib/devSeed": typeof lib_devSeed;
  "lib/intakeAnswers": typeof lib_intakeAnswers;
  "lib/livingGenerator": typeof lib_livingGenerator;
  "lib/packageCatalog": typeof lib_packageCatalog;
  "lib/reviewMode": typeof lib_reviewMode;
  "lib/routeConfigs": typeof lib_routeConfigs;
  "lib/routeKnowledge": typeof lib_routeKnowledge;
  "lib/routeRiskScoring": typeof lib_routeRiskScoring;
  "lib/sectionDependencies": typeof lib_sectionDependencies;
  "lib/sectionTitles": typeof lib_sectionTitles;
  packages: typeof packages;
  paymentMutations: typeof paymentMutations;
  reports: typeof reports;
  routes: typeof routes;
  stripe: typeof stripe;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
