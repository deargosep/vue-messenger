<template>
<div>
    <v-alert v-show="error" type="error">{{error}}</v-alert>
    <div v-if="userEmail == ''">
      <h1 >Login</h1>
  <v-form  @submit.prevent="login">
      <v-text-field label="Email" type="email" v-model="email" />
      <v-text-field label="Password" type="password" v-model="password" />
      <v-btn type="submit">Login</v-btn>
  </v-form>
  <h1> Register</h1>
  <v-form  @submit.prevent="registerUser()">
      <v-text-field label="Email" type="email" v-model="register.email" />
      <v-text-field label="Name" v-model="register.name" />
      <v-text-field label="Password" type="password" v-model="register.password" />
      <v-text-field label="Confirm password" type="password" v-model="register.confirmPassword" />
      <v-btn type="submit">Register</v-btn>
  </v-form>
    </div>
  <div v-else>
      <v-card style="padding: 15px">
  {{userEmail}} ({{userName}})
    <v-btn block @click="logout">
      Logout
  </v-btn>
  </v-card>
  <v-card style="padding: 15px">
  <Rooms />
  </v-card>

  </div>
</div>
</template>
<script>
import Rooms from '../components/Rooms'
import {auth} from '../db'
export default {
    name: 'Chat',
    components: {
        Rooms
    },
    mounted() {
        var scope = this
        auth.onAuthStateChanged(function (user) {
            if(user) {
                scope.userEmail = user.email
                scope.userName = user.displayName
                scope.error = ''
            } else {
                scope.userEmail = ''
                scope.userName = ''
                scope.error = ''
            }
        })
    },
    data: () => ({
        register: {
            email: '',
            name: '',
            password: '',
            confirmPassword: ''
        },
        email: '',
        password: '',
        authed: null,
        userEmail: '',
        userName: '',
        error: ''
    }),
    methods: {
        registerUser(){
            const scope = this
            auth.createUserWithEmailAndPassword(this.register.email, this.register.password).then(user => {
                user.user.updateProfile({
                    displayName: scope.register.name,
                })
            }).catch(err => {
                                scope.error = err

            })
        },
        login() {
            const scope = this
            auth.signInWithEmailAndPassword(this.email, this.password).catch(err => {
                scope.error = err
            })
        },
        logout() {
            auth.signOut()
        }
    }
}
</script>

<style>

</style>