import layout from "@/layout"
export default {
    path: '/department',
    component: layout, //一级路由
    children: [{
        //二级路由为空时，表示的就是/department 
        path: "",
        component: () => import("@/views/department"),
        name: 'department',
        meta: {
            //路由元信息，存储数据的
            icon: 'tree',  //图标
            title: '组织'  //标题
        }
    }]
}