export function printSetUp(LODOP: any, data: any, code: any) {
  LODOP.PRINT_INITA('0mm', '0mm', '50mm', '70mm', '')
  LODOP.SET_PRINT_PAGESIZE(1, 500, 700, '')
  LODOP.ADD_PRINT_TEXT('2.5mm', '0mm', '50.mm', '6.6mm', '员工信息')
  LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑')
  LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12)
  LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
  LODOP.ADD_PRINT_TEXT('11mm', '0mm', '15.35mm', '5.82mm', '姓名：')
  LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑')
  LODOP.SET_PRINT_STYLEA(0, 'Alignment', 3)
  LODOP.ADD_PRINT_TEXT('17mm', '0mm', '15.35mm', '5.82mm', '性别：')
  LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑')
  LODOP.SET_PRINT_STYLEA(0, 'Alignment', 3)
  LODOP.ADD_PRINT_TEXT('23mm', '0mm', '15.35mm', '5.82mm', '工号：')
  LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑')
  LODOP.SET_PRINT_STYLEA(0, 'Alignment', 3)
  LODOP.ADD_PRINT_TEXT('29mm', '0mm', '15.35mm', '5.82mm', '部门：')
  LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑')
  LODOP.SET_PRINT_STYLEA(0, 'Alignment', 3)
  LODOP.ADD_PRINT_TEXT('35mm', '0mm', '15.35mm', '5.82mm', '电话：')
  LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑')
  LODOP.SET_PRINT_STYLEA(0, 'Alignment', 3)
  LODOP.ADD_PRINT_TEXT('11mm', '17.99mm', '31.75mm', '5.82mm', data.name)
  LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑')
  LODOP.ADD_PRINT_TEXT('17mm', '17.99mm', '31.75mm', '5.82mm', data.sex)
  LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑')
  LODOP.ADD_PRINT_TEXT('23mm', '17.99mm', '31.75mm', '5.82mm', data.username)
  LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑')
  LODOP.ADD_PRINT_TEXT(
    '29mm',
    '17.99mm',
    '31.75mm',
    '5.82mm',
    code ? code : '无'
  )
  LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑')
  LODOP.ADD_PRINT_TEXT(
    '35mm',
    '17.99mm',
    '31.75mm',
    '5.82mm',
    data.mobilePhone ? data.mobilePhone : '无'
  )
  LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑')
  LODOP.ADD_PRINT_BARCODE(
    '40mm',
    '13.76mm',
    '35mm',
    '28mm',
    'QRCode',
    '30:' + data.qrCode
  )
  LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
}
