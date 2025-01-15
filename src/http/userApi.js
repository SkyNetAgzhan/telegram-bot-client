import { $authHost, $host } from '.';
import {jwtDecode} from 'jwt-decode';

export const registration = async (email, password) => {
    try {
        const { data } = await $host.post('/api/user/registration', { email, password, role: 'ADMIN' });
        localStorage.setItem('token', data.token);
        return jwtDecode(data.token);
    } catch (error) {
        console.error('Error during registration:', error);
        throw error; // Rethrow or handle error
    }
}

export const login = async (email, password) => {
    try {
        const { data } = await $host.post('/api/user/login', { email, password });
        localStorage.setItem('token', data.token);
        return jwtDecode(data.token);
    } catch (error) {
        console.error('Error during login:', error);
        throw error; // Rethrow or handle error
    }
}

export const check = async () => {
    try {
        const { data } = await $authHost.get('/api/user/auth');
        localStorage.setItem('token', data.token);
        return jwtDecode(data.token); // Decode the token to extract user data
    } catch (error) {
        console.error('Error checking authentication:', error);
        return null; // Return null or handle error
    }
}
