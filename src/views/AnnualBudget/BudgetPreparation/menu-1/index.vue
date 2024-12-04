<script lang="ts" setup>
import { ref, onActivated, onDeactivated, onMounted } from "vue"
import { getDepositInterestRateApi } from "@/api/report"
import { luckysheetOptions } from "@/utils/luckysheetConfig"

defineOptions({
  name: "DepositInterestRate"
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
  if (bufferData.value) {
    loadData(bufferData.value)
  }
})

onDeactivated(() => {
  if (luckysheet.value) {
    bufferData.value = getAllSheets()
  }
})

onMounted(() => {
  getData()
})

const getData = () => {
  getDepositInterestRateApi({
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
    luckysheet.value = frame.contentWindow.luckysheet
    luckysheet.value.destroy()
    luckysheet.value.create(options)
    luckysheet.value.setCellFormat(5, 9, "customKey", {
      expand: "formula",
      showManualEdit: true,
      showAutoFill: false,
      expandFunc: "=sum(J7:J13)"
    })
    luckysheet.value.setCellFormat(15, 9, "customKey", {
      expand: "formula",
      showManualEdit: true,
      showAutoFill: false,
      expandFunc: "=sum(J17:J18)"
    })
    luckysheet.value.setRangeFormat(
      "customKey",
      { expand: "dialog", showZSManualEdit: true, showZCAutoFill: false },
      { range: "W4:W43" }
    )

    // nextTick(() => {
    //   luckysheet.value.setRangeShow([], { show: false })
    // })
  }
}

const getAllSheets = () => {
  const data = luckysheet.value.getAllSheets()
  data[0].order = 0
  return data
}

const getLuckysheetOptions = () => {
  const options = JSON.parse(JSON.stringify(luckysheetOptions))
  options.hook.cellUpdated = (r: number, c: number, oldValue: any) => {
    // 执行单元格修改后的操作
    if (oldValue.customKey?.expand == "formula" || oldValue.customKey?.expand == "dialog") {
      return
    }
    editCells.push({ r: r, c: c })
    luckysheet.value.setCellFormat(r, c, "bg", "#eeff00")
  }
  options.hook.cellMousedown = (cell: any, position: any) => {
    editCellPosition = position
    if (cell.customKey?.expand == "dialog" && cell.customKey?.showZSManualEdit) {
      dialogVisible.value = true
    }
  }
  options.cellRightClickConfig.customs.push(
    {
      title: "手工填报",
      code: "showManualEdit",
      onClick: function (clickEvent: MouseEvent, event: PointerEvent, params: any) {
        const tmpAttr =
          luckysheet.value.getAllSheets()[0].data[params.rowIndex][params.columnIndex].customKey?.expandFunc
        luckysheet.value.setCellFormat(params.rowIndex, params.columnIndex, "f", "")
        luckysheet.value.setCellValue(params.rowIndex, params.columnIndex, "")
        luckysheet.value.setCellFormat(params.rowIndex, params.columnIndex, "bg", "#ffffff")
        luckysheet.value.setCellFormat(params.rowIndex, params.columnIndex, "customKey", {
          showManualEdit: false,
          showAutoFill: true,
          expand: "formula",
          expandFunc: tmpAttr
        })
      }
    },
    {
      title: "公式填报",
      code: "showAutoFill",
      onClick: function (clickEvent: MouseEvent, event: PointerEvent, params: any) {
        const tmpAttr =
          luckysheet.value.getAllSheets()[0].data[params.rowIndex][params.columnIndex].customKey?.expandFunc
        luckysheet.value.setCellValue(params.rowIndex, params.columnIndex, tmpAttr)
        luckysheet.value.refreshFormula()
        luckysheet.value.setCellFormat(params.rowIndex, params.columnIndex, "bg", "#E7E6E6")
        luckysheet.value.setCellFormat(params.rowIndex, params.columnIndex, "customKey", {
          showManualEdit: true,
          showAutoFill: false,
          expand: "formula",
          expandFunc: tmpAttr
        })
      }
    },
    {
      title: "中收手工填报",
      code: "showZSManualEdit",
      onClick: function (clickEvent: MouseEvent, event: PointerEvent, params: any) {
        // 0、获取cell坐标
        // 1、清空数值
        luckysheet.value.setCellValue(params.rowIndex, params.columnIndex, "")
        // 2、背景色清空
        luckysheet.value.setCellFormat(params.rowIndex, params.columnIndex, "bg", "#ffffff")
        // 3、清除左击事件
        // 4、设置cell的customKey状态
        luckysheet.value.setCellFormat(params.rowIndex, params.columnIndex, "customKey", {
          showZSManualEdit: false,
          showZCAutoFill: true,
          expand: "dialog"
        })
      }
    },
    {
      title: "中收公式填报",
      code: "showZCAutoFill",
      onClick: function (clickEvent: MouseEvent, event: PointerEvent, params: any) {
        // 0、获取cell坐标
        // 1、恢复公式(清除手工填报的值)
        luckysheet.value.setCellValue(params.rowIndex, params.columnIndex, "")
        // 2、背景色恢复
        luckysheet.value.setCellFormat(params.rowIndex, params.columnIndex, "bg", "#E7E6E6")
        // 3、重新绑定左击事件
        // 4、设置cell的customKey状态
        luckysheet.value.setCellFormat(params.rowIndex, params.columnIndex, "customKey", {
          showZSManualEdit: true,
          showZCAutoFill: false,
          expand: "dialog"
        })
      }
    }
  )
  return options
}

const radio1 = ref("1")
const input1 = ref("")
const input2 = ref("")
const input3 = ref("")
const dialogVisible = ref(false)
let editCellPosition: { [key: string]: any } = {}
const handleDialogConfirm = () => {
  console.info("zz-comfirm", editCellPosition)
  luckysheet.value.setCellValue(editCellPosition.r, editCellPosition.c, 1)
  luckysheet.value.refreshFormula()
  editCellPosition = {}
  dialogVisible.value = false
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
    <el-dialog v-model="dialogVisible" title="中收测算方式" width="400px">
      <div class="mb-2 ml-4" style="height: 250px">
        <el-radio-group v-model="radio1">
          <el-radio value="1" size="large">测算方式1</el-radio>
          <el-radio value="2" size="large">测算方式2</el-radio>
          <el-radio value="3" size="large">测算方式3</el-radio>
          <el-radio value="4" size="large">测算方式4</el-radio>
          <el-radio value="5" size="large">测算方式5</el-radio>
        </el-radio-group>
        <div style="margin: 10px; padding: 10px; border-top: 1px solid #ddd">
          <div v-if="radio1 == '1'">
            <div style="margin: 10px">
              参数1: <el-input v-model="input1" style="width: 150px; margin-left: 8px" placeholder="请输入" />
            </div>
            <div style="margin: 10px">
              参数2: <el-input v-model="input2" style="width: 150px; margin-left: 8px" placeholder="请输入" />
            </div>
            <div style="margin: 10px">
              参数3: <el-input v-model="input3" style="width: 150px; margin-left: 8px" placeholder="请输入" />
            </div>
          </div>
          <div v-else-if="radio1 == '2'">
            <div style="margin: 10px">
              参数1: <el-input v-model="input1" style="width: 150px; margin-left: 8px" placeholder="请输入" />
            </div>
            <div style="margin: 10px">
              参数2: <el-input v-model="input2" style="width: 150px; margin-left: 8px" placeholder="请输入" />
            </div>
          </div>
          <div v-else-if="radio1 == '3'">
            <div style="margin: 10px">
              参数1: <el-input v-model="input1" style="width: 150px; margin-left: 8px" placeholder="请输入" />
            </div>
            <div style="margin: 10px">
              参数2: <el-input v-model="input2" style="width: 150px; margin-left: 8px" placeholder="请输入" />
            </div>
            <div style="margin: 10px">
              参数3: <el-input v-model="input3" style="width: 150px; margin-left: 8px" placeholder="请输入" />
            </div>
            <div style="margin: 10px">
              参数4: <el-input v-model="input3" style="width: 150px; margin-left: 8px" placeholder="请输入" />
            </div>
          </div>
          <div v-else-if="radio1 == '4'">
            <div style="margin: 10px">
              参数1: <el-input v-model="input1" style="width: 150px; margin-left: 8px" placeholder="请输入" />
            </div>
            <div style="margin: 10px">
              参数2: <el-input v-model="input2" style="width: 150px; margin-left: 8px" placeholder="请输入" />
            </div>
            <div style="margin: 10px">
              参数3: <el-input v-model="input3" style="width: 150px; margin-left: 8px" placeholder="请输入" />
            </div>
          </div>
          <div v-else-if="radio1 == '5'">
            <div style="margin: 10px">
              参数1: <el-input v-model="input1" style="width: 150px; margin-left: 8px" placeholder="请输入" />
            </div>
            <div style="margin: 10px">
              参数2: <el-input v-model="input2" style="width: 150px; margin-left: 8px" placeholder="请输入" />
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleDialogConfirm"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
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
