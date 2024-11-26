import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  clean: true,
  declaration: true,
  externals: ['@swc/core'],  // 排除 @swc/core 依赖
  failOnWarn:false
});
