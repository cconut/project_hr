import request from '@/utils/request'

export function getRoleList(params) {
    return request({
        url: '/sys/role',
        params
    })
}

export function addRole(data) {
    return request({
        url: '/sys/role',
        method: 'post',
        data
    })
}

export function updateRole(data) {
    return request({
        url: `/sys/role/${data.id}`,
        method: 'put',
        data
    })
}

export function delRole(id) {
    return request({
        url: `/sys/role/${id}`,
        method: 'delete'
    })
}

/**
 * 获取可用的角色
 * **/

export function getEnableRoleList() {
    return request({
        url: '/sys/role/list/enabled'
    })
}

export function assignRole(data) {
    return request({
        url: '/sys/user/assignRoles',
        method: 'put',
        data
    })
}

//获取角色详情
export function getRoleDetail(id) {
    return request({
        url: `/sys/role/${id}`
    })
}

/**
 * 给角色分配权限
 *
 * ***/

export function assignPerm(data) {
    return request({
        url: '/sys/role/assignPrem',
        method: 'put',
        data
    })
}


