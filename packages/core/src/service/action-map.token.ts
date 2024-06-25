import { InjectionToken } from "@angular/core";
import { ActionDef } from "../types";

export const V_TABLE_ACTION_MAP_TOKEN = new InjectionToken<
    Record<string, ActionDef<any>>
>("V_TABLE_ACTION_MAP_TOKEN");
