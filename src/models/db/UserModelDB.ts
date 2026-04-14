import type { ServerDB } from "./ServerDB";

export interface UserModelDB {
    servers: ServerDB[];
}