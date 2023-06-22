<template>
    <h1>{{message}}</h1>
</template>
<script>
import api from '../services/axios'

export default{
    name: "message",
    data: () => {
        return {message: null,};
        
    },
    mounted() {
        api.getMessage()
            .then((response) =>{
                console.log(response);
                this.message = response.data.message;
            })
            .catch(error => {
                this.message = error;
            });

    }
}
</script>