import {createRouter, createWebHashHistory} from "vue-router";
import {initModule} from "@/utils/ModulesInit";

const routes = [
    {
        path: "/",
        name: "root",
        redirect: "/practice"
    },
    {
        path: "/practice",
        name: "地质实习",
        component: () =>
            import("@/views/business/practice/index.vue"),
    },
    {
        path:"/school",
        name:"数字校园",
        component:() =>
            import("@/views/business/digSchool/index.vue")
    },
    {
        path:"/resources",
        name:"数字化资源",
        component:() =>
          import("@/views/business/resources/index.vue")
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.afterEach((to, from) => {
    initModule(to.fullPath);
})

export default router
