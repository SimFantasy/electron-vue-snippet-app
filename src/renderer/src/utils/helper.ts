import dayjs from 'dayjs'

// 格式化日期
export function formatDate(date: Date | string | number, format: string = 'YYYY-MM-DD') {
  return dayjs(date).format(format)
}
