import axios from 'axios';
import useEnv from '@/composables/env/useEnv';
const { env } = useEnv();

axios.defaults.baseURL = env.SERVER_URL;
axios.defaults.withCredentials = true;
