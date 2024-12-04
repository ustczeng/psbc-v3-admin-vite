<script lang="ts" setup>
import LuckySheet from "@/components/LuckySheet/index.vue"
import { ref, onActivated, onDeactivated, onMounted } from "vue"
// import { dataDemo} from './dataDemo.js'

defineOptions({
  name: "LeasedAssets"
})

const valueYear = ref<string>("")
const selectValue = ref<string>("")
const selectOptions = [
  {
    value: "Option1",
    label: "编制版本一"
  },
  {
    value: "Option2",
    label: "编制版本二"
  },
  {
    value: "Option3",
    label: "编制版本三"
  },
  {
    value: "Option4",
    label: "编制版本四"
  },
  {
    value: "Option5",
    label: "编制最终版"
  }
]

const searchData = () => {
  console.info("查数据")
}

const writeData = () => {
  console.info("写数据")
}

const downloadData = () => {
  console.info("导出数据")
}

// const uploadData = () => {
//   console.info("导入数据")
// }

// const save = () => {
//   console.info("前端保存")
// }

// const downloadExcel = () => {
//   console.info("前端下载")
// }

const luckysheetDemo = ref(null)

onActivated(() => {
  // console.log("page3-onActivated",luckysheetDemo.value?.bufferData)
  // if(luckysheetDemo.value?.bufferData){
  //   luckysheetDemo.value?.loadData(luckysheetDemo.value?.bufferData.value)
  // }else{
  //   luckysheetDemo.value?.loadData(dataDemo)
  // }
})

onDeactivated(() => {
  console.info("page3-onDeactivated")
})

onMounted(() => {
  // fixme:zengyiqi
  // const dataServeGlobal = await getdata()
  // console.log('zz-getdata mount', dataServeGlobal)
  console.info(luckysheetDemo.value)
  // await nextTick(); // 等待下一个DOM更新循环结束
  // luckysheetDemo.value?.loadData(dataDemo)
})
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="valueYear" label="年份">
          <!-- <el-input v-model="searchData.username" placeholder="请输入" /> -->
          <el-date-picker v-model="valueYear" type="year" placeholder="年份" size="small" style="width: 120px" />
        </el-form-item>
        <el-form-item prop="selectValue" label="版本">
          <el-select
            v-model="selectValue"
            clearable
            size="small"
            placeholder="版本"
            style="width: 120px; margin-right: 10px"
          >
            <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="searchData">查询</el-button>
          <el-button type="primary" size="small" @click="writeData">保存</el-button>
          <el-button type="primary" size="small" @click="downloadData">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="result-wrapper">
      <LuckySheet id="LeasedAssets" ref="luckysheetDemo" height="100%" width="100%" />
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  display: flex;
  flex-direction: column;
}
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}
.result-wrapper {
  flex: 1;
  :deep(.el-card__body) {
    height: 100%;
  }
}
</style>
