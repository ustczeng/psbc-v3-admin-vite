import { MockMethod } from "vite-plugin-mock"
import data1 from "./demoData/depositInterestRate.json"
import data2 from "./demoData/loanBusinessIncome.json"
import data3 from "./demoData/leasedAssets.json"
import data4 from "./demoData/targetCalculationMenu1.json"
import data5 from "./demoData/targetCalculationMenu2.json"
import data6 from "./demoData/targetCalculationMenu3.json"
export default [
  {
    url: "/api/v1/report/getDepositInterestRate",
    method: "get",
    response: () => {
      return {
        code: 0,
        data: data1,
        message: "成功"
      }
    }
  },
  {
    url: "/api/v1/report/getLoanBusinessIncome",
    method: "get",
    response: () => {
      return {
        code: 0,
        data: data2,
        message: "成功"
      }
    }
  },
  {
    url: "/api/v1/report/getLeasedAssets",
    method: "get",
    response: () => {
      return {
        code: 0,
        data: data3,
        message: "成功"
      }
    }
  },
  {
    url: "/api/v1/report/getTargetCalculationMenu1",
    method: "get",
    response: () => {
      return {
        code: 0,
        data: data4,
        message: "成功"
      }
    }
  },
  {
    url: "/api/v1/report/getTargetCalculationMenu2",
    method: "get",
    response: () => {
      return {
        code: 0,
        data: data5,
        message: "成功"
      }
    }
  },
  {
    url: "/api/v1/report/getTargetCalculationMenu3",
    method: "get",
    response: () => {
      return {
        code: 0,
        data: data6,
        message: "成功"
      }
    }
  }
] as MockMethod[]
