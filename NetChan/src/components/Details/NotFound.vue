<template>
    <v-container fluid class="err-container">
        <v-row style="height:100vh;">
            <v-col cols="12" style="padding:0;">
                <v-row
                    align="center"
                    style="height:100vh;padding:0 20% 0 20%;"
                >
                    <div>
                        <img src="img/error.png" />
                        <p>
                            NetChan ran into a problem and needs to restart. We're just collecting your personal info, and then will do nothing for you.
                        </p>
                        <p>
                            If you'd like to know more, you can search online later for this error: <strong>{{ message }}</strong>
                        </p>
                    </div>
                </v-row>
            </v-col>
        </v-row>
  </v-container>    
</template>

<script>
    export default {
		name: 'NotFound',
        props: ['message']
    }
</script>

<style scoped>
    @font-face {
        font-family: "Segoe UI";
        font-weight: 200;
        src: local("Segoe UI Light");
    }

    .err-container {
        height:100vh;
        padding:0;
        background: rgb(16, 111, 170) !important;
    }

    p {
        color:white;
        font-size:18pt;
        font-family:"Segoe UI Light";
    }
</style>