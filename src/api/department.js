import request from '@/utils/request'

export function getDepartment() {
    return request({
        url: '/company/department'
    })
}
export function getManagerList() {
    return request({
        url: '/sys/user/simple'
    })
}

// 新增组织
export function addDeparment(data) {
    return request({
        url: '/company/department',
        method: "post",
        data
    })
}
//获取部门详情
export function getDepartmentDetail(id) {
    return request({
        url: `/company/department/${id}`,
    })
}

//更新部门

export function updateDepartment(data) {
    return request({
        method: "put",
        url: `/company/department/${data.id}`,
        data
    })
}

//删除部门
export function delDepartment(id) {
    return request({
        url: `/company/department/${id}`,
        method: 'delete'
    })
}