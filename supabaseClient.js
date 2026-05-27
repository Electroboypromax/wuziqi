import { createClient } from 'https://esm.sh/@supabase/supabase-js';

// 使用 Supabase 的匿名密钥
const supabaseUrl = 'https://hninkgbdkcvhidxjqlva.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuaW5rZ2Jka2N2aGlkeGpxbHZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMDQxMDMsImV4cCI6MjA5MDc4MDEwM30.xmuuxA2whwXDNTR7NAfyNsMZ8KZDoTmACmuuaY35OxQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
