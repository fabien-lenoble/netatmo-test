import { type Ref, ref } from 'vue';
const token: Ref<string | null> = ref(localStorage.getItem('token'))

async function callApi(route: string, method: string, data?: any) {
    try {
        const url = new URL(`http://localhost:3001/${route}`);
        const headers = {
            'Authorization': `Bearer ${token.value}`
        }
        let body
        switch (method) {
            case "GET":
                if (data) {
                    url.search = new URLSearchParams(data).toString();
                }
                break;
            case "POST":
                headers['Content-Type'] = 'application/json';
                body = data
                break;
        }


        const res = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        });
        return await res.json();
    } catch (error) {
        console.log('----', error);
        if (error.status === 401) {
            // if code === 6 -> message missing token
            // if code === 7 -> message invalid token
            // if code === 8 -> message expired token
            localStorage.removeItem('token');
            token.value = null;
        }
    }
}

export function useApi() {
    return {
        callApi,
        token
    };
  }