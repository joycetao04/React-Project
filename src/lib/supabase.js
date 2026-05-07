import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ddeilxcppomcpjhijlvx.supabase.co";

const supabaseAnonKey = "sb_publishable_wRE2dABMEtrCGxIUj5IPjQ_nrDRZmah";

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
);