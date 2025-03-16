import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
// https://vite.dev/config/
export default defineConfig(function (_a) {
    var mode = _a.mode;
    // Carga las variables de entorno desde .env según el 'mode' (development o production)
    var env = loadEnv(mode, process.cwd(), '');
    return {
        server: {
            proxy: {
                "/api": env.VITE_BACKEND_URL
            }
        },
        plugins: [react()],
    };
});
