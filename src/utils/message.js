import { Message } from "element-ui";
let messageInstance = null;
let mainMessage = function DoneMessage(options) {
  //如果弹窗已存在先关闭
  // Close the popover if it already exists
  //Close the popover if it already exists
  if (messageInstance) {
    messageInstance.close();
  }
  messageInstance = Message(options);
}
let arr = ['success', 'warning', 'info', 'error'];
arr.forEach(function (type) {
  mainMessage[type] = function (options) {
    if (typeof options === 'string') {
      options = {
        message: options
      };
    }
    options.type = type;
    return mainMessage(options);
  };
});
export const message = mainMessage;