<template>
<v-app>
  <v-app-bar app color="primary">
    <v-spacer/><v-toolbar-title style="color: white">Chat</v-toolbar-title>
    <v-spacer/>
  </v-app-bar>
  <v-main>
    <v-container>
  <Chat/>
    </v-container>
  </v-main>
</v-app>
</template>

<script>
import Chat from './components/Chat.vue'
export default {
name: 'App',
components: {
  Chat
},
}
</script>

<style>
@media (min-width: 1400px) {
  .container{
  width: 60vw;
}
}
</style>