<template>
    <div v-bind:inRoom="inRoom">
    <v-alert type="error" v-show="error">{{ chatError }}</v-alert>
    <v-card>
    <v-card-title>
    </v-card-title>
      <v-list class="chat-box" v-chat-scroll="{smooth: true}">
        <v-list-item
          v-bind:key="message.id"
          v-for="message in messages"
          v-bind:class="checkMsg(message)"
          class="message white--text"
        >
        <v-list-item-content>
          {{ message.text }}
          <v-list-item-subtitle>
            {{ message.authorName }}
            {{ message.authorId }}
          </v-list-item-subtitle>
        </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-card-title class="justify-center" v-show="messages.length === 0">
        New messages will appear here!
      </v-card-title>
      <v-container v-show="messages.length > 0">
        <v-card-title
          v-show="loading === true && error === true"
          class="justify-center"
        >
          <v-progress-circular indeterminate />
        </v-card-title>
        <v-card-title
          v-show="loading === true && error === false"
          class="justify-center"
        >
          <v-progress-circular indeterminate />
        </v-card-title>
        <v-card-title
          v-show="error === true"
          class="material-icons justify-center"
        >
          <v-btn icon>
            <v-icon> mdi-refresh </v-icon>
          </v-btn>
        </v-card-title>
      </v-container>
    </v-card>
    <v-form
      lazy-validation
      ref="form"
      @submit.prevent="sendMsg"
      v-model="request.valid"
    >
      <v-text-field
        v-model="request.text"
        :rules="request.rule"
        required
        label="Сообщение"
        placeholder="Введите текст сообщения"
        autocomplete="false"
      >
      </v-text-field>
      <v-btn
        v-bind:disabled="loading || request.text == ''"
        type="submit"
        block
      >
        Отправить
      </v-btn>
    </v-form>
    <!-- <br />
    <v-btn @click="deleteChat">
скрыть чат
    </v-btn> -->
  </div>
  </template>

<script>
  import {auth} from '../db'

import  axios from 'axios'
import {db, Timestamp} from '../db'
  export default {
      props: {
        roomId:undefined
      },
      name: 'Chat',
      data: () => ({
              inRoom: true,

    loading: false,
    error: false,
    request: {
      text: "",
      valid: false,
      rule: [(v) => !!v || "Необходимо заполнить это поле"],
    },
    user: {
    uid:'',
    email: '',
    name: '',
    },
    messages: [],
    chatError: undefined,
  }),
  mounted() {
    var scope = this
        auth.onAuthStateChanged(function (user) {
            if(user) {
              scope.user.uid = user.uid 
              scope.user.name = user.displayName
                scope.user.email = user.email
                scope.chatError = ''
            } else {
                scope.user.email = ''
                scope.chatError = ''
            }
        })
    },
  watch: {
    roomId: {
      immediate: true,
      handler(roomId) {
        this.$bind('messages', db.collection('Chats').doc(roomId).collection('messages').orderBy('sent'))
       }
    }
  },
  methods: {
    sendMsg() {
      db.collection('Chats').doc(this.roomId).collection('messages').add({text:this.request.text, authorName: this.user.name, authorId: this.user.uid, sent: Timestamp.now() })
      this.request.text = ''
    },
    deleteChat() {
      db.collection('Chats').doc(this.roomId).add({disabled: true});
      this.inRoom = false
      this.$emit('update:inRoom', this.inRoom)
    },
    checkMsg(request) {
      if (request.authorId == this.user.uid) {
        return "accent message-right";
      } else {
        return "accent2 drawer message-left";
      }
    },
  },
  }
  </script>
  
  <style>
.chat-box {
  max-height: 70vh !important;
  overflow-y: auto;
}
.message {
  border: 1px solid black;
  border-radius: 10px;
  padding: 10px;
  width: 60%;
  margin: 5px;
  font-size: 14px;
  /* background-color: ; */
}
.message-right {
  position: relative;
  margin-left: 30%;
}
</style>
