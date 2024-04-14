import type { DatabaseUser } from "./database";
import type { Mod } from "osu-web.js";
import type { Mode } from "./osu";

export const enum UserType {
    SUCCESS = "success",
    FAIL = "fail"
}

interface BaseUser {
    type: UserType;
    authorDb: DatabaseUser | null;
    playerDb?: DatabaseUser | null;
    beatmapId: string | null;
}

interface SuccessUser extends BaseUser {
    type: UserType.SUCCESS;
    banchoId: string;
    mode: Mode;
}

interface FailUser extends BaseUser {
    type: UserType.FAIL;
    failMessage: string;
}

export interface DifficultyOptions {
    combo?: number;
    acc?: number;
    clock_rate?: number;
    bpm?: number;
    n300?: number;
    n100?: number;
    n50?: number;
    nmisses?: number;
    ngeki?: number;
    nkatu?: number;
    ar?: number;
    od?: number;
    cs?: number;
}

export type User = SuccessUser | FailUser;

export interface SlashCommandArgs<T extends boolean> {
    user: User;
    mods: Mods;
    difficultySettings: T extends true ? Required<DifficultyOptions> : DifficultyOptions;
}

export interface Mods {
    include: boolean | null;
    exclude: boolean | null;
    forceInclude: boolean | null;
    name: Mod | null;
}

export interface PrefixCommandArgs {
    tempUser: Array<string> | null;
    user: User;
    flags: Record<string, string | undefined>;
    mods: Mods;
}
