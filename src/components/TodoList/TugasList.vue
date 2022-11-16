<template>
    <v-main class="list">
        <v-card>
            <v-list-item>
                <v-list-item-avatar color="grey"></v-list-item-avatar>
                <v-list-item-content>
                    <v-list-title class="headline">To Do List</v-list-title>
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
                <v-select
                v-model="filter.priority"
                :items="['All','Urgent','Not Important']"
                label="Filter by Priority"
                style="margin-top: 30px; margin-right: 30px; float:right">
                </v-select>

                <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn>
            </v-card-title>
        </v-card>
        <v-card>
            <v-data-table 
            class="elevation-1"
            :headers="headers" 
            :items="todos" 
            :search="search"
            :singleExpand="singleExpand"
            item-key="task"
            show-expand
            :custom-filter="filterbyPriority">
                <template v-slot:[`item.priority`]="{ item }">
                    <span v-if="item.priority =='Urgent'">
                        <v-icon @click="showSnackbar(item)" color="#E72A00">mdi-alert-octagon</v-icon>
                    </span>
                    <span v-else-if="item.priority == 'Not Important'">
                        <v-icon @click="showSnackbar(item)" color="#2A57CF">mdi-alert-octagon</v-icon>
                    </span>
                    <span v-else-if="item.priority == 'Normal'">
                        <v-icon @click="showSnackbar(item)" color="#FDD835">mdi-alert-octagon</v-icon>
                    </span>
                </template>
                <template v-slot:[`item.actions`]="{ item }"> 
                    <span v-if="item.status == 'Selesai'">
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
                    
                    <v-btn
                    class="ml-2"
                    outlined
                    medium
                    fab
                    @click="ondeleteItem(item)"
                    color="#81C784">
                        <v-icon  style=";width: fit-content;"> mdi-delete </v-icon>
                    </v-btn>
                </template>
                <template v-slot:expanded-item="{headers, item }">
                    <td :colspan="headers.length" >
                        <div v-if="item.priority =='Urgent'">
                            <div style="background-color: #E72A00;padding: 5px;">
                                <v-container class="mx-1 mt-1 py-1 red lighten-1 rounded-xl" style="color: white; width: fit-content; ">
                                    <v-icon color="white">mdi-fire</v-icon>{{ item.priority }} 
                                </v-container>
                                <v-container class="ml-1 my-1 mt-1 py-1 yellow darken-3 rounded-xl" style="color: white; width: fit-content;"> 
                                    <v-icon color="white">mdi-note-text</v-icon> Note Task : {{ item.note }}
                                </v-container>
                            </div>
                        </div>
                        <div v-else-if="item.priority =='Not Important'">
                            <div style="background-color: #2A57CF;padding: 5px;">
                                <v-container class="mx-1 mt-1 py-1 blue darken-1 rounded-xl" style="color: white; width: fit-content; ">
                                    <v-icon color="white">mdi-fire</v-icon>{{ item.priority }} 
                                </v-container>
                                <v-container class="ml-1 my-1 mt-1 py-1 light-blue darken-1 rounded-xl" style="color: white; width: fit-content;"> 
                                    <v-icon color="white">mdi-note-text</v-icon> Note Task : {{ item.note }}
                                </v-container>
                            </div>
                        </div>
                        <div v-else-if="item.priority =='Normal'">
                            <div style="background-color: #FFF59D;padding: 5px;">
                                <v-container class="mx-1 mt-1 py-1 amber lighten-2 rounded-xl" style="color: white; width: fit-content; ">
                                    <v-icon color="white">mdi-fire</v-icon>{{ item.priority }} 
                                </v-container>
                                <v-container class="ml-1 my-1 mt-1 py-1 yellow darken-3 rounded-xl" style="color: white; width: fit-content;"> 
                                    <v-icon color="white">mdi-note-text</v-icon> Note Task : {{ item.note }}
                                </v-container>
                            </div>
                        </div>
                    </td>
                </template>

                <template v-slot:[`item.checkbox`]="{ item }">
                    <v-container fluid>
                        <v-checkbox v-model="item.checkbox" @click="deleteMany(item)"> </v-checkbox>
                    </v-container>
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
                            v-model="formTodo.task"
                            label="Task"
                            required></v-text-field>
                        <v-select
                            v-model="formTodo.priority"
                            :items="[`Urgent`, `Not Important`, `Normal`]"
                            label="Priority"
                            required></v-select>
                        
                        <v-textarea
                            v-model="formTodo.note"
                            label="Note"
                            required></v-textarea>

                        <v-select
                        v-model="formTodo.status"
                            :items="[`Selesai`, `Belum Selesai`]"
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
                            v-model="editTask.task"
                            label="Task"
                            required></v-text-field>
                        <v-select
                            v-model="editTask.priority"
                            :items="[`Urgent`, `Not Important`, `Normal`]"
                            label="Priority"
                            required></v-select>
                        
                        <v-textarea
                            v-model="editTask.note"
                            label="Note"
                            required></v-textarea>

                        <v-select
                            v-model="editTask.status"
                            :items="[`Selesai`, `Belum Selesai`]"
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
        
        <v-card>
        <p style="font-size: 22px; font-weight: bold; margin-left: 10px; padding-top: 10px; margin-top: 10px">Delete Multiple</p>
        <ul v-for="(item, index) in todos" :key="index">
            <li v-if="item.checkbox == true" style="margin-left: 5px; margin-top: 5px">
            {{ item.task }}
            </li>
        </ul>
        <br />
        <v-btn class="red darken-2" @click="deleteAll(item)" style="color:azure; margin-left: 10px; margin-bottom: 10px">HAPUS SEMUA</v-btn>
        </v-card>

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
            <v-btn color="#00695C" text @click="deleteItem(editTask)">Yes</v-btn>
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

// buat filter
// https://vuetifyjs.com/en/components/data-tables/#footer-props
// https://www.codeply.com/p/krbUh6q9yE

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
                headers: [{
                    text: "Task",
                    align: "start",
                    sortable: true,
                    value: "task",
                },
                { text: "Priority", value: "priority", 
                    filter: value => {
                        if(this.filter.priority == 'All')
                            return true
                        return value == this.filter.priority
                    },
                },
                { text: "Note", value: "note"},
                { text: "Status", value: "status"},
                { text: "Actions", value: "actions"},
                { text: "", value: "checkbox"},
                ],
                todos: [
                    {
                        task: "Coding",
                        priority: "Urgent",
                        note: "Code for your life",
                        status: "Belum Selesai",
                    },
                    {
                        task: "Cooking",
                        priority: "Normal",
                        note: "Indomie saat begadang ngerjain coding terbaek",
                        status: "Selesai",
                    },
                    {
                        task: "Gaming",
                        priority: "Not Important",
                        note: "Wasting time",
                        status: "Belum Selesai",
                    }
                ],
                editTask: {
                    task: null,
                    priority: null,
                    note: null,
                    status: null,
                },
                formTodo: {
                    task: null,
                    priority: null,
                    note: null,
                    status: null,
                },
                filter: {
                    priority: 'All',
                },
                listDelete: [],        
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
                this.todos = this.editTask;
                this.edit = false;
            },
            resetForm() {
                this.formTodo = {
                    task: null,
                    priority: null,
                    note: null,
                    status: null,
                };
            },
            deleteItem(item) {
                this.todos.splice(this.todos.indexOf(item),1);
                this.deleteTask = false;
            },
            ondeleteItem(item) {
                this.editTask = Object.assign({}, item);
                this.deleteTask = true;
            }, 
            editItem(item) {
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
            },
            ondeleteMany(item) {
                this.listDelete.push(item);
            },
            // https://stackoverflow.com/questions/49335634/splice-array-by-value-in-vue
            // deleteMany(item) {
            //  this.todos = this.listDelete.filter(title => title !== item.task)
            // }
            
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