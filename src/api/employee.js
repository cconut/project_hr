import request from "@/utils/request"
export function getEmployeeList(params) {
    return request({
        url: '/sys/user',
        params
    })
}

export function exportEmployee() {
    return request({
        url: '/sys/user/export',
        //改变接收数据的类型，使用blob接收二进制文件流
        responseType: 'blob'
    })
}

export function getExportTemplate() {
    return request({
        url: '/sys/user/import/template',
        //改变接收数据的类型，使用blob接收二进制文件流
        responseType: 'blob'
    })
}
//上传excel
export function uploadExcel(data) {
    return request({
        url: '/sys/user/import',
        method: 'post',
        //form-data类型
        data
    })
}
export function delEmployee(id) {
    return request({
        url: `/sys/user/${id}`,
        method: 'delete',
    })
}
export function addEmployee(data) {
    return request({
        url: '/sys/user',
        method: 'post',
        data
    })
}

//获取员工详情
export function getEmployeeDetail(id) {
    return request({
        url: `/sys/user/${id}`
    })
}

export function updateEmployee(data) {
    return request({
        url: `/sys/user/${data.id}`,
        method: 'put',
        data
    })
}