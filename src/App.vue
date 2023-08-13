<template>
  <div id="app">
    <router-view />
  </div>
</template>
<style lang="scss">
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section,
summary,
time,
mark,
audio,
video,
input {
  margin: 0;
  padding: 0;
  border: none;
  outline: 0;
  // font: inherit;
  vertical-align: baseline;
  box-sizing: border-box;
  list-style: none;
}
// button{outline: none;}
html,
body,
#app {
  width: 100%;
  height: 100%;
}
body {
  font-size: 14px;
  .el-loading-mask.is-fullscreen {
    z-index: 14000 !important;  
  }
  .el-table th.gutter {
    display: table-cell !important;
  }
  button {
    outline: none;
  }
  .el-table__empty-text {
    font-size: 14px;
  }
  .el-date-table td.end-date span,
  .el-date-table td.start-date span {
    background: #3678c8;
  }
  .el-picker-panel__footer span {
    color: #3678c8;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #3678c8;
    border-color: #3678c8;
  }
  .el-textarea__inner {
    resize: none;
  }
  .el-button .el-button--default .el-button--small:hover {
    color: red;
  }
  .el-button--primary {
    background: #3678c8 !important;
    border: 0;
  }
  .el-table th > .cell {
    // height: 33px;
    line-height: 20px;
    word-wrap: break-word;
    word-break: normal;
  }
  .el-select-dropdown__item.selected {
    color: #3678c8;
    font-family: arial, sans-serif;
  }
  .el-selected-dropdown__item {
    font-family: arial, sans-serif;
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: rgba(244, 248, 254, 1);
  }
  thead .cell {
    font-size: 15px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  tbody .cell {
    font-size: 14px;
  }
  .el-table thead th {
    background: rgba(244, 248, 254, 1);
  }
  .cell {
    text-align: center;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
  }
  .page {
    text-align: center;
    margin-top: 10px;
  }
  // .devMain .el-table--small td,
  // .el-table--small th {
  //   padding: 5px 0 !important;
  // }
  .el-input__inner {
    border-radius: 7px;
  }
  .el-table th > .cell {
    font-size: 15px;
  }
  .el-table td > .cell {
    font-size: 14px;
  }
  .el-table th,
  .el-table tr {
    height: 44px;
  }
  .el-table--small td,
  .el-table--small th,
  .el-table td,
  .el-table th {
    padding: 0px !important;
  }
  .el-form-item__error {
    // top: 90%;
  }
  .el-picker-panel{
    left: 730px !important;
  }
}
</style>
