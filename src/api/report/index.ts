import { request } from "@/utils/service"
import type * as Report from "./types/report"

/** 查 存款利率表 */
export function getDepositInterestRateApi(params: Report.ReportRequestData) {
  return request({
    url: "report/getDepositInterestRate",
    method: "get",
    params
  })
}
/**贷款业务收入情况表 */
export function getLoanBusinessIncomeApi(params: Report.ReportRequestData) {
  return request({
    url: "report/getLoanBusinessIncome",
    method: "get",
    params
  })
}
/**经营租入资产表 */
export function getLeasedAssetsApi(params: Report.ReportRequestData) {
  return request({
    url: "report/getLeasedAssets",
    method: "get",
    params
  })
}
/**targetCalculationMenu1*/
export function getTargetCalculationMenu1Api(params: Report.ReportRequestData) {
  return request({
    url: "report/getTargetCalculationMenu1",
    method: "get",
    params
  })
}
/**targetCalculationMenu2*/
export function getTargetCalculationMenu2Api(params: Report.ReportRequestData) {
  return request({
    url: "report/getTargetCalculationMenu2",
    method: "get",
    params
  })
}
/**targetCalculationMenu3*/
export function getTargetCalculationMenu3Api(params: Report.ReportRequestData) {
  return request({
    url: "report/getTargetCalculationMenu3",
    method: "get",
    params
  })
}
