export const GroupColumns = [
    { id: 'id', name: 'id' },
    { id: 'name', name: '名字' },
    { id: 'permissionName', name: '权限名称' },
]
export const adminColumns = [
    { id: 'id', name: 'id' },
    { id: 'name', name: '名字' },
    { id: 'mobile', name: '手机号' },
    { id: 'active', name: '状态' },
    { id: 'create_time', name: '创建时间' },
    { id: 'permissions_id', name: '所属组别' },
]
export const companionColumns = [
    { id: 'id', name: 'id' },
    { id: 'name', name: '名字' },
    { id: 'avatar', name: '头像' },
    { id: 'sex', name: '性别' },
    { id: 'age', name: '年龄' },
    { id: 'mobile', name: '手机号' },
    { id: 'active', name: '状态' },
    { id: 'create_time', name: '创建时间' },
]

export const orderColumns = [
    { id: 'out_trade_no', name: '订单号' },
    { id: 'hospital_name', name: '医院名称' },
    { id: 'service_name', name: '陪诊服务' },
    { id: 'companion_name', name: '陪护师' },
    { id: 'companion_mobile', name: '陪护师手机号' },
    { id: 'price', name: '总价' },
    { id: 'paidPrice', name: '已支付' },
    { id: 'starttime', name: '下单时间' },
    { id: 'trade_state', name: '订单状态' },
    { id: 'tel', name: '联系人手机号' },
]
// 订单详情的陪护师相关的列
export const userColumns = [
    { id: 'name', name: '名字' },
    { id: 'mobile', name: '手机号' },
]