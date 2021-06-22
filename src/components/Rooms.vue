<template>
  <div>
    <v-dialog v-model="dialog.password">
      <v-card>
        <v-container>
          <v-form @submit.prevent="setPassword">
            <v-text-field
              label="Room Password"
              v-model="dialog.passwordString"
            />
            <v-btn type="submit" color="green">Ok</v-btn>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
    <v-alert type="error" v-show="error">{{ error }}</v-alert>
    <v-dialog v-model="dialog.goToPrivate">
      <v-card>
        <v-container>
          <v-form @submit.prevent="gotoRoomPrivate">
            <v-text-field
              label="Room Password"
              v-model="dialog.goToPrivateString"
            />
            <v-btn type="submit">Ok</v-btn>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
    <h1>{{ currentRoom.name }}</h1>
    <div v-if="inRoom">
      <v-btn @click="subscribetoRoom(currentRoom.id)" block>Subscribe</v-btn>
      <v-btn @click="leave('Fjpx1WZzkZXzwp1EqTzy')" block>Leave</v-btn>
      <v-btn @click.stop="dialog.password = true" block>Set Password</v-btn>
      <chat-component
        v-model="inRoom"
        :roomId="currentRoom.id"
      ></chat-component>
    </div>
    <div v-else>
      <h1>Группы</h1>

      <v-list>
        <!--<v-progress-circular indeterminate v-show="!loaded && error != ''"/>-
        <v-alert type="error" v-show="error">{{error}}</v-alert>-->
        <div v-if="chats.length > 0">
          <v-list-item
            v-for="room in chats"
            v-if="!room.disabled && !room.password"
            v-bind:key="room.id"
          >
            <v-list-item-content @click="gotoRoom(room.id, room.name)">
              <v-list-item-title>
                <div v-if="room.name != ''">{{ room.name }}</div>
                <div v-else>Пустое название</div>
              </v-list-item-title>
              <v-list-item-subtitle>
                <div v-if="room.description != ''">{{ room.name }}</div>
                <div v-else>Пустое описание</div>
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                {{ room.id }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn v-show="false" @click="hideRoom(room.id)" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </div>
        <v-list-item-title v-else> Нет активных чатов </v-list-item-title>
        <v-list-group v-show="false">
          <v-list-item
            v-for="room in chats"
            v-if="room.disabled"
            v-bind:key="room.id"
          >
            <v-list-item-content @click="gotoRoom(room.id, room.name)">
              <v-list-item-title>
                <div v-if="room.name != ''">{{ room.name }}</div>
                <div v-else>Пустое название</div>
              </v-list-item-title>
              <v-list-item-subtitle>
                <div v-if="room.description != ''">{{ room.name }}</div>
                <div v-else>Пустое описание</div>
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                {{ room.id }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn @click="showRoom(room.id)" icon>
                <v-icon>mdi-reload</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list-group>
        <v-list-group>
          <h4>Приватные группы</h4>
          <v-list-item
            v-for="room in chats"
            v-if="!room.disabled && room.password"
            v-bind:key="room.id"
          >
            <v-list-item-content
              @click.stop="
                dialog.goToPrivate = true;
                dialog.goToPrivateId = room.id;
              "
            >
              <v-list-item-title>
                <div v-if="room.name != ''">{{ room.name }}</div>
                <div v-else>Пустое название</div>
              </v-list-item-title>
              <v-list-item-subtitle>
                <div v-if="room.description != ''">{{ room.description }}</div>
                <div v-else>Пустое описание</div>
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                {{ room.id }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-lock</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list-group>
      </v-list>
      <v-divider />
      <v-card>
        <v-form lazy-validation @submit.prevent="createRoom">
          <v-container>
            <v-text-field
              v-model="newRoomName"
              :rules="[newRoomName.trim() != '']"
              label="Name"
            >
            </v-text-field>
            <v-text-field
              v-model="newRoomDescription"
              label="Description (optional)"
            >
            </v-text-field>
            <v-btn :disabled="newRoomName == ''" block type="submit"
              >Create a room</v-btn
            ></v-container
          >
        </v-form></v-card
      >
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import ChatComponent from "@/components/ChatComponent.vue";
import { db, auth, FieldValue } from "../db";
export default {
  components: {
    ChatComponent,
  },
  methods: {
    subscribetoRoom(roomId) {
      axios.get('https://localhost:5000/send?uid=' + auth.currentUser.uid + '&roomId=' + roomId).then(response => {
        console.log
      })
    },
     setPassword() {
      const scope = this;
      if (this.dialog.passwordString != "")
        db.collection("Chats")
          .doc(this.currentRoom.id)
          .update({ password: scope.dialog.passwordString });
      if (this.dialog.passwordString == "")
        db.collection("Chats")
          .doc(this.currentRoom.id)
          .update({ password: FieldValue.delete() });
    },
    showRoom(id) {
      db.collection("Chats").doc(id).set({ disabled: false });
    },
    hideRoom(id) {
      db.collection("Chats").doc(id).set({ disabled: true });
    },
    createRoom() {
      db.collection("Chats")
        .add({ name: this.newRoomName, description: this.newRoomDescription })
        .then((doc) => {
          doc.collection("messages").add({});
        })
        .catch((err) => console.log(err));
    },
    gotoRoom(roomId, roomName) {
      this.inRoom = true;
      this.currentRoom.id = roomId;
      this.currentRoom.name = roomName;
    },
    gotoRoomPrivate() {
      const scope = this;
      db.collection("Chats")
        .doc("n6YDVLPwMZToXmlD1fXa")
        .get()
        .then((doc) => {
          console.log(doc.data());
          if (scope.dialog.goToPrivateString == doc.data().password) {
            scope.inRoom = true;
            scope.currentRoom.id = this.dialog.goToPrivateId;
          } else {
            scope.error = "Неверный пароль";
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {
          scope.dialog.goToPrivate = false;
          scope.dialog.goToPrivateString = "";
        });
    },
    leave(roomId) {
      this.inRoom = false;
      this.currentRoom.id = "";
      this.currentRoom.name = "";
    },
  },
  data: () => ({
    dialog: {
      password: false,
      passwordString: "",
      goToPrivate: false,
      goToPrivateString: "",
      goToPrivateId: "",
    },
    newRoomName: "",
    newRoomDescription: "",
    chats: [],
    inRoom: false,
    currentRoom: {
      name: "",
      id: "",
    },
    loaded: false,
    error: "",
  }),
  firestore: {
    chats: db.collection("Chats"),
    // cancelCallback: function(err) {
    //   this.error = err
    // },
    // readyCallback: function () {
    //    this.loaded = true // NOTE THIS LINE
    // },
  },
};
</script>

<style>
</style>


