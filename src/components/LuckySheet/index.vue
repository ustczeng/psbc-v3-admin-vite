<template>
  <iframe
    :id="'luckysheet_' + id"
    src="/luckysheet/luckysheet.html"
    scrolling="0"
    :style="`width:${width};height:${height};border:0`"
  />
</template>
<script lang="ts" setup>
import { ref, onMounted, onDeactivated } from "vue"

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  width: {
    type: String,
    default: "100%"
  },
  height: {
    type: String,
    default: "100%"
  }
})
const luckysheet: any = ref(null)
const bufferData: any = ref(null)
const loadData = (data: any) => {
  const frame: any = document.querySelector("#luckysheet_" + props.id)
  frame.contentWindow.location.reload()
  frame.onload = () => {
    console.info(frame.contentWindow.luckysheet)
    luckysheet.value = frame.contentWindow.luckysheet
    luckysheet.value?.create({
      container: "luckysheet",
      showinfobar: false,
      lang: "zh",
      data: data || [{}],
      // fixme:zengyiqi   允许编辑
      allowEdit: true,
      disabledEditCellBackgroundColor: ["#eeeeee"],

      allowCopy: false,

      showstatisticBar: true, //底部计数栏
      enableAddRow: true, //允许添加行
      addRowCount: 10,
      enableAddBackTop: true, //允许回到顶部

      sheetFormulaBar: false, // 公式栏

      showsheetbar: false,
      // 自定义工具栏
      showtoolbar: true,
      // showtoolbarConfig: {
      //   undoRedo: true,
      //   paintFormat: true,
      //   currencyFormat: true,
      //   percentageFormat: true,
      //   numberDecrease: false,
      //   numberIncrease: false,
      //   moreFormats: false,
      //   font: false,
      //   fontSize: false,
      //   bold: false,
      //   italic: false,
      //   strikethrough: false,
      //   underline: false,
      //   textColor: false,
      //   fillColor: false,
      //   border: false,
      //   mergeCell: false,
      //   horizontalAlignMode: false,
      //   verticalAlignMode: false,
      //   textWrapMode: false,
      //   textRotateMode: false,
      //   image: false,
      //   link: false,
      //   chart: false,
      //   postil: false,
      //   pivotTable: false,
      //   function: false,
      //   frozenMode: false,
      //   sortAndFilter: false,
      //   conditionalFormat: false,
      //   dataVerification: false,
      //   splitColumn: false,
      //   screenshot: false,
      //   findAndReplace: false,
      //   protection: false,
      //   print: false,
      // },

      cellRightClickConfig: {
        // 自定义单元格右键菜单配置
        copy: true, // 复制
        copyAs: false, // 复制为
        paste: true, // 粘贴
        insertRow: false, // 插入行
        insertColumn: false, // 插入列
        deleteRow: false, // 删除选中行
        deleteColumn: false, // 删除选中列
        deleteCell: false, // 删除单元格
        hideRow: false, // 隐藏选中行和显示选中行
        hideColumn: false, // 隐藏选中列和显示选中列
        rowHeight: false, // 行高
        columnWidth: false, // 列宽
        clear: false, // 清除内容
        matrix: false, // 矩阵操作选区
        sort: true, // 排序选区
        filter: true, // 筛选选区
        chart: false, // 图表生成
        image: false, // 插入图片
        link: false, // 插入链接
        data: false, // 数据验证
        cellFormat: false, // 设置单元格格式
        customs: []
      },

      hook: {}
    })
  }
}
const getAllSheets = () => {
  const data = luckysheet.value?.getAllSheets()
  data[0].order = 0
  return data
}

onMounted(() => {
  console.info("luckysheet")
})

onDeactivated(() => {
  console.info("luckysheet-onDeactivated")
  if (luckysheet.value) {
    bufferData.value = getAllSheets()
  }
})

defineExpose({
  loadData,
  bufferData
})
</script>
