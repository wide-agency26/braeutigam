import "server-only";
import { env } from "cloudflare:workers";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "../generated/d1/wasm.js";

export const prisma = new PrismaClient({ adapter: new PrismaD1(env.DB) });
export function databaseReady() { return Boolean(env.DB); }
