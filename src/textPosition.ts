// 导入 EOL（End of Line，行尾标识符）和 Position、TextDocumentContentChangeEvent 类型
import { EOL } from "os";
import { Position, TextDocumentContentChangeEvent } from "vscode";

// 定义 getCurrentPosition 函数
export default function getCurrentPosition(
  change: TextDocumentContentChangeEvent
): Position {
  // 计算文本更改（行数变化、字符数变化等）
  const {
    linesDelta,
    characterDelta,
    lastLineLength,
  } = calculateChangeDimensions(change);

  // 根据计算结果返回新的光标位置
  return change.range.start.translate(
    linesDelta,
    linesDelta === 0
      ? characterDelta
      : -change.range.start.character + lastLineLength
  );
}

// 定义 calculateChangeDimensions 函数，用于计算文本更改
function calculateChangeDimensions(
  change: TextDocumentContentChangeEvent
): {
  linesDelta: number;
  characterDelta: number;
  lastLineLength: number;
} {
  // 获取文本的行数组
  const lines = getLines(change.text);
  // 计算行数变化
  let linesDelta = lines.length - 1;
  // 处理自动插入新行的情况，例如当 VSCode 自动插入函数的闭合括号时
  if (isEmptyLinesWithNewlineAutoInsert(change)) linesDelta -= 1;
  // 计算字符数变化
  const characterDelta = change.text.length;
  // 计算最后一行的长度
  const lastLineLength = lines[linesDelta].length;

  // 返回计算结果
  return {
    linesDelta,
    characterDelta,
    lastLineLength,
  };
}

// 定义 isOnlyWhitespaces 函数，用于判断字符串是否只包含空白字符
export function isOnlyWhitespaces(text: string): boolean {
  return text.trim() === "";
}

// 定义 isEmptyLinesWithNewlineAutoInsert 函数，用于判断是否是由于自动插入换行符而产生的空行
export function isEmptyLinesWithNewlineAutoInsert(
  change: TextDocumentContentChangeEvent
): boolean {
  return getLines(change.text).length > 2 && isOnlyWhitespaces(change.text);
}

// 定义 getLines 函数，用于根据行尾标识符将文本分割成行数组
function getLines(text: string) {
  return text.split(EOL);
}