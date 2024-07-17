
import { useApi } from "@/composables/api";
const { callApi, token } = useApi();

async function authenticate(mail: string, password: string) {
    try {
        const data = await callApi('login', 'POST', { mail, password });
        if (data.token) {
            localStorage.setItem('token', data.token);
            token.value = data.token;
        }
    } catch (error) {
        console.error(error);
    }
}

async function logout() {
    localStorage.removeItem('token');
    token.value = null;
}

export function useLogin() {
    return {
        authenticate,
        logout
    };
}