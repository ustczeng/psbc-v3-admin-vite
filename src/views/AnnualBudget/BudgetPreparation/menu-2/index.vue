<script lang="ts" setup>
import { ref, onActivated, onDeactivated, onMounted } from "vue"
import { getLeasedAssetsApi } from "@/api/report"
import { luckysheetOptions } from "@/utils/luckysheetConfig"

defineOptions({
  name: "LeasedAssets"
})

// 定义对象类型
type Cell = {
  r: number
  c: number
}

const valueYear = ref<string>("")
const version = ref<string>("")
let editCells: Cell[] = []

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

const writeData = () => {
  console.info("写数据")
  editCells.forEach((v) => {
    // luckysheet.setCellFormat(v.r, v.c, "fc", "#000000")
    luckysheet.value.setCellFormat(v.r, v.c, "bg", "#fff")
  })
  editCells = []
  const sheetData = luckysheet.value.getAllSheets()[0]
  console.info("zz-sheetData==", sheetData)
}

const downloadData = () => {
  console.info("导出数据")
}

const luckysheet: any = ref(null)
const bufferData: any = ref(null)

onActivated(() => {
  console.log("page2-onActivated")
  if (bufferData.value) {
    // loadData(bufferData.value)
  }
})

onDeactivated(() => {
  console.info("page2-onDeactivated")
  if (luckysheet.value) {
    bufferData.value = getAllSheets()
  }
})

onMounted(() => {
  getData()
})

const getData = () => {
  getLeasedAssetsApi({
    valueYear: valueYear.value,
    version: version.value
  })
    .then((res: any) => {
      loadData(res.data)
    })
    .catch(() => {})
    .finally(() => {})
}

const loadData = (data: any) => {
  const options = getLuckysheetOptions()
  if (data) {
    options.data = data
  }
  const frame: any = document.querySelector("#luckysheet_ck")
  frame.contentWindow.location.reload()
  frame.onload = () => {
    console.info(frame.contentWindow.luckysheet)
    luckysheet.value = frame.contentWindow.luckysheet
    luckysheet.value.destroy()
    luckysheet.value.create(options)
    luckysheet.value.setRangeFormat("ct", { fa: "yyyy-MM-dd", t: "d" }, { range: "E5:F19" })
    luckysheet.value.setDataVerification(
      {
        type: "dropdown",
        type2: null,
        value1: "安徽省分行,浙江省分行,广东省分行",
        value2: "",
        prohibitInput: true
      },
      {
        range: "B5:B19"
      }
    )

    luckysheet.value.setDataVerification(
      {
        type: "date",
        type2: "bw",
        value1: "2000-01-01",
        value2: "2100-01-01",
        prohibitInput: true
      },
      {
        range: "E5:F19"
      }
    )
  }
}

const getAllSheets = () => {
  const data = luckysheet.value.getAllSheets()
  data[0].order = 0
  return data
}

const getLuckysheetOptions = () => {
  const options = JSON.parse(JSON.stringify(luckysheetOptions))
  options.hook.cellUpdated = (r: number, c: number, oldValue: object, newValue: object, isRefresh: boolean) => {
    // 执行单元格修改后的操作
    console.info(r, c, oldValue, newValue, isRefresh)
    // 执行单元格修改后的操作
    editCells.push({ r: r, c: c })

    luckysheet.value.setCellFormat(r, c, "bg", "#eeff00")
  }
  return options
}
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true">
        <el-form-item prop="valueYear" label="年份">
          <!-- <el-input v-model="searchData.username" placeholder="请输入" /> -->
          <el-date-picker v-model="valueYear" type="year" placeholder="年份" size="small" style="width: 120px" />
        </el-form-item>
        <el-form-item prop="version" label="版本">
          <el-select
            v-model="version"
            clearable
            size="small"
            placeholder="版本"
            style="width: 120px; margin-right: 10px"
          >
            <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getData">查询</el-button>
          <el-button type="primary" size="small" @click="writeData">保存</el-button>
          <el-button type="primary" size="small" @click="downloadData">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="result-wrapper">
      <iframe
        id="luckysheet_ck"
        src="/luckysheet/luckysheet.html"
        scrolling="0"
        style="width: 100%; height: 100%; border: 0"
      />
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
