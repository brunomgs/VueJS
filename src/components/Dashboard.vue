<template>
    <v-app id="inspire" style="background-color: #3f51b5;">
      <v-navigation-drawer v-model="drawer" app color="#3f51b5">
        <template v-slot:prepend>
          <v-list-item two-line>
            <v-list-item-avatar>
              <img src="https://randomuser.me/api/portraits/men/85.jpg">
            </v-list-item-avatar>
  
            <v-list-item-content>
              <v-list-item-title>Usuario</v-list-item-title>
              <v-list-item-subtitle>Usuario@gmail.com</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      <v-divider style="background-color: white;"></v-divider>

      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" link>
          <v-list-item-icon>
            <v-icon style="color: white;">{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title style="color: white;">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="#3f51b5">
      <v-app-bar-nav-icon @click="drawer = !drawer" color="#DEE1DC"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-img
          alt="Beyond logo"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://beyondcompany.com.br/img/logo.62069458.svg"
          width="200"
        />
      </div>
    </v-app-bar>

    <v-main>
      <v-content>
        <template>
          <v-data-table
            :headers="headers"
            :items="livros"
            hide-default-footer
            sort-by="matricula"
            class="elevation-0 custom-table"
          >
            <template v-slot:top>
              <v-toolbar color="#1e293b">
                <v-toolbar-title class="white--text font-weight-bold">LIVROS</v-toolbar-title>

                <v-divider class="mx-4" inset vertical style="background-color: white;"></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="#94a3b8" dark class="mb-2" v-bind="attrs" v-on="on">
                      Adicionar
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.nome" label="Nome"></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.codigo" label="Codigo"></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.autor" label="Autor"></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.categoria" label="Categoria"></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                      <v-btn color="blue darken-1" text @click="save">Salvar</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                  <v-card>
                    <v-card-title class="text-h5">Tem certeza que quer deletar esse item?</v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
                      <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-2" style="color: white;" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon small style="color: white;" @click="deleteItem(item)">
                mdi-delete
              </v-icon>
            </template>
            <template v-slot:no-data>
              <v-btn color="primary" @click="initialize">
                Reset
              </v-btn>
            </template>
          </v-data-table>
        </template>
      </v-content>
      <div class="logout-button">
        <v-btn color="#94a3b8" class="white--text" @click="logout">Sair</v-btn>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    drawer: null,
    items: [
      { title: 'My Account', icon: 'mdi-account' },
      { title: 'Users', icon: 'mdi-account-group-outline' },
    ],
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'Nome', align: 'start', sortable: false, value: 'nome', class: 'white--text' },
      { text: 'Codigo', value: 'codigo', class: 'white--text' },
      { text: 'Autor', value: 'autor', class: 'white--text' },
      { text: 'Categoria', value: 'categoria', class: 'white--text' },
      { text: 'Actions', value: 'actions', sortable: false, class: 'white--text' },
    ],
    livros: [],
    editedIndex: -1,
    editedItem: {
      nome: '',
      codigo: 0,
      autor: '',
      categoria: '',
    },
    defaultItem: {
      nome: '',
      codigo: 0,
      autor: '',
      categoria: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Novo registro' : 'Editar registro';
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    async initialize() {
      try {
        const response = await axios.get('http://localhost:3000/livros');
        this.livros = response.data;
      } catch (error) {
        console.error('Erro ao obter livros:', error);
      }
    },

    onlyLetters(event) {
      const charCode = event.which ? event.which : event.keyCode;
      const charStr = String.fromCharCode(charCode);
      if (!/^[a-zA-ZáàâãäåçéèêëíìîïñóòôõöúùûüýÿÁÀÂÃÄÅÇÉÈÊËÍÌÎÏÑÓÒÔÕÖÚÙÛÜÝŸ ]+$/.test(charStr)) {
        event.preventDefault();
      }
    },

    onlyNumbers(event) {
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
    },

    onlyNumbersAndSymbols(event) {
      const charCode = event.which ? event.which : event.keyCode;
      if (
        (charCode < 48 || charCode > 57) && // 0-9
        charCode !== 45 && // -
        charCode !== 46 // .
      ) {
        event.preventDefault();
      }
    },

    editItem(item) {
      this.editedIndex = this.livros.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.livros.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        await axios.delete(`http://localhost:3000/livros/${this.editedItem.id}`);
        this.livros.splice(this.editedIndex, 1);
        this.closeDelete();
      } catch (error) {
        console.error('Erro ao deletar o livro:', error);
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.editedIndex > -1) {
        try {
          await axios.put(`http://localhost:3000/livros/${this.editedItem.id}`, this.editedItem);
          Object.assign(this.livros[this.editedIndex], this.editedItem);
        } catch (error) {
          console.error('Erro ao atualizar o livro:', error);
        }
      } else {
        try {
          const response = await axios.post('http://localhost:3000/livros', this.editedItem);
          this.livros.push(response.data);
        } catch (error) {
          console.error('Erro ao adicionar o livro:', error);
        }
      }
      this.close();
    },

    logout() {
      // Implementar a lógica de logout
    },
  },
};
</script>

<style>

.custom-table th, .custom-table td {
  color: white !important;
}

.v-application--wrap {
  min-height: 100vh;
}
.logout-button {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
}
.custom-table {
  background-color: #1e293b;
  color: white;
}

.v-data-table__wrapper {
  background-color: #1e293b;
}

.v-data-table__header th {
  background-color: #1e293b;
}

.v-data-table__footer {
  background-color: #1e293b;
}

</style>
