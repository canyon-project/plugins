// 不检查ts
// @ts-nocheck
import {transformSync, parse, print, printSync, parseSync} from "@swc/core";
import { detectProvider } from "./helpers/provider";

function resolveFilename(id: string): string {
  const [filename] = id.split("?vue");
  return filename;
}

export default function VitePluginInstrumentation() {
  return {
    name: "vite-plugin-instrumentation",
    enforce: "post",
    transform(code, id) {
      const serviceParams = detectProvider({
        envs: process.env,
        args: {},
      });

      try {
        // 使用 SWC 解析代码
        const ast = parseSync(code, { syntax: "ecmascript" });


// 递归遍历并修改 AST
        function removeSPropertyFromCoverageData(node) {
          if (node.type === "VariableDeclarator" && node.id.value === "coverageData") {
            if (node.init && node.init.type === "ObjectExpression") {
              // 移除 `s` 属性
              node.init.properties = node.init.properties.filter(
                  (prop) => prop.key.value !== "branchMap"&&prop.key.value !== "statementMap"&&prop.key.value !== "fnMap"
              );
            }
          }
          return node;
        }

        function traverse(node, visitor) {
          for (const key in node) {
            if (Array.isArray(node[key])) {
              node[key] = node[key].map((child) => traverse(child, visitor));
            } else if (node[key] && typeof node[key] === "object") {
              node[key] = traverse(node[key], visitor);
            }
          }
          return visitor(node);
        }
        // 将 AST 转换回代码
// 修改 AST
        const modifiedAst = traverse(ast, removeSPropertyFromCoverageData);

// 将修改后的 AST 转回代码
        const { code: outputCode } = printSync(modifiedAst);


        return {
          code: outputCode,
          // 如果需要 Source Map，可以开启以下代码：
          // map: null, // 提供 Source Map 数据
        };
      } catch (err) {
        this.error(`Failed to transform file: ${resolveFilename(id)}\n${err}`);
        return null;
      }
    },
  };
}
