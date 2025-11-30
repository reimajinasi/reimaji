/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as achievements from "../achievements.js";
import type * as bookmarks from "../bookmarks.js";
import type * as courses from "../courses.js";
import type * as lessons from "../lessons.js";
import type * as modules from "../modules.js";
import type * as news from "../news.js";
import type * as onboarding from "../onboarding.js";
import type * as permissions from "../permissions.js";
import type * as progress from "../progress.js";
import type * as quizzes from "../quizzes.js";
import type * as research from "../research.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  achievements: typeof achievements;
  bookmarks: typeof bookmarks;
  courses: typeof courses;
  lessons: typeof lessons;
  modules: typeof modules;
  news: typeof news;
  onboarding: typeof onboarding;
  permissions: typeof permissions;
  progress: typeof progress;
  quizzes: typeof quizzes;
  research: typeof research;
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
