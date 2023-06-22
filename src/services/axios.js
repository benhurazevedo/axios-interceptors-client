import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3001" // ex.: 
})

api.interceptors.request.use((request) => {
    // Buscando seu token salvo no localstorage ou qualquer outro local
    const token = localStorage.getItem("token");
    
    if(token) {
        // Authorization geralmente é o header padrão para envio de token, mas isso não é uma regra. O endpoint pode requisitar outro header.
        //request.headers.Authorization = `Bearer ${token}`;
        request.headers.Authorization = `${token}`;
    }
    // Este return é necessário para continuar a requisição para o endpoint.
    return request; 
});

api.interceptors.response.use((response) => {
    // Retorna a resposta caso a requisição tenha sucesso.
    return response;
}, async (error) => {
    // O config é responsável por manter todas as informações da sua request.
    const originalRequest = error.config;
    
    // verifica se recebeu status 401 (unauthorized)
    // verifica se já houve mais de uma tentativa de buscar o mesmo endpoint
    if (
      error?.response?.status === 401 &&
      !originalRequest?.__isRetryRequest
    ) {
        originalRequest.retry = true;
        // Buscando seu refreshToken salvo no localstorage ou qualquer outro local
        const refreshToken = localStorage.getItem("refreshToken");
        if(!refreshToken) {
            // Limpa o localStorage para evitar redirecionamento automático da possível configuração em suas rotas
            localStorage.clear();
            // Redireciona automáticamente o usuário para uma rota aqui utilizei "/" que é para login
            return (window.location.href = "/");
        }
        
        // Agora chegou a hora de fazer sua chamada ao endpoint de renovação de token;
        const response = await refresh(refreshToken);
        // Essa parte vária o tipo de formato do retorno do seu endpoint.
        const data = {
            accessToken: response.token,
            refreshToken: response.refreshToken
        };
        // Transforma o objeto em string e guarda na key "refreshToken";
        localStorage.setItem(JSON.stringify(data), "refreshToken");
        
        // Parte responsável por refazer a request do usuário após a renovação do token
        return api(originalRequest);
    }
    
    // Parte necessária para retornar as requisições que não tiveram sucesso
    return Promise.reject(error);
});

async function getMessage()
{
    return await api.get("/");
}

async function login()
{
    try {
        const {data} = await api.get("/auth");
        localStorage.setItem("token", data.token);
    } catch (e) {
        alert("falha de login")
    }
}
export default {
    getMessage: getMessage,
    login: login,
};