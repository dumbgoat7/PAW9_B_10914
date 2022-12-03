import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

function importComponent(path){
    return () => import(`./components/${path}.vue`);
}

const router = new VueRouter ({
    mode: "history",
    routes: [
        {
            path:"/",
            name:"admin",
            component: importComponent("DashboardLayout"),
            children: [
                {
                    path: "/",
                    name: "Root",
                    component: importComponent("DashboardIndex"),
                },
                {
                    path: "/gd",
                    name: "Guided",
                    component: importComponent("TodoList/ListItem"),
                },
                {
                    path: "/ugd",
                    name: "Unguided",
                    component: importComponent("TodoList/ListItemUGD"),
                },
                {
                    path: "/tgs",
                    name: "Tugas",
                    component: importComponent("TodoList/TugasList"),
                },
                {
                    path: "/pwa",
                    name: "UGD 12 PWA",
                    component: importComponent("pwa_0914/MakananList"),
                },
            ],
        },
    ],
});

export default router;

