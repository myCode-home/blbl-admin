<template>
  <div class="dashboard-container">
    <!-- 顶部卡片区域 -->
    <el-row :gutter="20" class="top-section">
      <!-- 左侧用户信息卡片 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="user-card" shadow="hover">
          <div class="user-info">
            <div class="avatar-section">
              <el-avatar :size="80" :src="userInfo.user_img" class="user-avatar" />
              <span class="username">{{ userInfo.user_name }}</span>
            </div>
            <div class="user-details">
              <div class="detail-item">
                <el-icon><User /></el-icon>
                <span>当前权限：{{ userInfo.permission }}</span>
              </div>
              <div class="detail-item">
                <el-icon><Monitor /></el-icon>
                <span>登录IP：{{ userInfo.ip }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧统计卡片 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-grid">
            <div
              v-for="(item, index) in types"
              :key="index"
              class="stat-item"
              :class="`stat-${index}`"
            >
              <div class="stat-icon">
                <el-icon :size="32">
                  <component :is="getStatIcon(index)" />
                </el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-num">{{ item.num }}</div>
                <div class="stat-label">{{ item.state }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row class="chart-section">
      <el-col :span="24">
        <el-card class="chart-card" shadow="hover" v-loading="chartLoading">
          <template #header>
            <div class="chart-header">
              <span class="chart-title">订单趋势统计</span>
              <el-radio-group v-model="chartType" size="small">
                <el-radio-button label="order_sum">订单数量</el-radio-button>
                <el-radio-button label="order_money">订单金额</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="chartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { getReportService } from '@/apis'
import { ElMessage } from 'element-plus'
import { User, Monitor, Wallet, Timer, CircleCheck, CircleClose } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// 类型定义
interface UserInfo {
  user_img: string
  user_name: string
  ip: string
  permission: string
}

interface TypeItem {
  state: string
  num: number
}

interface TypeListItem {
  date: string
  order_sum: number
  order_money: number
}

interface ReportData {
  user: UserInfo
  types: TypeItem[]
  typeList: TypeListItem[]
}

// 响应式数据
const userInfo = reactive<UserInfo>({
  user_img: '',
  user_name: '',
  ip: '',
  permission: '',
})

const types = ref<TypeItem[]>([])
const typeList = ref<TypeListItem[]>([])
const chartLoading = ref(false)
const chartType = ref<'order_sum' | 'order_money'>('order_sum')
const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

// 获取统计图标
const getStatIcon = (index: number) => {
  const icons = [Wallet, Timer, CircleCheck, CircleClose]
  return icons[index] || Wallet
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)
  updateChart()

  // 响应式处理
  window.addEventListener('resize', handleResize)
}

// 更新图表数据
const updateChart = () => {
  if (!chartInstance || typeList.value.length === 0) return

  const dates = typeList.value.map((item) => item.date)
  const values = typeList.value.map((item) =>
    chartType.value === 'order_sum' ? item.order_sum : item.order_money,
  )

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: [chartType.value === 'order_sum' ? '订单数量' : '订单金额'],
      top: 10,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLabel: {
        formatter: (value: string) => {
          const date = new Date(value)
          return `${date.getMonth() + 1}/${date.getDate()}`
        },
      },
    },
    yAxis: {
      type: 'value',
      name: chartType.value === 'order_sum' ? '订单数' : '金额(元)',
    },
    series: [
      {
        name: chartType.value === 'order_sum' ? '订单数量' : '订单金额',
        type: 'line',
        smooth: true,
        data: values,
        itemStyle: {
          color: '#409EFF',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.05)' },
          ]),
        },
      },
    ],
  }

  chartInstance.setOption(option)
}

// 窗口大小改变处理
const handleResize = () => {
  chartInstance?.resize()
}

// 获取报表数据
const fetchReportData = async () => {
  chartLoading.value = true
  try {
    const res = await getReportService()
    if (res.code === 10000) {
      const data: ReportData = res.data

      // 更新用户信息
      Object.assign(userInfo, data.user)

      // 更新统计数据
      types.value = data.types

      // 更新图表数据
      typeList.value = data.typeList

      // 等待DOM更新后初始化图表
      await nextTick()
      initChart()
    } else {
      ElMessage.error(res.msg || '获取数据失败')
    }
  } catch (error: any) {
    ElMessage.error(error.message || '获取数据失败')
  } finally {
    chartLoading.value = false
  }
}

// 监听图表类型变化
watch(chartType, () => {
  updateChart()
})

// 生命周期
onMounted(() => {
  fetchReportData()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped lang="scss">
.dashboard-container {
  box-sizing: border-box;
  padding-top: 20px;
  min-height: calc(100vh - 84px);
  overflow-x: hidden;
  width: 100%;
}

.top-section {
  margin-bottom: 20px;
}

.user-card {
  height: 100%;

  .user-info {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .avatar-section {
    display: flex;
    align-items: center;
    gap: 15px;

    .user-avatar {
      border: 3px solid #e4e7ed;
    }

    .username {
      font-size: 20px;
      font-weight: 600;
      color: #303133;
    }
  }

  .user-details {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #606266;
      font-size: 14px;

      .el-icon {
        color: #409eff;
      }
    }
  }
}

.stats-card {
  height: 100%;

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    height: 100%;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &.stat-0 {
      background: linear-gradient(135deg, #ff6b6b20, #ff6b6b10);
      .stat-icon {
        color: #ff6b6b;
        background: #ff6b6b20;
      }
    }

    &.stat-1 {
      background: linear-gradient(135deg, #4ecdc420, #4ecdc410);
      .stat-icon {
        color: #4ecdc4;
        background: #4ecdc420;
      }
    }

    &.stat-2 {
      background: linear-gradient(135deg, #45b7d120, #45b7d110);
      .stat-icon {
        color: #45b7d1;
        background: #45b7d120;
      }
    }

    &.stat-3 {
      background: linear-gradient(135deg, #96ceb420, #96ceb410);
      .stat-icon {
        color: #96ceb4;
        background: #96ceb420;
      }
    }

    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-content {
      flex: 1;

      .stat-num {
        font-size: 24px;
        font-weight: 700;
        color: #303133;
        line-height: 1.2;
      }

      .stat-label {
        font-size: 13px;
        color: #909399;
        margin-top: 4px;
      }
    }
  }
}

.chart-section {
  width: 100%;
  overflow: hidden;

  .chart-card {
    width: 100%;

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;

      .chart-title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }
    }

    .chart-container {
      width: 100%;
      height: 400px;
      overflow: hidden;
    }
  }
}

// 响应式适配
@media (max-width: 768px) {
  .dashboard-container {
    padding: 10px;
  }

  .stats-card {
    .stats-grid {
      grid-template-columns: 1fr;
      gap: 15px;
    }
  }

  .chart-container {
    height: 300px !important;
    min-width: 0;
  }
}

// 防止 el-row 导致的溢出
:deep(.el-row) {
  margin-right: 0 !important;
  margin-left: 0 !important;
}

:deep(.el-col) {
  padding-right: 10px !important;
  padding-left: 10px !important;
}
</style>
