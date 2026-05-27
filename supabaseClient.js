import { createClient } from 'https://esm.sh/@supabase/supabase-js';

// 使用 Supabase 的匿名密钥
const supabaseUrl = 'https://你的项目ID.supabase.co';
const supabaseAnonKey = '你的匿名密钥';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
