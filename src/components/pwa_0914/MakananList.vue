<template>
    <v-main class="list">
        <v-card>
            <v-list-item>
                <v-list-item-avatar color="grey"></v-list-item-avatar>
                <v-list-item-content>
                    <v-list-title class="headline">Makanan</v-list-title>
                    <v-list-subtitle>by 200710914</v-list-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-card-title>
                <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                outlined
                hide
                details
                style="margin-top: 30px">
                </v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn>
            </v-card-title>
        </v-card>
        <v-card>
            <v-data-table 
            class="elevation-1"
            :headers="headers" 
            :items="todos" 
            :search="search"
            item-key="task">
                <template v-slot:[`item.calories`]="{ item }">
                    <span v-if="item.calories > 400 ">
                        <v-chip class="ma-2" color="#E72A00" text-color="white">{{item.calories}}</v-chip>
                        <!-- <v-icon @click="showSnackbar(item)" color="#FDD835">mdi-alert-octagon</v-icon> -->
                    </span>
                    <span v-else-if="item.calories > 300">
                        <v-chip class="ma-2" color="#FDD835" text-color="white">{{item.calories}}</v-chip>
                        <!-- <v-icon @click="showSnackbar(item)" color="#2A57CF">mdi-alert-octagon</v-icon> -->
                    </span>
                    <span v-else-if="(item.calories > 100)">
                        <v-chip class="ma-2" color="#00C9A7" text-color="white">{{item.calories}}</v-chip>
                        <!-- <v-icon @click="showSnackbar(item)" color="#E72A00">mdi-alert-octagon</v-icon> -->
                    </span>
                    <span v-else>
                        <v-chip class="ma-2" color="#845EC2" text-color="white">{{item.calories}}</v-chip>
                    </span>
                </template>
                <template v-slot:[`item.actions`]="{ item }"> 
                    <span v-if="item.status == 'Ready'">
                        <v-btn
                        outlined
                        medium
                        fab
                        @click="editItem(item)"
                        color="#E72A00"
                        disabled>
                            <v-icon> mdi-pencil</v-icon>
                        </v-btn>
                    </span>
                    <span v-else >
                        <v-btn
                        outlined
                        medium
                        fab
                        @click="editItem(item)"
                        color="#E72A00">
                            <v-icon> mdi-pencil</v-icon>
                        </v-btn>
                    </span>

                    <span v-if="item.status == 'On Process' || item.status == 'Delivery'">
                        <v-btn
                        class="ml-2"
                        outlined
                        medium
                        fab
                        @click="deleteItem(item)"
                        color="#81C784"
                        disabled>
                            <v-icon  style=";width: fit-content;"> mdi-delete </v-icon>
                        </v-btn>
                    </span>
                    <span v-else >
                        <v-btn
                        class="ml-2"
                        outlined
                        medium
                        fab
                        @click="deleteItem(item)"
                        color="#81C784">
                            <v-icon  style=";width: fit-content;"> mdi-delete </v-icon>
                        </v-btn>
                    </span>
                </template>
            </v-data-table>
        </v-card>

        
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline"> Form Todo List </span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="formTodo.name"
                            label="name"
                            required></v-text-field>

                        <v-text-field
                            v-model="formTodo.calories"
                            label="calories"
                            required></v-text-field>
                        
                        <v-textarea
                            v-model="formTodo.note"
                            label="Note"
                            required></v-textarea>

                        <v-select
                            v-model="formTodo.status"
                            :items="[`Ready`, `Delivery`, `On Process`]"
                            label="Status"
                            required></v-select>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="edit" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline"> Form Todo List </span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="editTask.name"
                            label="Task"
                            required></v-text-field>
                        <v-text-field
                            v-model="editTask.calories"
                            label="calories"
                            required></v-text-field>
                        <v-textarea
                            v-model="editTask.note"
                            label="Note"
                            required></v-textarea>
                        <v-select
                            v-model="editTask.status"
                            :items="[`Ready`, `Delivery`, `On Process`]"
                            label="Status"
                            required></v-select>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancelEdit"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="saveEdit"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        
        <v-dialog v-model="deleteTask"
        :multi-line="multiLine"
        centered
        width="400">
        <v-card>
            <v-card-title class="text-h5">
            Are you sure to delete?
            </v-card-title>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#00695C" text @click="ondeleteItem()">Yes</v-btn>
            <v-btn color="#B71C1C" text @click="deleteTask = false">No</v-btn>
            </v-card-actions>
        </v-card> </v-dialog>

        <v-snackbar
        v-model="snackbarUrgent"
        :timeout="3000"
        color="red darken-1"
        absolute
        center
        shaped
        top>
        <v-icon color="white" class="mr-2"> mdi-alarm-light</v-icon>
        Note Priority : {{editTask.priority}}    
        </v-snackbar>

        <v-snackbar
        v-model="snackbarNotImportant"
        style="margin-bottom: 40px ;"
        color="light-blue darken-1"
        :timeout="3000"
        right
        shaped
        bottom>
        <v-icon color="white" class="mr-2"> mdi-heart </v-icon>
        Note Priority : {{editTask.priority}} 
        </v-snackbar>

        <v-snackbar
        v-model="snackbarNormal"
        :timeout="3000"
        color="yellow darken-2"
        absolute
        left
        shaped
        top>
        <v-icon color="white" class="mr-2"> mdi-pause </v-icon>
        Note Priority : {{editTask.priority}}
        </v-snackbar>
    </v-main>
</template>

<script>

    export default {
        name: "ListItem",
        data() {
            return {
                deleteTask: false,
                snackbarUrgent: false,
                snackbarNotImportant: false,
                snackbarNormal: false,
                expanded: [],
                mutliLine: true,
                singleExpand: true,
                search: null,
                dialog: false,
                edit:false,
                editIndex: -1,
                deleteIndex: -1,
                headers: [{
                    text: "Name",
                    align: "start",
                    sortable: true,
                    value: "name",
                },
                { text: "Calories", value: "calories"},
                { text: "Note", value: "note"},
                { text: "Status", value: "status"},
                { text: "Actions", value: "actions"},
            ],
            todos: [
                {
                    name: "Fried Rice",
                    calories: 120,
                    note: "Tidak pakai cabe",
                    status: "On Process",
                },
                {
                    name: "Dessert",
                    calories: 350,
                    note: "Tambah alat makan",
                    status: "Ready",
                },
                {
                    name: "Ice Cream",
                    calories: 450,
                    note: "Rasa coklat dan stroberi",
                    status: "Delivery",
                }
            ],
            editTask: {
                name: null,
                calories: null,
                note: null,
                status: null,
            },
            formTodo: {
                name: null,
                calories: null,
                note: null,
                status: null,
            },        
        };
        },
        methods: {
            save() {
                this.todos.push(this.formTodo);
                this.resetForm();
                this.dialog = false;
            },
            cancel() {
                this.resetForm();
                this.dialog = false;
            },
            cancelEdit(){
                this.resetForm();
                this.edit = false;
            },
            saveEdit(){
                Object.assign(this.todos[this.editIndex], this.editTask)
                this.edit = false;
            },
            resetForm() {
                this.formTodo = {
                    name: null,
                    calories: null,
                    note: null,
                    status: null,
                };
            },
            ondeleteItem() {
                this.todos.splice(this.deleteIndex,1);
                this.deleteTask = false;
            },
            deleteItem(item) {
                this.deleteIndex = this.todos.indexOf(item);
                this.deleteTask = true;
            },
            editItem(item) {
                this.editIndex = this.todos.indexOf(item);
                this.editTask = Object.assign({}, item);
                this.edit = true;
            },
            showSnackbar(item) {
                this.editTask = Object.assign({}, item);
                if(this.editTask.priority == 'Urgent') {
                    this.snackbarUrgent = true;
                } else if(this.editTask.priority == 'Not Important') {
                    this.snackbarNotImportant = true;
                } else if(this.editTask.priority == 'Normal') {
                    this.snackbarNormal = true;
                }
            }
            
        },
    };
</script>

<style>
    .text {
        font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
        font-size: 40px;
        font-style: italic;
    }
</style>