import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Obtener credenciales de Supabase desde variables de entorno
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validar que las credenciales estén configuradas
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not configured!');
  console.error('⚠️  Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file');
  console.error('');
  console.error('Example .env file:');
  console.error('  SUPABASE_URL=https://your-project.supabase.co');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  console.error('');
  console.error('See SUPABASE-SETUP.md for detailed instructions.');
  process.exit(1);
}

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('usuarios').select('count');
    if (error) throw error;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};
