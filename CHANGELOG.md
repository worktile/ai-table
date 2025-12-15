# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.4.7](https://github.com/worktile/ai-table/compare/0.4.6...0.4.7) (2025-12-15)


### Bug Fixes

* **grid:** should not override checkbox transformCellValue to string ([#836](https://github.com/worktile/ai-table/issues/836)) ([60ff43a](https://github.com/worktile/ai-table/commit/60ff43a3bf778e370ba43800772945f2f700c555))
* **grid:** when the progress is in frozen column, after scrolling the non-frozen area a certain distance to the left and click progress, the result is inaccurate ([#837](https://github.com/worktile/ai-table/issues/837)) ([d287e12](https://github.com/worktile/ai-table/commit/d287e12f6b7e1563c7622a3ee0be1c4e6b77278c))



## [0.4.6](https://github.com/worktile/ai-table/compare/0.4.5...0.4.6) (2025-12-10)


### Bug Fixes

* #WIK-19476 【评分、进度】评分、进度在第一列时，评分和进度的交互处理 ([#827](https://github.com/worktile/ai-table/issues/827)) ([75064f8](https://github.com/worktile/ai-table/commit/75064f8506a4a50223299b4a395b040fee9bd0f7)), closes [#WIK-19476](https://github.com/worktile/ai-table/issues/WIK-19476)
* #WIK-19506 单元格鼠标在移入 hover 和 移出切换时有时候会失效（进度、评分、其它类型） ([#828](https://github.com/worktile/ai-table/issues/828)) ([7720fb7](https://github.com/worktile/ai-table/commit/7720fb7a922c4a2969e7d6a65202e0abc002cee0)), closes [#WIK-19506](https://github.com/worktile/ai-table/issues/WIK-19506)
* #WIK-19519 在有行展开功能时，底部统计的索引列分隔符位置不对 ([#829](https://github.com/worktile/ai-table/issues/829)) ([9902c3b](https://github.com/worktile/ai-table/commit/9902c3b680d9340fb06b59c02bbb6140cd2aab01)), closes [#WIK-19519](https://github.com/worktile/ai-table/issues/WIK-19519)
* #WIK-19540 unnamed record not displayed ([#831](https://github.com/worktile/ai-table/issues/831)) ([14e6c09](https://github.com/worktile/ai-table/commit/14e6c091724d040703125e3ea7ae9acd05f0175e)), closes [#WIK-19540](https://github.com/worktile/ai-table/issues/WIK-19540)


### Features

* #WIK-19457 【下拉多选设置】行详情-添加多选字段，弹框中需要展示 数据项的配置 ([#830](https://github.com/worktile/ai-table/issues/830)) ([23c405b](https://github.com/worktile/ai-table/commit/23c405be30c6a27449edd754be471327b08eeca9)), closes [#WIK-19457](https://github.com/worktile/ai-table/issues/WIK-19457)



## [0.4.5](https://github.com/worktile/ai-table/compare/0.4.4...0.4.5) (2025-12-01)


### Bug Fixes

* #WIK-19432 【Prod】多选下拉超过最大高度后无法显示更多数据 ([#815](https://github.com/worktile/ai-table/issues/815)) ([1071552](https://github.com/worktile/ai-table/commit/10715522f43353671d7695a041d4c0844bdba434)), closes [#WIK-19432](https://github.com/worktile/ai-table/issues/WIK-19432)
* #WIK-19432 【Prod】下拉多选超出高度后再删除重写添加最大高度未清除导致无法查看更多内容 ([#821](https://github.com/worktile/ai-table/issues/821)) ([d744017](https://github.com/worktile/ai-table/commit/d744017c2e1164e9739b065b981ae6280824c3e6)), closes [#WIK-19432](https://github.com/worktile/ai-table/issues/WIK-19432)
* #WIK-19458 【列填充手柄】行详情-激活了新的单元格，列填充手柄没有更新到新激活的单元格右下角 ([#824](https://github.com/worktile/ai-table/issues/824)) ([d1c74f7](https://github.com/worktile/ai-table/commit/d1c74f71cc42cce9beed2c555808116e7d4a9b59)), closes [#WIK-19458](https://github.com/worktile/ai-table/issues/WIK-19458)
* #WIK-19475 行展开按钮显示不出来 ([#825](https://github.com/worktile/ai-table/issues/825)) ([3e65c7c](https://github.com/worktile/ai-table/commit/3e65c7c00ec36ce3f600fc05b278c9313b1ea850)), closes [#WIK-19475](https://github.com/worktile/ai-table/issues/WIK-19475)
* 覆盖slide默认不换行为换行 ([#823](https://github.com/worktile/ai-table/issues/823)) ([c4dcfb9](https://github.com/worktile/ai-table/commit/c4dcfb9cca97c82f66a2553bb05e899bb8c49c10))
* WIK-19415关联字段图标没有显示 ([#813](https://github.com/worktile/ai-table/issues/813)) ([c78ac4e](https://github.com/worktile/ai-table/commit/c78ac4e9008ccaec75d1454226b6fe6a23f15dde))


### Features

* #WIK-19380 弹窗详情多语言 ([#816](https://github.com/worktile/ai-table/issues/816)) ([28d9317](https://github.com/worktile/ai-table/commit/28d931750570d87d71e6447151138d5dd1f54098)), closes [#WIK-19380](https://github.com/worktile/ai-table/issues/WIK-19380)
* #WIK-19381 展开图标固定渲染在最左侧 ([#819](https://github.com/worktile/ai-table/issues/819)) ([2018ffc](https://github.com/worktile/ai-table/commit/2018ffc54ce4d1bb7b066a95b10c8b157be4e2dd)), closes [#WIK-19381](https://github.com/worktile/ai-table/issues/WIK-19381)
* **grid:** generate record detail title by transformToCellText function ([#818](https://github.com/worktile/ai-table/issues/818)) ([3f3013a](https://github.com/worktile/ai-table/commit/3f3013ad0a91aa7ccace20bf7d448e994b422d92))



## [0.4.4](https://github.com/worktile/ai-table/compare/0.4.3...0.4.4) (2025-11-26)


### Bug Fixes

* 修复canCloseSlide 逻辑错误 ([#811](https://github.com/worktile/ai-table/issues/811)) ([4004ab3](https://github.com/worktile/ai-table/commit/4004ab351445e7c5b8e16ea9e27bcb88e56dba6e))
* 详情字段更多菜单显示更新问题 ([#810](https://github.com/worktile/ai-table/issues/810)) ([1d7af02](https://github.com/worktile/ai-table/commit/1d7af02a919133b8fd443fb323f0c8867f86811a))


### Features

* #WIK-19418 详情弹窗优化字段颜色、更多action ([#809](https://github.com/worktile/ai-table/issues/809)) ([214caac](https://github.com/worktile/ai-table/commit/214caacadc114af55e0ffc7fefe98e60cea3a3c2)), closes [#WIK-19418](https://github.com/worktile/ai-table/issues/WIK-19418)
* #WIK-19431 支持打开详情配置参数，主要支持 Silde 配置等 ([#808](https://github.com/worktile/ai-table/issues/808)) ([f98a827](https://github.com/worktile/ai-table/commit/f98a827dbfe76b24e19c844d9c307022454a9711)), closes [#WIK-19431](https://github.com/worktile/ai-table/issues/WIK-19431) [#WIK-19431](https://github.com/worktile/ai-table/issues/WIK-19431)



## [0.4.3](https://github.com/worktile/ai-table/compare/0.4.2...0.4.3) (2025-11-25)


### Bug Fixes

* #WIK-19414 只读模式无法弹出详情，新增字段没有隐藏 ([#803](https://github.com/worktile/ai-table/issues/803)) ([7483c5a](https://github.com/worktile/ai-table/commit/7483c5a72e09ea4d6545d6be9f606b6907048b77)), closes [#WIK-19414](https://github.com/worktile/ai-table/issues/WIK-19414)


### Features

* upgrade angular to 20 ([#800](https://github.com/worktile/ai-table/issues/800)) ([9579664](https://github.com/worktile/ai-table/commit/95796647f5af02e5983cab7a66775f234108fe99))



## [0.4.2](https://github.com/worktile/ai-table/compare/0.4.1...0.4.2) (2025-11-21)


### Bug Fixes

* #WIK-19392 修复动态创建编辑类型错误，支持 injector 参数，以及弹窗详情每个字段都有新增问题 ([#796](https://github.com/worktile/ai-table/issues/796)) ([8b8b649](https://github.com/worktile/ai-table/commit/8b8b6494af2b3aaef6c8a23a6a6369f9800af5c8)), closes [#WIK-19392](https://github.com/worktile/ai-table/issues/WIK-19392)


### Features

* #WIK-19367 ai-table 支持复制行 ([#794](https://github.com/worktile/ai-table/issues/794)) ([9e92416](https://github.com/worktile/ai-table/commit/9e92416014ecfe67803b4c719cb4ca87094820d2)), closes [#WIK-19367](https://github.com/worktile/ai-table/issues/WIK-19367) [#WIK-19367](https://github.com/worktile/ai-table/issues/WIK-19367) [#WIK-19367](https://github.com/worktile/ai-table/issues/WIK-19367)
* #WIK-19388 详情字段图标渲染，更多图标垂直显示 ([#801](https://github.com/worktile/ai-table/issues/801)) ([8113ec4](https://github.com/worktile/ai-table/commit/8113ec48f6bd2fa1c09c79c8b942813943418bcf)), closes [#WIK-19388](https://github.com/worktile/ai-table/issues/WIK-19388)
* **grid:** #WIK-19176 支持打开 Record 详情和编辑 ([#787](https://github.com/worktile/ai-table/issues/787)) ([a47368f](https://github.com/worktile/ai-table/commit/a47368fd15a1ab185863e8c8ce3e130e83462475)), closes [#WIK-19176](https://github.com/worktile/ai-table/issues/WIK-19176)



## [0.4.1](https://github.com/worktile/ai-table/compare/0.4.0...0.4.1) (2025-11-17)


### Bug Fixes

* #WIK-19348 链接编辑图标位置布局中 ([#792](https://github.com/worktile/ai-table/issues/792)) ([3f12190](https://github.com/worktile/ai-table/commit/3f121907ef92024fd59193248587065125ddee78)), closes [#WIK-19348](https://github.com/worktile/ai-table/issues/WIK-19348)



# [0.4.0](https://github.com/worktile/ai-table/compare/0.4.0-2...0.4.0) (2025-11-14)


### Bug Fixes

* #WIK-19307 双击进入编辑在非文字的区域双击交互异常，没有进入编辑，而是取消选中 ([#785](https://github.com/worktile/ai-table/issues/785)) ([3c6b07c](https://github.com/worktile/ai-table/commit/3c6b07c66db7a335604d289dbf6775b0aec12756)), closes [#WIK-19307](https://github.com/worktile/ai-table/issues/WIK-19307)
* #WIK-19317 多行文本渲染有问题，字体过小 ([#788](https://github.com/worktile/ai-table/issues/788)) ([01a2b1a](https://github.com/worktile/ai-table/commit/01a2b1a0fa25079bb041137916981afbd155c007)), closes [#WIK-19317](https://github.com/worktile/ai-table/issues/WIK-19317)
* #WIK-19323 位置不对的黄色提示块，样式需要看下（也要随之变高） ([#789](https://github.com/worktile/ai-table/issues/789)) ([8767890](https://github.com/worktile/ai-table/commit/87678907b8108dc48b218152025f0629313f40be)), closes [#WIK-19323](https://github.com/worktile/ai-table/issues/WIK-19323)
* #WIK-19337 有分组的情况下，修改单元格内容（单选），界面直接刷新了，未提示位置变动 ([#790](https://github.com/worktile/ai-table/issues/790)) ([ec9262e](https://github.com/worktile/ai-table/commit/ec9262ef4d1b6cfc75843d6a25f7a9fa77a8680b)), closes [#WIK-19337](https://github.com/worktile/ai-table/issues/WIK-19337)


### Features

* hidden input number step controls ([#786](https://github.com/worktile/ai-table/issues/786)) ([ddb1a03](https://github.com/worktile/ai-table/commit/ddb1a03f0d3ddf20390765d9cc5ee577f71dc638))



# [0.4.0-2](https://github.com/worktile/ai-table/compare/0.4.0-1...0.4.0-2) (2025-11-11)


### Bug Fixes

* #WIK-19306 行高接入Wiki后编辑态的高度不对 ([#783](https://github.com/worktile/ai-table/issues/783)) ([d50470c](https://github.com/worktile/ai-table/commit/d50470c0f311426b9790d5a78ea537537bd4e1b0)), closes [#WIK-19306](https://github.com/worktile/ai-table/issues/WIK-19306) [#WIK-19306](https://github.com/worktile/ai-table/issues/WIK-19306)



# [0.4.0-1](https://github.com/worktile/ai-table/compare/0.4.0-0...0.4.0-1) (2025-11-11)


### Bug Fixes

* #WIK-19261 多选编辑状态高度没有撑开，双击文本编辑和下拉选项闪烁问题 ([#772](https://github.com/worktile/ai-table/issues/772)) ([6750fbf](https://github.com/worktile/ai-table/commit/6750fbf7158630b0844b020f59db27c82cffe1c6)), closes [#WIK-19261](https://github.com/worktile/ai-table/issues/WIK-19261) [#WIK-19261](https://github.com/worktile/ai-table/issues/WIK-19261) [xws/#WIK-19261](https://github.com/worktile/ai-table/issues/WIK-19261)
* #WIK-19262 单行文本-单击展开内容多时无法滚动 ([#775](https://github.com/worktile/ai-table/issues/775)) ([4b97e9a](https://github.com/worktile/ai-table/commit/4b97e9a7b27ee75f7a837452a26354b57f5c6a1c)), closes [#WIK-19262](https://github.com/worktile/ai-table/issues/WIK-19262)
* #WIK-19270 设置行高后-分组的内容渲染不对 ([8ad1369](https://github.com/worktile/ai-table/commit/8ad13695450c9ec88b7c5e993e6f6f5f4b9172b4)), closes [#WIK-19270](https://github.com/worktile/ai-table/issues/WIK-19270)



# [0.4.0-0](https://github.com/worktile/ai-table/compare/0.3.3...0.4.0-0) (2025-11-04)


### Bug Fixes

* #WIK-19248 链接-hover点击区域过宽 ([#763](https://github.com/worktile/ai-table/issues/763)) ([ed0880d](https://github.com/worktile/ai-table/commit/ed0880dd9f99dc65e02674a498daac98dc5dd0da)), closes [#WIK-19248](https://github.com/worktile/ai-table/issues/WIK-19248)


### Features

* #WIK-19211 ai-table cell支持多行渲染方案 ([#746](https://github.com/worktile/ai-table/issues/746)) ([148331f](https://github.com/worktile/ai-table/commit/148331f7cc4d143589016840b2310f2c0a200ea0)), closes [#WIK-19211](https://github.com/worktile/ai-table/issues/WIK-19211) [#WIK-19211](https://github.com/worktile/ai-table/issues/WIK-19211) [#WIK-19211](https://github.com/worktile/ai-table/issues/WIK-19211)
* #WIK-19212 表头、分组组行高固定 ([#749](https://github.com/worktile/ai-table/issues/749)) ([eb5d765](https://github.com/worktile/ai-table/commit/eb5d7654ced63b8296c48c8b45a7a401705d7360)), closes [#WIK-19212](https://github.com/worktile/ai-table/issues/WIK-19212)
* #WIK-19213 行高信息协作保存同步 ([#766](https://github.com/worktile/ai-table/issues/766)) ([f2aaf38](https://github.com/worktile/ai-table/commit/f2aaf382fe2f6e9dac86ec834532de5440314da4)), closes [#WIK-19213](https://github.com/worktile/ai-table/issues/WIK-19213) [#WIK-19213](https://github.com/worktile/ai-table/issues/WIK-19213) [#WIK-19213](https://github.com/worktile/ai-table/issues/WIK-19213)
* #WIK-19214 文本、链接、数字字段静态和cover渲染支持多行 ([#757](https://github.com/worktile/ai-table/issues/757)) ([33abfb0](https://github.com/worktile/ai-table/commit/33abfb0d9ad39de3280c8735027f587d0888ce87)), closes [#WIK-19214](https://github.com/worktile/ai-table/issues/WIK-19214) [#WIK-19214](https://github.com/worktile/ai-table/issues/WIK-19214) [#WIK-19214](https://github.com/worktile/ai-table/issues/WIK-19214)
* #WIK-19219 文本、选择、数字、日期、链接dom的多行编辑 ([#764](https://github.com/worktile/ai-table/issues/764)) ([5abc3f3](https://github.com/worktile/ai-table/commit/5abc3f320fc5922030b48488c306e4f5d42c47cf)), closes [#WIK-19219](https://github.com/worktile/ai-table/issues/WIK-19219)
* #WIK-19220 附件支持多行（hover时的+处理） ([#761](https://github.com/worktile/ai-table/issues/761)) ([3c0ab5a](https://github.com/worktile/ai-table/commit/3c0ab5a3bfba4cf4ed049937e0592f8a0c658a62)), closes [#WIK-19220](https://github.com/worktile/ai-table/issues/WIK-19220)
* #WIK-19239 cell多行渲染-支持自定义布局元素 ([#755](https://github.com/worktile/ai-table/issues/755)) ([4583e1f](https://github.com/worktile/ai-table/commit/4583e1fd480746512389440de812ff827844c40f)), closes [#WIK-19239](https://github.com/worktile/ai-table/issues/WIK-19239) [#WIK-19239](https://github.com/worktile/ai-table/issues/WIK-19239) [#WIK-19239](https://github.com/worktile/ai-table/issues/WIK-19239) [#WIK-19239](https://github.com/worktile/ai-table/issues/WIK-19239) [#WIK-19239](https://github.com/worktile/ai-table/issues/WIK-19239)
* #WIK-19243 文本、链接、数字字段-文本类多行cover时与原生canvas换行不一致 ([#768](https://github.com/worktile/ai-table/issues/768)) ([6931e32](https://github.com/worktile/ai-table/commit/6931e32b9eaac8579b375d217410f277078eb691)), closes [#WIK-19243](https://github.com/worktile/ai-table/issues/WIK-19243)
* #WIK-19246 多行文本cover支持多行渲染 ([#762](https://github.com/worktile/ai-table/issues/762)) ([63190d2](https://github.com/worktile/ai-table/commit/63190d22753214b82fe7fc1fe41921073a88e741)), closes [#WIK-19246](https://github.com/worktile/ai-table/issues/WIK-19246)
* aiTableTextConfigToKonvaConfig support wrap and ellipsis ([#767](https://github.com/worktile/ai-table/issues/767)) ([0729d4b](https://github.com/worktile/ai-table/commit/0729d4bc87eec6c805e7e48c1ce64ecb8918ae5d))
* **grid:** add enum AITableRowHeight ([#756](https://github.com/worktile/ai-table/issues/756)) ([91376c1](https://github.com/worktile/ai-table/commit/91376c123f6c0b0b5bb0aae210a27fa210841f2c))
* **grid:** support custom cell height for progress and rate ([#760](https://github.com/worktile/ai-table/issues/760)) ([5f57498](https://github.com/worktile/ai-table/commit/5f574983fb133580c4985b7320863b0ba7517558))
* **grid:** the cell content supports adaptive height for custom field render ([#765](https://github.com/worktile/ai-table/issues/765)) ([c0344fe](https://github.com/worktile/ai-table/commit/c0344fe3ce4bc0d5daa093e962660b0500835c8d))
* **member:** member field renderer support multiple rowHeight ([#758](https://github.com/worktile/ai-table/issues/758)) ([498e72d](https://github.com/worktile/ai-table/commit/498e72d74533a0b5f9207092fd9255a1c01c310c))
* **state:** support use ai-table-grid without views and add editable example ([#751](https://github.com/worktile/ai-table/issues/751)) ([a039a32](https://github.com/worktile/ai-table/commit/a039a32f6f2a5d7663f34269e60a210c3edca954))



## [0.3.3](https://github.com/worktile/ai-table/compare/0.3.2...0.3.3) (2025-10-24)


### Bug Fixes

* **grid:** need to stop events that are not triggered in the ai-table ([5e204b9](https://github.com/worktile/ai-table/commit/5e204b97c0d9e5ea81c24b68d35ffa3c53431f20))



## [0.3.2](https://github.com/worktile/ai-table/compare/0.3.1...0.3.2) (2025-10-22)


### Bug Fixes

* **positions:** fix error when items is empty #WIK-19159 ([#737](https://github.com/worktile/ai-table/issues/737)) ([8c0e2c4](https://github.com/worktile/ai-table/commit/8c0e2c4f2c406f79f7aeb3aa05d71c3fb513db0a)), closes [#WIK-19159](https://github.com/worktile/ai-table/issues/WIK-19159) [#WIK-19159](https://github.com/worktile/ai-table/issues/WIK-19159) [#WIK-19159](https://github.com/worktile/ai-table/issues/WIK-19159)



## [0.3.1](https://github.com/worktile/ai-table/compare/0.3.0...0.3.1) (2025-10-22)


### Bug Fixes

* #WIK-19169 【AITable】出现筛选提示的时候，左侧线有问题 ([2d3767e](https://github.com/worktile/ai-table/commit/2d3767e80b4eecffdb1f366025647ce70addb496)), closes [#WIK-19169](https://github.com/worktile/ai-table/issues/WIK-19169)
* **grid:** fix over max limit ([2a90992](https://github.com/worktile/ai-table/commit/2a90992ce4fa953e0943f5291440599cf8126b8d))
* **state:** #WIK-19160 【AITable】新建一个新表格，复制视图，位置不对 ([e538901](https://github.com/worktile/ai-table/commit/e5389010a32adf8f0188e3452c40aba3df05bd16)), closes [#WIK-19160](https://github.com/worktile/ai-table/issues/WIK-19160)
* **state:** #WIK-19175 移动列，冻结列自动调整丢失 ([#732](https://github.com/worktile/ai-table/issues/732)) ([cf2c156](https://github.com/worktile/ai-table/commit/cf2c156d00cd564778ca7c837b4687b278a1b491)), closes [#WIK-19175](https://github.com/worktile/ai-table/issues/WIK-19175)


### Features

* **grid:** check for duplicate naming and maximum column limits when calling addFields directly ([ad8e579](https://github.com/worktile/ai-table/commit/ad8e579036c7845d290b681f12e0ed8d53732589))



# [0.3.0](https://github.com/worktile/ai-table/compare/0.2.5...0.3.0) (2025-10-15)


### Bug Fixes

* #WIK-19161 【AITable】单行文本单击选中的框会取消cell的选中状态 ([9c5fb3b](https://github.com/worktile/ai-table/commit/9c5fb3b4fcd118d2e8a7046649f535d73b0562bc)), closes [#WIK-19161](https://github.com/worktile/ai-table/issues/WIK-19161)


### Features

* **grid:** support copy and paste under http ([#726](https://github.com/worktile/ai-table/issues/726)) ([c2eb4c6](https://github.com/worktile/ai-table/commit/c2eb4c6259c32d86989a5cdd1c2ec932aa2f6b02))



## [0.2.5](https://github.com/worktile/ai-table/compare/0.2.4...0.2.5) (2025-10-09)


### Bug Fixes

* #WIK-18817 【AITable】双击文本 Cell 如果点击的位置靠下一点，无法进入编辑，反而会切换选中状态 ([#718](https://github.com/worktile/ai-table/issues/718)) ([603d625](https://github.com/worktile/ai-table/commit/603d6256121b9810041ffee28aef429d159bfa1d)), closes [#WIK-18817](https://github.com/worktile/ai-table/issues/WIK-18817)
* #WIK-18819 【AITable】文本内容编辑过程中，按 Ctrl + Z 撤回应当优先撤回文本内容，现在是撤回的表格新建行，交互有些不符合预期 ([0ac87aa](https://github.com/worktile/ai-table/commit/0ac87aaf1edb2865cab2a9fb1db73fe0a1e301ce)), closes [#WIK-18819](https://github.com/worktile/ai-table/issues/WIK-18819)
* #WIK-18962 【AITable】关联产品需求/工单/工作项/测试用例/目标/页面等，展开后，拖拽手柄位置不对；滚动单元格内容或者滚动表格内容，控制台报错 ([#717](https://github.com/worktile/ai-table/issues/717)) ([e5284a8](https://github.com/worktile/ai-table/commit/e5284a8871c1d271f4ae669e78ac5bfa348d5a2e)), closes [#WIK-18962](https://github.com/worktile/ai-table/issues/WIK-18962)
* #WIK-19116 当第一列字段是非分组字段时，分组内容过长时会被分组统计遮罩，没有出现... ([#714](https://github.com/worktile/ai-table/issues/714)) ([ba1b200](https://github.com/worktile/ai-table/commit/ba1b2008a9821a73cb784659b9bf6f8a7796884e)), closes [#WIK-19116](https://github.com/worktile/ai-table/issues/WIK-19116)
* #WIK-19138 字段拖拽异常，afterItemId 异常，不是目标的 id ([ff81309](https://github.com/worktile/ai-table/commit/ff81309fb7cd08ad0bbd62c590c54648c920a932)), closes [#WIK-19138](https://github.com/worktile/ai-table/issues/WIK-19138)
* find max position item when both afterItemId and beforeItemId are undefined ([#722](https://github.com/worktile/ai-table/issues/722)) ([0b8f3f0](https://github.com/worktile/ai-table/commit/0b8f3f014d82d03dacd8f249eee005856e3426b7))


### Features

* #WIK-19126 移动 Field 位置支持精度控制 ([#721](https://github.com/worktile/ai-table/issues/721)) ([efc6b81](https://github.com/worktile/ai-table/commit/efc6b81c3ccd93615c72f58fba5d28a14909b479)), closes [#WIK-19126](https://github.com/worktile/ai-table/issues/WIK-19126) [#WIK-19126](https://github.com/worktile/ai-table/issues/WIK-19126)
* **action:** support reset all records position on precision is not enough #WIK-19122 ([#715](https://github.com/worktile/ai-table/issues/715)) ([1e958f7](https://github.com/worktile/ai-table/commit/1e958f784f07246c4e6e5381541f8fde3b9f9c18)), closes [#WIK-19122](https://github.com/worktile/ai-table/issues/WIK-19122)
* add position utils and apply to record's adding, moving and sorting. ([#709](https://github.com/worktile/ai-table/issues/709)) ([46a53b9](https://github.com/worktile/ai-table/commit/46a53b904c0386a36f6edaeac1a2b8ef910d9d3f))
* support reset all fields position ([#719](https://github.com/worktile/ai-table/issues/719)) ([2048514](https://github.com/worktile/ai-table/commit/204851461a4237f60091eae30356b36bea6380ff))



## [0.2.4](https://github.com/worktile/ai-table/compare/0.2.3...0.2.4) (2025-09-26)


### Bug Fixes

* #WIK-19010 【分组】分组的统计指标弹出菜单不要遮挡当前已选择显示的指标（有的遮住有的没遮住，看下是否还有优化空间） ([#712](https://github.com/worktile/ai-table/issues/712)) ([fe7885f](https://github.com/worktile/ai-table/commit/fe7885f803000a7c85c5b53623eb0250f7176607)), closes [#WIK-19010](https://github.com/worktile/ai-table/issues/WIK-19010)
* #WIK-19035 拖拽列到冻结列，滚动没有停止 ([#710](https://github.com/worktile/ai-table/issues/710)) ([b67bceb](https://github.com/worktile/ai-table/commit/b67bceb5696c190408a9421f50bc76f16f7264f8)), closes [#WIK-19035](https://github.com/worktile/ai-table/issues/WIK-19035)
* 修复在非冻结区拖拽需要控制辅助线不要显示到冻结区 ([#711](https://github.com/worktile/ai-table/issues/711)) ([63c4e34](https://github.com/worktile/ai-table/commit/63c4e340fd6b2e31741afb6aaa97bf44a075cc7b))


### Features

* **state:** 添加 sort 单元测试 ([#663](https://github.com/worktile/ai-table/issues/663)) ([dd37ba2](https://github.com/worktile/ai-table/commit/dd37ba20d34ec64a19d5770d1e21836288f499c2))



## [0.2.3](https://github.com/worktile/ai-table/compare/0.2.2...0.2.3) (2025-09-23)


### Bug Fixes

* #WIK-19002 【AItable】统计指标鼠标左键点击出现，不要鼠标右键点击也出现 ([6dec59e](https://github.com/worktile/ai-table/commit/6dec59e664d3bd9d9ab1b9c1918b37aed7a47db3)), closes [#WIK-19002](https://github.com/worktile/ai-table/issues/WIK-19002)
* #WIK-19098 ai-table在去除关键字匹配时，匹配背景没有更新 ([#707](https://github.com/worktile/ai-table/issues/707)) ([9f1ca8c](https://github.com/worktile/ai-table/commit/9f1ca8cdc76e12e7a7a112e190840683443586ff)), closes [#WIK-19098](https://github.com/worktile/ai-table/issues/WIK-19098)


### Features

* #WIK-18930 有排序、分组排序时，在更改到涉及到排序字段的cell导致顺序变更弹出tooltip提示，整行失焦时再变更位置 ([#674](https://github.com/worktile/ai-table/issues/674)) ([0fa0d92](https://github.com/worktile/ai-table/commit/0fa0d92adeb71042b7b6b1c1cada1c38396a27c8)), closes [#WIK-18930](https://github.com/worktile/ai-table/issues/WIK-18930)
* #WIK-19078 ai-table-关键字匹配取消协同，支持分组禁止折叠 ([78683ee](https://github.com/worktile/ai-table/commit/78683ee351d7209619fe4e00eb3c2b64919e4229)), closes [#WIK-19078](https://github.com/worktile/ai-table/issues/WIK-19078)
* #WIK-19078 ai-table-关键字匹配取消协同，支持分组禁止折叠 ([49fbb48](https://github.com/worktile/ai-table/commit/49fbb489e5d216e33e5bb5dc6a7500b1fa5df03d)), closes [#WIK-19078](https://github.com/worktile/ai-table/issues/WIK-19078)
* #WIK-19078 ai-table-关键字匹配取消协同，支持分组禁止折叠 ([e0be3b7](https://github.com/worktile/ai-table/commit/e0be3b7b45737a3cee372ac99617a54917c97d92)), closes [#WIK-19078](https://github.com/worktile/ai-table/issues/WIK-19078)



## [0.2.2](https://github.com/worktile/ai-table/compare/0.2.1...0.2.2) (2025-09-18)


### Bug Fixes

* #WIK-18968 【AITable】以多选作为分组，选中项过多时，需要做处理 ([#701](https://github.com/worktile/ai-table/issues/701)) ([f7a3866](https://github.com/worktile/ai-table/commit/f7a3866df1659e317e790ec76eb6efd583659413)), closes [#WIK-18968](https://github.com/worktile/ai-table/issues/WIK-18968)
* #WIK-19040 分组统计文字，字号调整，分组的字号改成12px，最下面的统计不变 ([#698](https://github.com/worktile/ai-table/issues/698)) ([5d9f7cb](https://github.com/worktile/ai-table/commit/5d9f7cbfbc069e3aaae086493df12bffdf658eec)), closes [#WIK-19040](https://github.com/worktile/ai-table/issues/WIK-19040)
* #WIK-19057 垂直滚动时，固定列与非固定列表头遮罩部分样式有问题 ([#700](https://github.com/worktile/ai-table/issues/700)) ([1aac120](https://github.com/worktile/ai-table/commit/1aac1205dea98ee93ae32fe51ac3a63575314287)), closes [#WIK-19057](https://github.com/worktile/ai-table/issues/WIK-19057)
* **state:** fix filter error for select when cellValue is empty #WIK-19049 ([#699](https://github.com/worktile/ai-table/issues/699)) ([dc45c8c](https://github.com/worktile/ai-table/commit/dc45c8c4b73e3b4f5ecb309ec302daf4effec8b6)), closes [#WIK-19049](https://github.com/worktile/ai-table/issues/WIK-19049)



## [0.2.1](https://github.com/worktile/ai-table/compare/0.2.0...0.2.1) (2025-09-15)


### Bug Fixes

* #WIK-18981 【AITable】有筛选条件下，点击顶部的勾选所有，右键行，删除。 应该只删除用户看到的勾选行的删除，而不是删除整个表格的所有记录 ([#696](https://github.com/worktile/ai-table/issues/696)) ([6e87433](https://github.com/worktile/ai-table/commit/6e87433a7488bfc81e9b3b9d42c306b8efd6bc5f)), closes [#WIK-18981](https://github.com/worktile/ai-table/issues/WIK-18981)
* correct manual sort logic ([#695](https://github.com/worktile/ai-table/issues/695)) ([d412adc](https://github.com/worktile/ai-table/commit/d412adc3148ec27bbb5cb59066c5882ea527ae06))



# [0.2.0](https://github.com/worktile/ai-table/compare/0.1.46...0.2.0) (2025-09-15)


### Bug Fixes

* #WIK-19007 【分组】统计指标的英文文字和中文文字数字的部分颜色不统一，英文颜色没换 ([#693](https://github.com/worktile/ai-table/issues/693)) ([7eaf57e](https://github.com/worktile/ai-table/commit/7eaf57e4d0b500af9abb351ffa178d8f4cab81c0)), closes [#WIK-19007](https://github.com/worktile/ai-table/issues/WIK-19007)


### Features

* #WIK-19045 排序 + 分组 + 位置方案完善 ([#692](https://github.com/worktile/ai-table/issues/692)) ([814f0aa](https://github.com/worktile/ai-table/commit/814f0aab1b350550f8b6827e33c329516b9bb5a7)), closes [#WIK-19045](https://github.com/worktile/ai-table/issues/WIK-19045) [#WIK-19045](https://github.com/worktile/ai-table/issues/WIK-19045)
* demo 添加排序功能 ([#687](https://github.com/worktile/ai-table/issues/687)) ([c5c1cd7](https://github.com/worktile/ai-table/commit/c5c1cd72b1cc089644788d640d02c8a4b85c28d5))



## [0.1.46](https://github.com/worktile/ai-table/compare/0.1.45...0.1.46) (2025-09-15)


### Bug Fixes

* #WIK-18961 日期字段排序值只需精确到日 ([#685](https://github.com/worktile/ai-table/issues/685)) ([4ece5cb](https://github.com/worktile/ai-table/commit/4ece5cbb88c61b0520b37154751c68adbdfd72f3)), closes [#WIK-18961](https://github.com/worktile/ai-table/issues/WIK-18961)
* #WIK-19030 分组：分组下新增行会触发意外滚动 ([#689](https://github.com/worktile/ai-table/issues/689)) ([a5368a1](https://github.com/worktile/ai-table/commit/a5368a1183d5239e250a5205762d86c777175d94)), closes [#WIK-19030](https://github.com/worktile/ai-table/issues/WIK-19030)
* **grid:** when copying and pasting into the drop-down selection column, the appended options are not fully appended successfully ([#686](https://github.com/worktile/ai-table/issues/686)) ([9a7b694](https://github.com/worktile/ai-table/commit/9a7b694a0fb8ce16100c4d1ddd6de95dd398f97b))


### Features

* **grid:** render progress and rate normally when grouping #WIK-19034 ([#690](https://github.com/worktile/ai-table/issues/690)) ([a6bee25](https://github.com/worktile/ai-table/commit/a6bee256d688d73415e872c9bf61390a6656a2df)), closes [#WIK-19034](https://github.com/worktile/ai-table/issues/WIK-19034)



## [0.1.45](https://github.com/worktile/ai-table/compare/0.1.44...0.1.45) (2025-09-10)


### Bug Fixes

* #WIK-18957 【AITable】在最后新增列，有时候顺序不对 ([#678](https://github.com/worktile/ai-table/issues/678)) ([17c0fa3](https://github.com/worktile/ai-table/commit/17c0fa316746fd2de7f68ab1da6f30f22a58fcbe)), closes [#WIK-18957](https://github.com/worktile/ai-table/issues/WIK-18957)
* #WIK-18967 【AITable】水平滚动表格，统计hover状态异常 ([#681](https://github.com/worktile/ai-table/issues/681)) ([2fb4575](https://github.com/worktile/ai-table/commit/2fb457502c21839d65163cd623806dddb41cb1e8)), closes [#WIK-18967](https://github.com/worktile/ai-table/issues/WIK-18967)
* #WIK-18970 【AITable】进度作为分组，不要展示进度条，改成展示 xx% ([#677](https://github.com/worktile/ai-table/issues/677)) ([c65e73b](https://github.com/worktile/ai-table/commit/c65e73b64fa43878d67723a050f71df994f59216)), closes [#WIK-18970](https://github.com/worktile/ai-table/issues/WIK-18970)
* #WIK-19000 分组后-新增按钮只有左侧固定列才能点击 ([#679](https://github.com/worktile/ai-table/issues/679)) ([70f8304](https://github.com/worktile/ai-table/commit/70f83045a5665f5d3ead1e06bd70d677518d245d)), closes [#WIK-19000](https://github.com/worktile/ai-table/issues/WIK-19000)
* 还原range计算以排序后数据为准，新增行通过获取add行下标-1获取当前分组最后record ([#683](https://github.com/worktile/ai-table/issues/683)) ([ecacddf](https://github.com/worktile/ai-table/commit/ecacddf17e877bbd291a0e11ce8a7a36b0ffa538))
* 新增行配置问题 ([#680](https://github.com/worktile/ai-table/issues/680)) ([178bfb5](https://github.com/worktile/ai-table/commit/178bfb5747eff25465bcdbb5da139be3f0b7ab16))
* **action:** apply action by draft data #WIK-18976 ([#682](https://github.com/worktile/ai-table/issues/682)) ([d22cf84](https://github.com/worktile/ai-table/commit/d22cf8455b9f494ee3c23e1d95ddd9f3dc376193)), closes [#WIK-18976](https://github.com/worktile/ai-table/issues/WIK-18976)



## [0.1.44](https://github.com/worktile/ai-table/compare/0.1.43...0.1.44) (2025-09-08)


### Bug Fixes

* #WIK-18927 分组展开收起错误 ([#673](https://github.com/worktile/ai-table/issues/673)) ([a1ce99c](https://github.com/worktile/ai-table/commit/a1ce99ca5ef32b9a1a184c8a42d58a9de68a38f8)), closes [#WIK-18927](https://github.com/worktile/ai-table/issues/WIK-18927)
* #WIK-18928 有些分组没有渲染展开收起按钮 ([#669](https://github.com/worktile/ai-table/issues/669)) ([774dedb](https://github.com/worktile/ai-table/commit/774dedb04db4582ca04e996f29e769d5ec9bbcf7)), closes [#WIK-18928](https://github.com/worktile/ai-table/issues/WIK-18928)
* #WIK-18932 表格中的日期无法清除 ([#672](https://github.com/worktile/ai-table/issues/672)) ([6137685](https://github.com/worktile/ai-table/commit/6137685c7b7853d3fa457a9a28e8fac8717022e6)), closes [#WIK-18932](https://github.com/worktile/ai-table/issues/WIK-18932)
* #WIK-18940 分组后，在有筛选条件时，更改筛选条件的字段导致的隐藏tooltip提示位置不对 ([#671](https://github.com/worktile/ai-table/issues/671)) ([873f783](https://github.com/worktile/ai-table/commit/873f783af1acddf85dd6e65be010a8e71ba392de)), closes [#WIK-18940](https://github.com/worktile/ai-table/issues/WIK-18940)
* #WIK-18947 【分组】有分组后第一列的单元格选中边框和双击编辑的边框范围不一致 ([#670](https://github.com/worktile/ai-table/issues/670)) ([07dbaf1](https://github.com/worktile/ai-table/commit/07dbaf1718986c10fcea1c5ea5abc608ac2a9cb9)), closes [#WIK-18947](https://github.com/worktile/ai-table/issues/WIK-18947)
* #WIK-18960 【分组】复选框作为分组后，未选中分组用空框展示，不用文字空，且作为分组后要左对齐，不是居中 ([#675](https://github.com/worktile/ai-table/issues/675)) ([d4adb41](https://github.com/worktile/ai-table/commit/d4adb411097690b10ede1a454305cd0fab3843f4)), closes [#WIK-18960](https://github.com/worktile/ai-table/issues/WIK-18960)



## [0.1.43](https://github.com/worktile/ai-table/compare/0.1.42...0.1.43) (2025-09-04)


### Bug Fixes

* #WIK-18916 搜索匹配，列顺序不对 ([#667](https://github.com/worktile/ai-table/issues/667)) ([1a7a488](https://github.com/worktile/ai-table/commit/1a7a488d7feb378d6c32c2f70adf2a1bd7d64f04)), closes [#WIK-18916](https://github.com/worktile/ai-table/issues/WIK-18916)


### Features

* #WIK-18785 分组行拖拽实现 ([#666](https://github.com/worktile/ai-table/issues/666)) ([1250031](https://github.com/worktile/ai-table/commit/12500318da6178ac663a0aec2a8ba28e8e4d6062)), closes [#WIK-18785](https://github.com/worktile/ai-table/issues/WIK-18785) [#WIK-18785](https://github.com/worktile/ai-table/issues/WIK-18785)



## [0.1.42](https://github.com/worktile/ai-table/compare/0.1.41...0.1.42) (2025-09-04)


### Bug Fixes

* #WIK-18878 SLATE-EDITABLE类型dom的keydown事件过滤 ([#652](https://github.com/worktile/ai-table/issues/652)) ([d8e4623](https://github.com/worktile/ai-table/commit/d8e4623834163d9c5a8fc9a141cdd7c4afcb23d5)), closes [#WIK-18878](https://github.com/worktile/ai-table/issues/WIK-18878) [#WIK-18878](https://github.com/worktile/ai-table/issues/WIK-18878) [#WIK-18878](https://github.com/worktile/ai-table/issues/WIK-18878)
* #WIK-18878 SLATE-EDITABLE类型dom的keydown事件过滤 ([#653](https://github.com/worktile/ai-table/issues/653)) ([3c20d5b](https://github.com/worktile/ai-table/commit/3c20d5b57932c3971968f3dfba3cf5f67e5e2737)), closes [#WIK-18878](https://github.com/worktile/ai-table/issues/WIK-18878)


### Features

* #WIK-18771 分组统计 ([#643](https://github.com/worktile/ai-table/issues/643)) ([9298f0a](https://github.com/worktile/ai-table/commit/9298f0a8a2e66b88aedc973266b62ef1cdc89fac)), closes [#WIK-18771](https://github.com/worktile/ai-table/issues/WIK-18771) [#WIK-18771](https://github.com/worktile/ai-table/issues/WIK-18771) [#WIK-18771](https://github.com/worktile/ai-table/issues/WIK-18771) [#WIK-18771](https://github.com/worktile/ai-table/issues/WIK-18771)
* #WIK-18776 方向键切换cell ([#646](https://github.com/worktile/ai-table/issues/646)) ([a3c4589](https://github.com/worktile/ai-table/commit/a3c458903f5ed3c6114f8f6b2f8eeb0b188ab4a5)), closes [#WIK-18776](https://github.com/worktile/ai-table/issues/WIK-18776)
* #WIK-18777 左侧固定列与非固定列边缘阴影 ([#649](https://github.com/worktile/ai-table/issues/649)) ([a520462](https://github.com/worktile/ai-table/commit/a5204627b7d4c323f7d53c1d3e1e434b91d5a66d)), closes [#WIK-18777](https://github.com/worktile/ai-table/issues/WIK-18777) [#WIK-18777](https://github.com/worktile/ai-table/issues/WIK-18777) [#WIK-18777](https://github.com/worktile/ai-table/issues/WIK-18777)
* #WIK-18778 分组下的新增行支持 ([#644](https://github.com/worktile/ai-table/issues/644)) ([126a5dc](https://github.com/worktile/ai-table/commit/126a5dc9d6a554613fd754e45eaa8c2dcf50b63f)), closes [#WIK-18778](https://github.com/worktile/ai-table/issues/WIK-18778)
* #WIK-18794 空数据分组渲染 ([#645](https://github.com/worktile/ai-table/issues/645)) ([812e9b3](https://github.com/worktile/ai-table/commit/812e9b320964db8b8d29dcb05e980b041035bc64)), closes [#WIK-18794](https://github.com/worktile/ai-table/issues/WIK-18794)
* #WIK-18812 鼠标拖拽选中cell，右下角 点 拖拽填充数据 ([#657](https://github.com/worktile/ai-table/issues/657)) ([20df3ca](https://github.com/worktile/ai-table/commit/20df3cad529ce5cf8d3dcf96a59651ce8475aa46)), closes [#WIK-18812](https://github.com/worktile/ai-table/issues/WIK-18812)
* #WIK-18825 统一分组排序和普通排序逻辑 ([#648](https://github.com/worktile/ai-table/issues/648)) ([2c52c7f](https://github.com/worktile/ai-table/commit/2c52c7f2c817ca83bac10ba077d80f3e0a61baef)), closes [#WIK-18825](https://github.com/worktile/ai-table/issues/WIK-18825)
* #WIK-18826 构建 LinearRows 添加 range记录分组对应记录范围 ([#650](https://github.com/worktile/ai-table/issues/650)) ([d478fd1](https://github.com/worktile/ai-table/commit/d478fd14a36f5fda6fc03c71ae9814dc4ae7749c)), closes [#WIK-18826](https://github.com/worktile/ai-table/issues/WIK-18826)
* #WIK-18882 分组后，复制，粘贴 ([#661](https://github.com/worktile/ai-table/issues/661)) ([aec57e1](https://github.com/worktile/ai-table/commit/aec57e1937f23557d44f516fa25a7ceb2e83da4c)), closes [#WIK-18882](https://github.com/worktile/ai-table/issues/WIK-18882) [#WIK-18883](https://github.com/worktile/ai-table/issues/WIK-18883) [#WIK-18882](https://github.com/worktile/ai-table/issues/WIK-18882) [#WIK-18882](https://github.com/worktile/ai-table/issues/WIK-18882) [#WIK-18882](https://github.com/worktile/ai-table/issues/WIK-18882) [#WIK-18882](https://github.com/worktile/ai-table/issues/WIK-18882) [#WIK-18882](https://github.com/worktile/ai-table/issues/WIK-18882) [#WIK-18882](https://github.com/worktile/ai-table/issues/WIK-18882)
* #WIK-18883 分组后，右键批量添加新行 ([#656](https://github.com/worktile/ai-table/issues/656)) ([1980f82](https://github.com/worktile/ai-table/commit/1980f820a9056b6d03902537f3a49841bbffa232)), closes [#WIK-18883](https://github.com/worktile/ai-table/issues/WIK-18883)
* #WIK-18884 分组首列hover后cover组件渲染缩进 ([#658](https://github.com/worktile/ai-table/issues/658)) ([e796fd4](https://github.com/worktile/ai-table/commit/e796fd44e8738887e3c30f35fc9f479d357aba8a)), closes [#WIK-18884](https://github.com/worktile/ai-table/issues/WIK-18884)
* #WIK-18886 分组，选中多行，右键 删除 ([#664](https://github.com/worktile/ai-table/issues/664)) ([7273205](https://github.com/worktile/ai-table/commit/7273205589c24f549aa8b89592426341ebceba9e)), closes [#WIK-18886](https://github.com/worktile/ai-table/issues/WIK-18886)
* #WIK-18895 新增行position计算调整 ([#662](https://github.com/worktile/ai-table/issues/662)) ([8ac6fe9](https://github.com/worktile/ai-table/commit/8ac6fe96bb03848eeb4366fb4a73a6b15a5e8f31)), closes [#WIK-18895](https://github.com/worktile/ai-table/issues/WIK-18895)
* 调整拖拽行 options 参数，使用 afterRecordId 或 beforeRecordId 表达目标 ([#659](https://github.com/worktile/ai-table/issues/659)) ([cd9f9e7](https://github.com/worktile/ai-table/commit/cd9f9e7639524ce4f34437a42571e835b09a3ce7))



## [0.1.41](https://github.com/worktile/ai-table/compare/0.1.40...0.1.41) (2025-08-28)


### Bug Fixes

* #WIK-18795 【rc】多维表格，文字输入框，基本写不进去内容 ([#639](https://github.com/worktile/ai-table/issues/639)) ([465bc7f](https://github.com/worktile/ai-table/commit/465bc7f8ca7349fa3b63ff2197bf0404914a9006)), closes [#WIK-18795](https://github.com/worktile/ai-table/issues/WIK-18795)


### Features

* #WIK-18730 支持分组 LinearRow 数据生成 ([#636](https://github.com/worktile/ai-table/issues/636)) ([fc976e3](https://github.com/worktile/ai-table/commit/fc976e3906b5bf85745f58ee2c84cfdc9ede03dd)), closes [#WIK-18730](https://github.com/worktile/ai-table/issues/WIK-18730)
* #WIK-18770 分组静态渲染 ([#637](https://github.com/worktile/ai-table/issues/637)) ([1c25951](https://github.com/worktile/ai-table/commit/1c259513f0eb9e81e37ae97c4eeb758fadc085d8)), closes [#WIK-18770](https://github.com/worktile/ai-table/issues/WIK-18770) [#WIK-18770](https://github.com/worktile/ai-table/issues/WIK-18770) [#WIK-18770](https://github.com/worktile/ai-table/issues/WIK-18770) [#WIK-18770](https://github.com/worktile/ai-table/issues/WIK-18770) [#WIK-18770](https://github.com/worktile/ai-table/issues/WIK-18770)
* #WIK-18775 分组展开收起 ([#642](https://github.com/worktile/ai-table/issues/642)) ([6a48ccb](https://github.com/worktile/ai-table/commit/6a48ccb80420f8d28aa6fa506f9afb384d186af3)), closes [#WIK-18775](https://github.com/worktile/ai-table/issues/WIK-18775)
* #WIK-18783 完善分组 Action 支持协同 ([#638](https://github.com/worktile/ai-table/issues/638)) ([fc4cae2](https://github.com/worktile/ai-table/commit/fc4cae20254865f132849195b0b261e7e956c4a9)), closes [#WIK-18783](https://github.com/worktile/ai-table/issues/WIK-18783)



## [0.1.40](https://github.com/worktile/ai-table/compare/0.1.39...0.1.40) (2025-08-20)


### Features

* #WIK-16925 【AITable】添加行始终在底部展示，最新行始终展示在可视区域 ([#633](https://github.com/worktile/ai-table/issues/633)) ([7632133](https://github.com/worktile/ai-table/commit/7632133a990e3b846d30ae48d9279bd61b40967c)), closes [#WIK-16925](https://github.com/worktile/ai-table/issues/WIK-16925)
* #WIK-18756 ai-table支持滚动到匹配的cell ([#634](https://github.com/worktile/ai-table/issues/634)) ([66e3d30](https://github.com/worktile/ai-table/commit/66e3d309a37351e9019eba30bddfa271182b2432)), closes [#WIK-18756](https://github.com/worktile/ai-table/issues/WIK-18756)



## [0.1.39](https://github.com/worktile/ai-table/compare/0.1.38...0.1.39) (2025-08-15)


### Bug Fixes

* #WIK-18706 复选框筛选结果不正确 ([#624](https://github.com/worktile/ai-table/issues/624)) ([9ef63cb](https://github.com/worktile/ai-table/commit/9ef63cb2be59c0d4e0571752e0d3ad71d22df05f)), closes [#WIK-18706](https://github.com/worktile/ai-table/issues/WIK-18706)
* #WIK-18711 【复选框】同类型粘贴至复制框应该可以成功 ([#626](https://github.com/worktile/ai-table/issues/626)) ([b7374f0](https://github.com/worktile/ai-table/commit/b7374f0530ff7fe04e69a107d287eb77366b91c6)), closes [#WIK-18711](https://github.com/worktile/ai-table/issues/WIK-18711)
* #WIK-18712 没有权限、锁定的不能继续勾选、反勾选 ([#625](https://github.com/worktile/ai-table/issues/625)) ([816aeb9](https://github.com/worktile/ai-table/commit/816aeb9b43da6be3f6fb527c8f43909a356b756e)), closes [#WIK-18712](https://github.com/worktile/ai-table/issues/WIK-18712)
* #WIK-18717 展开文本后无法拖动滚动条 ([#629](https://github.com/worktile/ai-table/issues/629)) ([438d17e](https://github.com/worktile/ai-table/commit/438d17e32c40b7796f11220a2457182245bf71c6)), closes [#WIK-18717](https://github.com/worktile/ai-table/issues/WIK-18717) [#WIK-18717](https://github.com/worktile/ai-table/issues/WIK-18717) [#WIK-18717](https://github.com/worktile/ai-table/issues/WIK-18717)
* #WIK-18718 表格空白，页面崩溃，排查下原因 ([#627](https://github.com/worktile/ai-table/issues/627)) ([97693c0](https://github.com/worktile/ai-table/commit/97693c0894869686eeb826e84a8a3487183bcc94)), closes [#WIK-18718](https://github.com/worktile/ai-table/issues/WIK-18718)
* #WIK-18719 【AItable】序号的线变细了 ([#631](https://github.com/worktile/ai-table/issues/631)) ([2b3d436](https://github.com/worktile/ai-table/commit/2b3d436b7a41a25787bb48ee041ce4d793a4236e)), closes [#WIK-18719](https://github.com/worktile/ai-table/issues/WIK-18719)
* #WIK-18720 文字展开的高度不正确（高度没到指定值是，不应该出现滚动条） ([#628](https://github.com/worktile/ai-table/issues/628)) ([7fd3112](https://github.com/worktile/ai-table/commit/7fd31123708a8bec3d6165417544b4cdcce6f306)), closes [#WIK-18720](https://github.com/worktile/ai-table/issues/WIK-18720)
* **grid:** #WIK-18714 冻结列拖拽拖拽滚动问题 ([#630](https://github.com/worktile/ai-table/issues/630)) ([391e7f6](https://github.com/worktile/ai-table/commit/391e7f60d83bae520d81de5775def229e793367b)), closes [#WIK-18714](https://github.com/worktile/ai-table/issues/WIK-18714)



## [0.1.38](https://github.com/worktile/ai-table/compare/0.1.37...0.1.38) (2025-08-13)


### Features

* #WIK-18701 ai-talbe，复选框排序顺序调整 ([#622](https://github.com/worktile/ai-table/issues/622)) ([177d545](https://github.com/worktile/ai-table/commit/177d5452254b88aaa548738b14785066924c394a)), closes [#WIK-18701](https://github.com/worktile/ai-table/issues/WIK-18701)



## [0.1.37](https://github.com/worktile/ai-table/compare/0.1.36...0.1.37) (2025-08-12)


### Bug Fixes

* #WIK-18678 【复选框】列更多菜单的复选框排序的文案不对 ([#618](https://github.com/worktile/ai-table/issues/618)) ([6394111](https://github.com/worktile/ai-table/commit/6394111e66ea1dd6a6ac1948313c4977ac27b8e5)), closes [#WIK-18678](https://github.com/worktile/ai-table/issues/WIK-18678) [#WIK-18678](https://github.com/worktile/ai-table/issues/WIK-18678) [#WIK-18678](https://github.com/worktile/ai-table/issues/WIK-18678) [#WIK-18678](https://github.com/worktile/ai-table/issues/WIK-18678) [#WIK-18678](https://github.com/worktile/ai-table/issues/WIK-18678)
* #WIK-18691 【aitable】在一个长文本中键盘随便快速输入，快速输入过程中按一次回车，出现单元格跑版，跑版后，内容只剩下最后一行，其他的没了,见附件 ([#620](https://github.com/worktile/ai-table/issues/620)) ([041aa82](https://github.com/worktile/ai-table/commit/041aa825b547f7d8831bf2b311888ce0008dad81)), closes [#WIK-18691](https://github.com/worktile/ai-table/issues/WIK-18691) [#WIK-18691](https://github.com/worktile/ai-table/issues/WIK-18691) [#WIK-18691](https://github.com/worktile/ai-table/issues/WIK-18691)


### Features

* #WIK-17836 【AItable】支持键盘切换单元格 ([#617](https://github.com/worktile/ai-table/issues/617)) ([5eb9b03](https://github.com/worktile/ai-table/commit/5eb9b0388df26c3ee70e12fcefd3c1aaed1fb606)), closes [#WIK-17836](https://github.com/worktile/ai-table/issues/WIK-17836)
* #WIK-18695 在有筛选时，编辑cell后，不符合条件需要有tooltip提示，整行失焦后才会被过滤。 ([#619](https://github.com/worktile/ai-table/issues/619)) ([6a5c668](https://github.com/worktile/ai-table/commit/6a5c66831bd3c33634b9b19d8878610b1d9bb8f8)), closes [#WIK-18695](https://github.com/worktile/ai-table/issues/WIK-18695)



## [0.1.36](https://github.com/worktile/ai-table/compare/0.1.35...0.1.36) (2025-08-08)


### Features

* #WIK-18651 angular-konva 优化 ([#613](https://github.com/worktile/ai-table/issues/613)) ([95b8869](https://github.com/worktile/ai-table/commit/95b88692eb2d11a5f13fc7b1a8542dc7b56d481a)), closes [#WIK-18651](https://github.com/worktile/ai-table/issues/WIK-18651)
* #WIK-18652 selection 状态拆分 ([#612](https://github.com/worktile/ai-table/issues/612)) ([1042d64](https://github.com/worktile/ai-table/commit/1042d64973282b00457e295653b7ade52cd45b28)), closes [#WIK-18652](https://github.com/worktile/ai-table/issues/WIK-18652)



## [0.1.35](https://github.com/worktile/ai-table/compare/0.1.34...0.1.35) (2025-08-05)



## [0.1.34](https://github.com/worktile/ai-table/compare/0.1.33...0.1.34) (2025-08-01)


### Bug Fixes

* **grid:** #WIK-18620 表格有滚动条拖动冻结列，滚条自动往前跳 ([#606](https://github.com/worktile/ai-table/issues/606)) ([e5fe01a](https://github.com/worktile/ai-table/commit/e5fe01a3fb53d5ccae1bdb82491cdb245c751bd5)), closes [#WIK-18620](https://github.com/worktile/ai-table/issues/WIK-18620) [#WIK-18620](https://github.com/worktile/ai-table/issues/WIK-18620)
* **state:** #WIK-18472 数字类型清除回车后数字还原 ([#609](https://github.com/worktile/ai-table/issues/609)) ([5e9da47](https://github.com/worktile/ai-table/commit/5e9da47da4c70f391bc5458d98c3183d7007d248)), closes [#WIK-18472](https://github.com/worktile/ai-table/issues/WIK-18472)


### Features

* #WIK-18220 supports frozen column settings ([#599](https://github.com/worktile/ai-table/issues/599)) ([5dcf31d](https://github.com/worktile/ai-table/commit/5dcf31d52d4f1f3788c79ca039ca8da261722173)), closes [#WIK-18220](https://github.com/worktile/ai-table/issues/WIK-18220)
* #WIK-18634 cover渲染的cell展开后，拖拽赋值的按钮跟随展开的边框 ([#607](https://github.com/worktile/ai-table/issues/607)) ([1505125](https://github.com/worktile/ai-table/commit/1505125fcf8a59a136bbdc4fa8e7f4e559261960)), closes [#WIK-18634](https://github.com/worktile/ai-table/issues/WIK-18634)



## [0.1.33](https://github.com/worktile/ai-table/compare/0.1.32...0.1.33) (2025-07-31)


### Bug Fixes

* #WIK-18612 【aitable】表格又出现白屏，出现多次 ([#600](https://github.com/worktile/ai-table/issues/600)) ([5d72f87](https://github.com/worktile/ai-table/commit/5d72f873509db662405aefd9eec271d5787579fb)), closes [#WIK-18612](https://github.com/worktile/ai-table/issues/WIK-18612)


### Features

* #WIK-18607 单行文本支持选中cover展示全部内容 ([#597](https://github.com/worktile/ai-table/issues/597)) ([e3dd51c](https://github.com/worktile/ai-table/commit/e3dd51c932eb38d9c284d44ff7673a06f6b5df6f)), closes [#WIK-18607](https://github.com/worktile/ai-table/issues/WIK-18607)
* #WIK-18617 AITable-支持单选、多选禁用隐藏 ([#598](https://github.com/worktile/ai-table/issues/598)) ([10a0019](https://github.com/worktile/ai-table/commit/10a00192f3450d193c61cd67953d170339b2c944)), closes [#WIK-18617](https://github.com/worktile/ai-table/issues/WIK-18617)



## [0.1.32](https://github.com/worktile/ai-table/compare/0.1.31...0.1.32) (2025-07-25)


### Bug Fixes

* #WIK-18532 【Prod 前】鼠标在表格移动时-频繁触发统计计算 ([#595](https://github.com/worktile/ai-table/issues/595)) ([8f62b0f](https://github.com/worktile/ai-table/commit/8f62b0f212c4628fa47d3f761b0d1d8ad1dec46c)), closes [#WIK-18532](https://github.com/worktile/ai-table/issues/WIK-18532)


### Features

* #WIK-18599 AITable-复选框统计调整 ([#594](https://github.com/worktile/ai-table/issues/594)) ([4a2ce6f](https://github.com/worktile/ai-table/commit/4a2ce6fbc52c04371b1f380c0e287933029ecab0)), closes [#WIK-18599](https://github.com/worktile/ai-table/issues/WIK-18599)



## [0.1.31](https://github.com/worktile/ai-table/compare/0.1.30...0.1.31) (2025-07-23)


### Bug Fixes

* #WIK-18467 【aitable】数字达到一定级别用简化显示，如显示1e+x ，参考组件，同理底部的计算也需要如此 ([#590](https://github.com/worktile/ai-table/issues/590)) ([5b90bc2](https://github.com/worktile/ai-table/commit/5b90bc2ccdecc6f3b835e39c4b1ebd564e61f7e7)), closes [#WIK-18467](https://github.com/worktile/ai-table/issues/WIK-18467)
* #WIK-18570 【aitable】当显示已选中 xx 记录时，后面的下拉箭头不需要展示 ([#591](https://github.com/worktile/ai-table/issues/591)) ([3e9edfc](https://github.com/worktile/ai-table/commit/3e9edfcf37dc5f379764619cebd7f39693915167)), closes [#WIK-18570](https://github.com/worktile/ai-table/issues/WIK-18570)


### Features

* #WIK-18563 AItable-增加复选框属性 ([#586](https://github.com/worktile/ai-table/issues/586)) ([d178ba4](https://github.com/worktile/ai-table/commit/d178ba4e9a91bf64deaf04eb8c1e9e32acec8e89)), closes [#WIK-18563](https://github.com/worktile/ai-table/issues/WIK-18563)
* #WIK-18582 完善自定义字段示例 ([#589](https://github.com/worktile/ai-table/issues/589)) ([a896907](https://github.com/worktile/ai-table/commit/a8969071681699d837f3da4e2732ce648fb12e2f)), closes [#WIK-18582](https://github.com/worktile/ai-table/issues/WIK-18582)
* #WIK-18587 AItable-复选框修改选中状态主色 ([910fbdc](https://github.com/worktile/ai-table/commit/910fbdc4adcfc66ca0f71ab3fb205f1d2118706c)), closes [#WIK-18587](https://github.com/worktile/ai-table/issues/WIK-18587)
* #WIK-18587 AItable-复选框修改选中状态主色 ([#592](https://github.com/worktile/ai-table/issues/592)) ([5051ab2](https://github.com/worktile/ai-table/commit/5051ab2221c59bdf252e21369d1de4bdce25bf7a)), closes [#WIK-18587](https://github.com/worktile/ai-table/issues/WIK-18587)



## [0.1.30](https://github.com/worktile/ai-table/compare/0.1.29...0.1.30) (2025-07-22)


### Bug Fixes

* #WIK-18516 【AITable】各视图的统计单独存，互不干扰 ([#585](https://github.com/worktile/ai-table/issues/585)) ([286ff81](https://github.com/worktile/ai-table/commit/286ff814848b29d16dfd09f984979b3abf405ce9)), closes [#WIK-18516](https://github.com/worktile/ai-table/issues/WIK-18516)
* #WIK-18564 【Rc】ai-table 空白， isNil 报错 ([#587](https://github.com/worktile/ai-table/issues/587)) ([d55f927](https://github.com/worktile/ai-table/commit/d55f927de8b8a9bff1cf157d08de602c1d8cef9e)), closes [#WIK-18564](https://github.com/worktile/ai-table/issues/WIK-18564)



## [0.1.29](https://github.com/worktile/ai-table/compare/0.1.28...0.1.29) (2025-07-17)


### Bug Fixes

* #WIK-18468 【统计行】数字求和达到亿要简化显示，参考组件 ([#582](https://github.com/worktile/ai-table/issues/582)) ([e3a6776](https://github.com/worktile/ai-table/commit/e3a6776b22abc509fa2c272d629aa024b4428b74)), closes [#WIK-18468](https://github.com/worktile/ai-table/issues/WIK-18468) [#WIK-18468](https://github.com/worktile/ai-table/issues/WIK-18468) [#WIK-18468](https://github.com/worktile/ai-table/issues/WIK-18468)
* #WIK-18513 【AITable】表格统计 唯一数占比 （1）百分百数值不对、（2）NaN、（3）多行文本唯一数（4）平均值NaN ([#583](https://github.com/worktile/ai-table/issues/583)) ([a1e37f7](https://github.com/worktile/ai-table/commit/a1e37f76378127706b492a4efd3989c83be6519e)), closes [#WIK-18513](https://github.com/worktile/ai-table/issues/WIK-18513) [#WIK-18513](https://github.com/worktile/ai-table/issues/WIK-18513) [#WIK-18513](https://github.com/worktile/ai-table/issues/WIK-18513)
* do not fill system field when drag fill ([#581](https://github.com/worktile/ai-table/issues/581)) ([a13d9c0](https://github.com/worktile/ai-table/commit/a13d9c0afc03b59e704ede9dcdc4dfe894e7dd6a))
* hidden drag fill handle when cell is editing or expanding ([795b107](https://github.com/worktile/ai-table/commit/795b10768f67a10b8c0484b544797b1e7cc41236))



## [0.1.28](https://github.com/worktile/ai-table/compare/0.1.27...0.1.28) (2025-07-16)


### Bug Fixes

* #WIK-18464 【统计行】唯一数占比计算？空行也算去重唯一了吗？ ([#571](https://github.com/worktile/ai-table/issues/571)) ([46a192a](https://github.com/worktile/ai-table/commit/46a192ad551f0780cdc071b59bf5c958151596a3)), closes [#WIK-18464](https://github.com/worktile/ai-table/issues/WIK-18464)
* #WIK-18465 【统计行】多选统计指标不全，缺少唯一数和唯一数占比 ([#572](https://github.com/worktile/ai-table/issues/572)) ([4c2839f](https://github.com/worktile/ai-table/commit/4c2839f92763f11cc132e2f1a427bcdfedb5ce88)), closes [#WIK-18465](https://github.com/worktile/ai-table/issues/WIK-18465)
* #WIK-18466 【统计行】进度指标不全，缺少最大值最小值 ([#573](https://github.com/worktile/ai-table/issues/573)) ([c06f5c5](https://github.com/worktile/ai-table/commit/c06f5c56fcc88027bcdea3d6d72d41ba6f76c633)), closes [#WIK-18466](https://github.com/worktile/ai-table/issues/WIK-18466)
* #WIK-18496 滚动组件-阻止相关事件冒泡，破坏内部行为 ([1e4e005](https://github.com/worktile/ai-table/commit/1e4e005c17b0376e05ef839ec9c8980bf705a91f)), closes [#WIK-18496](https://github.com/worktile/ai-table/issues/WIK-18496)


### Features

* #WIK-18458 aitable 封装统一滚动组件 ([#570](https://github.com/worktile/ai-table/issues/570)) ([10e6f5c](https://github.com/worktile/ai-table/commit/10e6f5c3c136b390fb57194bed9445959c3ddca6)), closes [#WIK-18458](https://github.com/worktile/ai-table/issues/WIK-18458)



## [0.1.27](https://github.com/worktile/ai-table/compare/0.1.26...0.1.27) (2025-07-11)


### Bug Fixes

* **grid:** #WIK-18451 固定列阴影改为 Rect 渲染渐变色实现 ([#567](https://github.com/worktile/ai-table/issues/567)) ([c8bb68e](https://github.com/worktile/ai-table/commit/c8bb68edb4441d0eb29669f4178dad14278617d8)), closes [#WIK-18451](https://github.com/worktile/ai-table/issues/WIK-18451)
* the highlighted area is incorrect when scrolling and filling ([#568](https://github.com/worktile/ai-table/issues/568)) ([ef8a1dc](https://github.com/worktile/ai-table/commit/ef8a1dcf679a407c784c3961f574445a6d5577c5))



## [0.1.26](https://github.com/worktile/ai-table/compare/0.1.25...0.1.26) (2025-07-10)


### Bug Fixes

* #WIK-18416 【aitable】统计行hover 不是所有列都一起出来，hover到哪哪列的显示 ([#562](https://github.com/worktile/ai-table/issues/562)) ([59be39f](https://github.com/worktile/ai-table/commit/59be39ff0939e2d5738d0f1a3c91bae00ec0df81)), closes [#WIK-18416](https://github.com/worktile/ai-table/issues/WIK-18416)
* #WIK-18438 【统计】鼠标 hover 到底部列的时候文案是：统计；点击统计展开弹窗，弹窗中默认选中不展示 ([#565](https://github.com/worktile/ai-table/issues/565)) ([9ee7fdf](https://github.com/worktile/ai-table/commit/9ee7fdfdf4e7ea6b12374f716d1acadc3c16578c)), closes [#WIK-18438](https://github.com/worktile/ai-table/issues/WIK-18438)


### Features

* #WIK-18429 统计样式细节调整 ([#563](https://github.com/worktile/ai-table/issues/563)) ([8c7722e](https://github.com/worktile/ai-table/commit/8c7722e73cf0e4747b36557a4e88fb35a365eadd)), closes [#WIK-18429](https://github.com/worktile/ai-table/issues/WIK-18429)
* **grid:** #WIK-18287 表格固定列和统计列支持阴影 ([#564](https://github.com/worktile/ai-table/issues/564)) ([f01449b](https://github.com/worktile/ai-table/commit/f01449b9bc879ad21ac731fdc108e7da1000b9d9)), closes [#WIK-18287](https://github.com/worktile/ai-table/issues/WIK-18287)



## [0.1.25](https://github.com/worktile/ai-table/compare/0.1.24...0.1.25) (2025-07-04)


### Bug Fixes

* #WIK-18412 统计i18n的key会重复，首屏不渲染统计结果 ([#560](https://github.com/worktile/ai-table/issues/560)) ([cfe6852](https://github.com/worktile/ai-table/commit/cfe6852bc39d9986f5d703240932defb18a9adec)), closes [#WIK-18412](https://github.com/worktile/ai-table/issues/WIK-18412) [#WIK-18412](https://github.com/worktile/ai-table/issues/WIK-18412) [#WIK-18412](https://github.com/worktile/ai-table/issues/WIK-18412)
* **grid:** #WIK-18309 表格多选展示和展开时字号不一致，且展示的时候圆角小了 ([#559](https://github.com/worktile/ai-table/issues/559)) ([820dea9](https://github.com/worktile/ai-table/commit/820dea9e337ba9679a777bf4d1459aa203c4b401)), closes [#WIK-18309](https://github.com/worktile/ai-table/issues/WIK-18309)



## [0.1.24](https://github.com/worktile/ai-table/compare/0.1.23...0.1.24) (2025-07-03)


### Bug Fixes

* **grid:** #WIK-18360 修复表格超过最大行限制筛数据后又可以新增 ([#554](https://github.com/worktile/ai-table/issues/554)) ([1290ee7](https://github.com/worktile/ai-table/commit/1290ee7eaccf364ba980eeeaabc01a01093fca84)), closes [#WIK-18360](https://github.com/worktile/ai-table/issues/WIK-18360)


### Features

* #WIK-18348 aitable列统计各个字段维度的统计 ([#549](https://github.com/worktile/ai-table/issues/549)) ([bcf5cfe](https://github.com/worktile/ai-table/commit/bcf5cfe42a9807f709baa6f306ce67f29b03c8fa)), closes [#WIK-18348](https://github.com/worktile/ai-table/issues/WIK-18348)
* #WIK-18374 左侧固定列的统计 ([#552](https://github.com/worktile/ai-table/issues/552)) ([6f66987](https://github.com/worktile/ai-table/commit/6f669873575657b9910e2a5bb181b7a72b901081)), closes [#WIK-18374](https://github.com/worktile/ai-table/issues/WIK-18374)
* #WIK-18375 底部固定列占位后，原有的底部展示交互影响（向下滚动） ([#557](https://github.com/worktile/ai-table/issues/557)) ([23a617f](https://github.com/worktile/ai-table/commit/23a617f61e707c3900b82989f77a4acc47389aee)), closes [#WIK-18375](https://github.com/worktile/ai-table/issues/WIK-18375)
* #WIK-18376 统计字段和结果的i18n ([#556](https://github.com/worktile/ai-table/issues/556)) ([e74fcb8](https://github.com/worktile/ai-table/commit/e74fcb86de656ed3eb8811abde18d2064993f75e)), closes [#WIK-18376](https://github.com/worktile/ai-table/issues/WIK-18376)
* #WIK-18377 选择行后，单独统计和展示选中的行数据 ([#553](https://github.com/worktile/ai-table/issues/553)) ([927f0ab](https://github.com/worktile/ai-table/commit/927f0aba2d9c649c4605ae0eca9a0bfcff48f8a9)), closes [#WIK-18377](https://github.com/worktile/ai-table/issues/WIK-18377) [#WIK-18377](https://github.com/worktile/ai-table/issues/WIK-18377) [#WIK-18377](https://github.com/worktile/ai-table/issues/WIK-18377) [#WIK-18377](https://github.com/worktile/ai-table/issues/WIK-18377)
* #WIK-18378 默认统计结果渲染和hover后的渲染交互细节实现 ([#555](https://github.com/worktile/ai-table/issues/555)) ([97dd2c5](https://github.com/worktile/ai-table/commit/97dd2c59fdfe0c2c96cc902c693312bf54379954)), closes [#WIK-18378](https://github.com/worktile/ai-table/issues/WIK-18378)



## [0.1.23](https://github.com/worktile/ai-table/compare/0.1.21...0.1.23) (2025-07-02)


### Bug Fixes

* **grid:** error when modifying select value ([5c48643](https://github.com/worktile/ai-table/commit/5c4864334beb9cd4662754f51e1ebf273fb63300))


### Features

* #WIK-18342 统计整体技术方案设计 ([#543](https://github.com/worktile/ai-table/issues/543)) ([f3cab46](https://github.com/worktile/ai-table/commit/f3cab46451203a3f5e3c0e9df7b0347d460d8a66)), closes [#WIK-18342](https://github.com/worktile/ai-table/issues/WIK-18342)
* **grid:** fill-handle is fixed at the lower right corner of the selected cell ([8836873](https://github.com/worktile/ai-table/commit/88368730897c2286de6bed1cc49067bf68685d94))
* **grid:** support drag to fill fields ([#546](https://github.com/worktile/ai-table/issues/546)) ([716371f](https://github.com/worktile/ai-table/commit/716371ff978bbcb63f4fe40e7ba96e7d52aa8628))



## [0.1.21](https://github.com/worktile/ai-table/compare/0.1.20...0.1.21) (2025-06-24)


### Bug Fixes

* **grid:** switch to other types first and then switch to select type, the options are wrong. ([#541](https://github.com/worktile/ai-table/issues/541)) ([a5f87e5](https://github.com/worktile/ai-table/commit/a5f87e55ef88bb37aaa7e75b556d7011c25df8bd))



## [0.1.20](https://github.com/worktile/ai-table/compare/0.1.19...0.1.20) (2025-06-23)


### Features

* #WIK-18301 ai-table 支持方法自定义字段和字段顺序 ([#539](https://github.com/worktile/ai-table/issues/539)) ([7ed14d9](https://github.com/worktile/ai-table/commit/7ed14d9657ddeb5d8ea2f94fa8064f115684b697)), closes [#WIK-18301](https://github.com/worktile/ai-table/issues/WIK-18301)



## [0.1.19](https://github.com/worktile/ai-table/compare/0.1.18...0.1.19) (2025-06-20)


### Bug Fixes

* **grid:** not change field name when update field type ([#534](https://github.com/worktile/ai-table/issues/534)) ([54468c6](https://github.com/worktile/ai-table/commit/54468c6bf06e79cca0a10e59505a2deb2b67de5d))


### Features

* #WIK-18297 ai-table 的action-icon 支持调整icon大小 ([#536](https://github.com/worktile/ai-table/issues/536)) ([635a5ad](https://github.com/worktile/ai-table/commit/635a5ad912d11d4e82ed216438ef7485f10c43ab)), closes [#WIK-18297](https://github.com/worktile/ai-table/issues/WIK-18297) [#WIK-18297](https://github.com/worktile/ai-table/issues/WIK-18297) [#WIK-18297](https://github.com/worktile/ai-table/issues/WIK-18297)
* **grid:** support set aiMaxSelectOptions for select and multi-select field ([#535](https://github.com/worktile/ai-table/issues/535)) ([ec47911](https://github.com/worktile/ai-table/commit/ec47911d14a9cd4788986fc55b27374e4d277d0e))


### Performance Improvements

* when a row, column, or cell is selected, the background color of the progress or rating cell should not turn white when the mouse is hovered over it ([#537](https://github.com/worktile/ai-table/issues/537)) ([71da8cf](https://github.com/worktile/ai-table/commit/71da8cfb0c8e32628425ed584ed4b8019b6e87a4))



## [0.1.18](https://github.com/worktile/ai-table/compare/0.1.17...0.1.18) (2025-06-19)


### Bug Fixes

* fixed isDateAndReturnDate date is object ([#532](https://github.com/worktile/ai-table/issues/532)) ([286ae92](https://github.com/worktile/ai-table/commit/286ae9291f9bf8d9faadf27da14f16fa845ff55a))


### Features

* isProgress and return value ([#531](https://github.com/worktile/ai-table/issues/531)) ([947010e](https://github.com/worktile/ai-table/commit/947010eeed2d6e410d013fd51ec54e096a0f93ed))



## [0.1.17](https://github.com/worktile/ai-table/compare/0.1.16...0.1.17) (2025-06-18)


### Bug Fixes

* **grid:** #WIK-17996 adding a row on the menu will insert javascript text ([#526](https://github.com/worktile/ai-table/issues/526)) ([f40f9c0](https://github.com/worktile/ai-table/commit/f40f9c05b98705d70af76c7d28dcad4474df3260)), closes [#WIK-17996](https://github.com/worktile/ai-table/issues/WIK-17996)


### Features

* **grid:** set max height for field type menu #WIK-18236 ([#527](https://github.com/worktile/ai-table/issues/527)) ([3275a9d](https://github.com/worktile/ai-table/commit/3275a9dadbc1c47ab865232c03737f70fd949afd)), closes [#WIK-18236](https://github.com/worktile/ai-table/issues/WIK-18236)
* 抽取一些公用的函数 ([#525](https://github.com/worktile/ai-table/issues/525)) ([4c2e7c4](https://github.com/worktile/ai-table/commit/4c2e7c417eb93a70cfb30dd8f4c5440b43f0cb65))



## [0.1.16](https://github.com/worktile/ai-table/compare/0.1.15...0.1.16) (2025-06-16)


### Features

* #WIK-18245 ai-table 的action-icon组件支持挂载source数据 ([#523](https://github.com/worktile/ai-table/issues/523)) ([7d8e7d4](https://github.com/worktile/ai-table/commit/7d8e7d4eebbbc4d9270f8b239120280846a314cd)), closes [#WIK-18245](https://github.com/worktile/ai-table/issues/WIK-18245)



## [0.1.15](https://github.com/worktile/ai-table/compare/0.1.14...0.1.15) (2025-06-13)


### Features

* output isSwitchType from field setting ([#521](https://github.com/worktile/ai-table/issues/521)) ([9d80e85](https://github.com/worktile/ai-table/commit/9d80e8515ac37819e9e7cb69d60dd2ee9e6eba0f))



## [0.1.14](https://github.com/worktile/ai-table/compare/0.1.13...0.1.14) (2025-06-13)


### Bug Fixes

* **field:** fix field name i18n issue #WIK-18234 ([#518](https://github.com/worktile/ai-table/issues/518)) ([6bbdd41](https://github.com/worktile/ai-table/commit/6bbdd41319e3edc8d57c6fda7d8c1d993048b205)), closes [#WIK-18234](https://github.com/worktile/ai-table/issues/WIK-18234)
* **grid:** #WIK-18233 drag select cell automatically scroll the selected cell should remain unchanged ([#517](https://github.com/worktile/ai-table/issues/517)) ([17a3ca5](https://github.com/worktile/ai-table/commit/17a3ca554f9c1c393ac5f5863ae9ed9e9ae6120d)), closes [#WIK-18233](https://github.com/worktile/ai-table/issues/WIK-18233)
* **link:** fix link valid issue #WIK-18228 ([#516](https://github.com/worktile/ai-table/issues/516)) ([85a19c0](https://github.com/worktile/ai-table/commit/85a19c03e4c680013dc8f8502ea5c8566f354292)), closes [#WIK-18228](https://github.com/worktile/ai-table/issues/WIK-18228)


### Features

* **grid:** #WIK-18088 支持隐藏行拖拽、只读模式不显示复选框 ([#513](https://github.com/worktile/ai-table/issues/513)) ([82671ab](https://github.com/worktile/ai-table/commit/82671ab69554289c5171f85dcb7b7b46865a5c3e)), closes [#WIK-18088](https://github.com/worktile/ai-table/issues/WIK-18088)
* **grid:** support switch rich text ([#514](https://github.com/worktile/ai-table/issues/514)) ([fede188](https://github.com/worktile/ai-table/commit/fede188a13c286c59c7428ada0d96ead4f20a18f))
* support batch update field values ([#519](https://github.com/worktile/ai-table/issues/519)) ([eee1e75](https://github.com/worktile/ai-table/commit/eee1e7592d5d4318ea4409d29f4062b95b86b19b))



## [0.1.13](https://github.com/worktile/ai-table/compare/0.1.12...0.1.13) (2025-06-12)


### Bug Fixes

* **grid:** #WIK-18222 拖选单元格垂直滚动选区多选了一列 ([#510](https://github.com/worktile/ai-table/issues/510)) ([cd827a6](https://github.com/worktile/ai-table/commit/cd827a60561119ed71468f763a516222c94ba2ee)), closes [#WIK-18222](https://github.com/worktile/ai-table/issues/WIK-18222)


### Features

* support switch field type #WIK-16049 ([#506](https://github.com/worktile/ai-table/issues/506)) ([022621a](https://github.com/worktile/ai-table/commit/022621a9cb6ad4352aa808634222b99b8ace62cc)), closes [#WIK-16049](https://github.com/worktile/ai-table/issues/WIK-16049)



## [0.1.12](https://github.com/worktile/ai-table/compare/0.1.11...0.1.12) (2025-06-11)


### Features

* #WIK-18214 ai-table的hoverCell 重构成 coverCell ([#507](https://github.com/worktile/ai-table/issues/507)) ([eeea425](https://github.com/worktile/ai-table/commit/eeea425fa250241afa9430bb75f54adfb499c1e9)), closes [#WIK-18214](https://github.com/worktile/ai-table/issues/WIK-18214)
* #WIK-18219 ai-table 增加expandCell方法 ([#508](https://github.com/worktile/ai-table/issues/508)) ([daa8cbc](https://github.com/worktile/ai-table/commit/daa8cbc7159cca9eb6cf848d4f67c34c4aa6af6c)), closes [#WIK-18219](https://github.com/worktile/ai-table/issues/WIK-18219)



## [0.1.11](https://github.com/worktile/ai-table/compare/0.1.10...0.1.11) (2025-06-10)


### Bug Fixes

* **grid:** #WIK-18099 drag the cell after the mouse exceeds the chart, and it is still in the drag state ([#504](https://github.com/worktile/ai-table/issues/504)) ([00c5227](https://github.com/worktile/ai-table/commit/00c52270f3a3c1db1d6134371613cf584c0e5dfa)), closes [#WIK-18099](https://github.com/worktile/ai-table/issues/WIK-18099)



## [0.1.10](https://github.com/worktile/ai-table/compare/0.1.9...0.1.10) (2025-06-10)


### Bug Fixes

* #WIK-18121 【AItable】搜索改丢了，搜索回车关键词不亮了 ([#497](https://github.com/worktile/ai-table/issues/497)) ([11eb295](https://github.com/worktile/ai-table/commit/11eb29569613e27a318bacd38862152ce95cbf9e)), closes [#WIK-18121](https://github.com/worktile/ai-table/issues/WIK-18121)
* #WIK-18169 【AITable】需要支持多语言，不应该出现业务指令 styxI18nTracking ([#498](https://github.com/worktile/ai-table/issues/498)) ([f398510](https://github.com/worktile/ai-table/commit/f3985101cc90cbfc723e460021b038fa2f5997c6)), closes [#WIK-18169](https://github.com/worktile/ai-table/issues/WIK-18169) [#WIK-18169](https://github.com/worktile/ai-table/issues/WIK-18169) [#WIK-18169](https://github.com/worktile/ai-table/issues/WIK-18169)
* fix package-lock new package is-hotkey ([#502](https://github.com/worktile/ai-table/issues/502)) ([27e8c63](https://github.com/worktile/ai-table/commit/27e8c63c99c52c0c9b627b4c7b20f9da5245a122))


### Features

* #WIK-18112 ai-table 自定义字段- hover 交互渲染 ([#495](https://github.com/worktile/ai-table/issues/495)) ([4741467](https://github.com/worktile/ai-table/commit/47414673db24193fd49886e6d41893b2b87dc438)), closes [#WIK-18112](https://github.com/worktile/ai-table/issues/WIK-18112)
* #WIK-18113 ai-table 双击展开渲染交互实现 ([#496](https://github.com/worktile/ai-table/issues/496)) ([5c7c9a2](https://github.com/worktile/ai-table/commit/5c7c9a2c5fcedb982bae2ece7ea28c5610972296)), closes [#WIK-18113](https://github.com/worktile/ai-table/issues/WIK-18113)
* **editor:** support quick edit for single text field #WIK-17835 ([#494](https://github.com/worktile/ai-table/issues/494)) ([bfdfad0](https://github.com/worktile/ai-table/commit/bfdfad00c91469e88830d93cc829e577563eb15c)), closes [#WIK-17835](https://github.com/worktile/ai-table/issues/WIK-17835)
* **grid:** #WIK-17907 supports automatic scrolling of dragging rows, columns, and selecting cells ([#490](https://github.com/worktile/ai-table/issues/490)) ([cbdabab](https://github.com/worktile/ai-table/commit/cbdababfb0c6c28fa13b2d3e321c7885028a8f5b)), closes [#WIK-17907](https://github.com/worktile/ai-table/issues/WIK-17907)
* **link:** support validate by isUrl ([#499](https://github.com/worktile/ai-table/issues/499)) ([58dede6](https://github.com/worktile/ai-table/commit/58dede6191a483f2c8ba4f86fd9d94497554e424))



## [0.1.9](https://github.com/worktile/ai-table/compare/0.1.8...0.1.9) (2025-05-30)


### Bug Fixes

* **utils:** #WIK-18087 when updating records get fieldId index error ([#488](https://github.com/worktile/ai-table/issues/488)) ([bdfd92a](https://github.com/worktile/ai-table/commit/bdfd92aa7d81771ff5d90995a3dd302ded06bd96)), closes [#WIK-18087](https://github.com/worktile/ai-table/issues/WIK-18087)


### Features

* #WIK-18091 ai-table支持在有筛选条件时，新增数据被筛选掉，增加tooltip提示 ([#489](https://github.com/worktile/ai-table/issues/489)) ([d5da91c](https://github.com/worktile/ai-table/commit/d5da91ccb0fccb51c38b87a284945f4fb4aa3998)), closes [#WIK-18091](https://github.com/worktile/ai-table/issues/WIK-18091)
* #WIK-18105 ai-table 支持用户自定义字段 ([#491](https://github.com/worktile/ai-table/issues/491)) ([7c43173](https://github.com/worktile/ai-table/commit/7c431736305cae3eb390529dfde46b0e6f48d7cf)), closes [#WIK-18105](https://github.com/worktile/ai-table/issues/WIK-18105)
* #WIK-18111 ai-table 自定义字段-关联事项 - 静态canvas渲染 ([#492](https://github.com/worktile/ai-table/issues/492)) ([58c6314](https://github.com/worktile/ai-table/commit/58c631410f2d5fd6c14275f9a5c286846ce3b35c)), closes [#WIK-18111](https://github.com/worktile/ai-table/issues/WIK-18111) [#WIK-18111](https://github.com/worktile/ai-table/issues/WIK-18111) [#WIK-18111](https://github.com/worktile/ai-table/issues/WIK-18111) [#WIK-18111](https://github.com/worktile/ai-table/issues/WIK-18111) [#WIK-18111](https://github.com/worktile/ai-table/issues/WIK-18111)



## [0.1.8](https://github.com/worktile/ai-table/compare/0.1.7...0.1.8) (2025-05-23)


### Bug Fixes

* fixed copy field disabled return type ([#486](https://github.com/worktile/ai-table/issues/486)) ([eb3c15f](https://github.com/worktile/ai-table/commit/eb3c15fb20c6f72ed356355d40fe9926ffec6700))



## [0.1.7](https://github.com/worktile/ai-table/compare/0.1.6...0.1.7) (2025-05-23)


### Bug Fixes

* #WIK-18017 【AiTable】右键新增行，需要校验最大量限制 ([#481](https://github.com/worktile/ai-table/issues/481)) ([ddfd6b8](https://github.com/worktile/ai-table/commit/ddfd6b8837f7dfdd465fe0e9c68423bc3558e8d6)), closes [#WIK-18017](https://github.com/worktile/ai-table/issues/WIK-18017)
* **state:** #WIK-18027 maximum limit for copying fields ([#483](https://github.com/worktile/ai-table/issues/483)) ([8867f8d](https://github.com/worktile/ai-table/commit/8867f8d6dd165e54b242fdc5c8d1c090f10dc22d)), closes [#WIK-18027](https://github.com/worktile/ai-table/issues/WIK-18027)


### Features

* #WIK-18019 列的更多菜单「重复」列，位置不正确 ([#482](https://github.com/worktile/ai-table/issues/482)) ([2af4233](https://github.com/worktile/ai-table/commit/2af4233b74cb5d94dc809320d3b507b5a8353446)), closes [#WIK-18019](https://github.com/worktile/ai-table/issues/WIK-18019)



## [0.1.6](https://github.com/worktile/ai-table/compare/0.1.5...0.1.6) (2025-05-21)


### Bug Fixes

* #WIK-17998 【aitable】在一个视图中有筛选的某条数据上方插入一行，在其他视图中被插入行的位置应该在最后 ([756a874](https://github.com/worktile/ai-table/commit/756a874836cdb753529cada6bbd38a29583d51f8)), closes [#WIK-17998](https://github.com/worktile/ai-table/issues/WIK-17998)


### Features

* #WIK-18016 【AiTable】右键新增行中的input输入框无法删除输入内容 ([#479](https://github.com/worktile/ai-table/issues/479)) ([04a48ae](https://github.com/worktile/ai-table/commit/04a48aeb65c06c110dd7d770c73a37f6193e832a)), closes [#WIK-18016](https://github.com/worktile/ai-table/issues/WIK-18016)
* **grid:** #WIK-18008 paste cancel maximum row and column limit prompt ([#478](https://github.com/worktile/ai-table/issues/478)) ([a515bf1](https://github.com/worktile/ai-table/commit/a515bf19b452081fa34726eee9322681fc31df9b)), closes [#WIK-18008](https://github.com/worktile/ai-table/issues/WIK-18008)



## [0.1.5](https://github.com/worktile/ai-table/compare/0.1.4...0.1.5) (2025-05-21)


### Bug Fixes

* **grid:** the select field should be sorted in the order of the options ([2415e9d](https://github.com/worktile/ai-table/commit/2415e9d355b86322646bd56fc0658dad9f502254))



## [0.1.4](https://github.com/worktile/ai-table/compare/0.1.3...0.1.4) (2025-05-20)


### Features

* #WIK-17987 aitable 插入行  i18n 调整 ([7a21b8c](https://github.com/worktile/ai-table/commit/7a21b8cb061afced11016139dc1ee34bb3cd10b1)), closes [#WIK-17987](https://github.com/worktile/ai-table/issues/WIK-17987)



## [0.1.3](https://github.com/worktile/ai-table/compare/0.1.2...0.1.3) (2025-05-19)


### Bug Fixes

* **utils:** #WIK-17975 valid objectId add number type judgment ([94c5b34](https://github.com/worktile/ai-table/commit/94c5b34a2a31135e7ff05746ef5741a39884d648)), closes [#WIK-17975](https://github.com/worktile/ai-table/issues/WIK-17975)



## [0.1.2](https://github.com/worktile/ai-table/compare/0.1.1...0.1.2) (2025-05-19)


### Features

* #WIK-17969 aitable-右键在指定行增加 向上、下插入指定数量行 ([#468](https://github.com/worktile/ai-table/issues/468)) ([fb8ec47](https://github.com/worktile/ai-table/commit/fb8ec4754b2907448832247b41464d63605c404f)), closes [#WIK-17969](https://github.com/worktile/ai-table/issues/WIK-17969)



## [0.1.1](https://github.com/worktile/ai-table/compare/0.1.0...0.1.1) (2025-05-16)


### Bug Fixes

* #WIK-17811 附件icon 压到标题栏 ([#463](https://github.com/worktile/ai-table/issues/463)) ([8e55d30](https://github.com/worktile/ai-table/commit/8e55d3054e09487c581839f01ed4893d26ae9ec9)), closes [#WIK-17811](https://github.com/worktile/ai-table/issues/WIK-17811)
* **grid:** #WIK-17959 cancel the default value of maximum row and column limit ([#466](https://github.com/worktile/ai-table/issues/466)) ([281e968](https://github.com/worktile/ai-table/commit/281e9686ce23ef2a8669ecc25314aa7549d0d493)), closes [#WIK-17959](https://github.com/worktile/ai-table/issues/WIK-17959)
* **grid:** filter invalid value before comparing with the  conditions ([#465](https://github.com/worktile/ai-table/issues/465)) ([bd2cc20](https://github.com/worktile/ai-table/commit/bd2cc20a629a748b7d36c8a60dc3cdb5a98d80ba))



# [0.1.0](https://github.com/worktile/ai-table/compare/0.0.73...0.1.0) (2025-05-14)


### Bug Fixes

* #WIK-17916 【AITable】点击表格底部新增记录后，继续点击相同位置，不应该继续新增 ([#459](https://github.com/worktile/ai-table/issues/459)) ([16dbb3c](https://github.com/worktile/ai-table/commit/16dbb3cb211165ec22c69221e83ab57738769e26)), closes [#WIK-17916](https://github.com/worktile/ai-table/issues/WIK-17916)
* **grid:** import isEmpty from @ai-table/utils ([#455](https://github.com/worktile/ai-table/issues/455)) ([77f462b](https://github.com/worktile/ai-table/commit/77f462b701b919b647830c4d626113ebc7c00712))
* **grid:** import isUndefinedOrNull from @ai-table/utils to replace isNil #WIK-17849 ([#456](https://github.com/worktile/ai-table/issues/456)) ([b66f8bb](https://github.com/worktile/ai-table/commit/b66f8bbfaf03c6f501c29174626b92659994e9de)), closes [#WIK-17849](https://github.com/worktile/ai-table/issues/WIK-17849)
* **grid:** optimize past limit ([#460](https://github.com/worktile/ai-table/issues/460)) ([790deda](https://github.com/worktile/ai-table/commit/790deda4f68a51eacd1f6a214ea27f5f176d59bb))


### Features

* #WIK-17811 附件icon 压到标题栏 ([#458](https://github.com/worktile/ai-table/issues/458)) ([15cad62](https://github.com/worktile/ai-table/commit/15cad62525d2e25bfb7c28bde9c7d83c40f50bd1)), closes [#WIK-17811](https://github.com/worktile/ai-table/issues/WIK-17811)
* **grid:** #WIK-17905 support records limits and columns limits ([#445](https://github.com/worktile/ai-table/issues/445)) ([0206317](https://github.com/worktile/ai-table/commit/0206317e355b1e93e7f4035c624aaeb5913d1590)), closes [#WIK-17905](https://github.com/worktile/ai-table/issues/WIK-17905)


### Reverts

* Revert "feat: #WIK-17811 附件icon 压到标题栏 (#458)" (#462) ([2a177b7](https://github.com/worktile/ai-table/commit/2a177b7a8f64997a7e9ea998bc3ccbcb6deab64c)), closes [#WIK-17811](https://github.com/worktile/ai-table/issues/WIK-17811) [#458](https://github.com/worktile/ai-table/issues/458) [#462](https://github.com/worktile/ai-table/issues/462)



## [0.0.73](https://github.com/worktile/ai-table/compare/0.0.72...0.0.73) (2025-05-09)


### Bug Fixes

* **utils:** correct getValuesByCustomFieldValues logic #WIK-17912 ([#453](https://github.com/worktile/ai-table/issues/453)) ([ebe2f21](https://github.com/worktile/ai-table/commit/ebe2f214d9f7e5ed7620e03484a5034350e49297)), closes [#WIK-17912](https://github.com/worktile/ai-table/issues/WIK-17912)



## [0.0.72](https://github.com/worktile/ai-table/compare/0.0.71...0.0.72) (2025-05-09)


### Bug Fixes

* **utils:** #WIK-17722 coordinate changes to the updater ([#451](https://github.com/worktile/ai-table/issues/451)) ([67c84f2](https://github.com/worktile/ai-table/commit/67c84f2e210c3f0afdc2411b2cea769720a88c6a)), closes [#WIK-17722](https://github.com/worktile/ai-table/issues/WIK-17722)



## [0.0.71](https://github.com/worktile/ai-table/compare/0.0.70...0.0.71) (2025-05-09)


### Bug Fixes

* **drag:** #WIK-17900 drag columns do not cross the freezing border ([#448](https://github.com/worktile/ai-table/issues/448)) ([7750c70](https://github.com/worktile/ai-table/commit/7750c702c235bb4b466cfb0686d9174d1aebf623)), closes [#WIK-17900](https://github.com/worktile/ai-table/issues/WIK-17900)
* fix isEmpty because  lodash treating number as empty ([#447](https://github.com/worktile/ai-table/issues/447)) ([62bb8f3](https://github.com/worktile/ai-table/commit/62bb8f38b048eef007563214518355608d1e60ed))


### Features

* should not update updated_at and updated_by when add field or remove field #WIK-17903 ([#449](https://github.com/worktile/ai-table/issues/449)) ([7fad1da](https://github.com/worktile/ai-table/commit/7fad1da70222978dd75d646cc3d5f42b16d0dab4)), closes [#WIK-17903](https://github.com/worktile/ai-table/issues/WIK-17903)



## [0.0.70](https://github.com/worktile/ai-table/compare/0.0.69...0.0.70) (2025-05-08)


### Features

* **utils:** support to handle ghost cells ([#429](https://github.com/worktile/ai-table/issues/429)) ([7830980](https://github.com/worktile/ai-table/commit/7830980d47f3c2f2bc74eb871190733713408d73))



## [0.0.69](https://github.com/worktile/ai-table/compare/0.0.68...0.0.69) (2025-05-07)


### Features

* #WIK-17886 utils-transformValue处理 ([#433](https://github.com/worktile/ai-table/issues/433)) ([f2c59a2](https://github.com/worktile/ai-table/commit/f2c59a27b63f0008e66cf721d2c8c81a3c389014)), closes [#WIK-17886](https://github.com/worktile/ai-table/issues/WIK-17886) [#WIK-17886](https://github.com/worktile/ai-table/issues/WIK-17886) [#WIK-17886](https://github.com/worktile/ai-table/issues/WIK-17886)



## [0.0.68](https://github.com/worktile/ai-table/compare/0.0.67...0.0.68) (2025-05-07)


### Features

* #WIK-17884 【AiTable】支持隐藏序号列 ([0df7272](https://github.com/worktile/ai-table/commit/0df7272f0e104f88e9758d5467ab6b37c7fba82d)), closes [#WIK-17884](https://github.com/worktile/ai-table/issues/WIK-17884)



## [0.0.67](https://github.com/worktile/ai-table/compare/0.0.66...0.0.67) (2025-05-06)


### Bug Fixes

* #WIK-17677 🔗字段赋值后，点击 ai-table 意外区域后面的 icon 无法取消（ai-table 区域可以） ([#408](https://github.com/worktile/ai-table/issues/408)) ([8d95034](https://github.com/worktile/ai-table/commit/8d95034919ced2c9eba1132fae524c0c8629befb)), closes [#WIK-17677](https://github.com/worktile/ai-table/issues/WIK-17677)
* #WIK-17881 文本、选择字段双击编辑报错 ([#427](https://github.com/worktile/ai-table/issues/427)) ([e72f1c2](https://github.com/worktile/ai-table/commit/e72f1c2f9a7b1c31684e1835c98c9028d2da8bfd)), closes [#WIK-17881](https://github.com/worktile/ai-table/issues/WIK-17881)
* **action:** add field error #WIK-17859 ([6d74c80](https://github.com/worktile/ai-table/commit/6d74c80857ac9f6921728f29cb1c094bf515df99)), closes [#WIK-17859](https://github.com/worktile/ai-table/issues/WIK-17859)


### Features

* #WIK-17780 前端改造接入 utils 库 ([#415](https://github.com/worktile/ai-table/issues/415)) ([30a0716](https://github.com/worktile/ai-table/commit/30a07169552d704b1be90b1c78d2541c5591bbf6)), closes [#WIK-17780](https://github.com/worktile/ai-table/issues/WIK-17780)
* #WIK-17858 撤销重做 重构 ([#412](https://github.com/worktile/ai-table/issues/412)) ([8a20330](https://github.com/worktile/ai-table/commit/8a2033028fd9cbc1401f47684dc6689a0f3bb43b)), closes [#WIK-17858](https://github.com/worktile/ai-table/issues/WIK-17858)
* #WIK-17869 前端-type类型接入utils库中的type ([#423](https://github.com/worktile/ai-table/issues/423)) ([2617a9a](https://github.com/worktile/ai-table/commit/2617a9a57d1f36c57b74b4df3d99cea8e60b25d6)), closes [#WIK-17869](https://github.com/worktile/ai-table/issues/WIK-17869)
* improve demo ([#419](https://github.com/worktile/ai-table/issues/419)) ([4dcb03b](https://github.com/worktile/ai-table/commit/4dcb03b9869a4b3068f0f3d04527d3dec942c241))
* remove AI_TABLE_CONTENT_FIELD_NAME from state ([711af17](https://github.com/worktile/ai-table/commit/711af1725988648c9206a53822bc5759555ef776))
* **utils:** move array-event(to-table) to utils package #WIK-17878 ([#426](https://github.com/worktile/ai-table/issues/426)) ([9e34720](https://github.com/worktile/ai-table/commit/9e34720b169b5079f9dc1eadb7bec54180b5aa96)), closes [#WIK-17878](https://github.com/worktile/ai-table/issues/WIK-17878)



## [0.0.66](https://github.com/worktile/ai-table/compare/0.0.65...0.0.66) (2025-04-27)


### Bug Fixes

* **drag:** add prefix for drag-container class #WIK-17855 ([99cae77](https://github.com/worktile/ai-table/commit/99cae772d6d81740a82fee10f1f2760a0c8f4cad)), closes [#WIK-17855](https://github.com/worktile/ai-table/issues/WIK-17855)



## [0.0.65](https://github.com/worktile/ai-table/compare/0.0.64...0.0.65) (2025-04-27)


### Bug Fixes

* **drag:** #WIK-17847 fix column drag line position when dragging to frozen column area ([#407](https://github.com/worktile/ai-table/issues/407)) ([a44ffb6](https://github.com/worktile/ai-table/commit/a44ffb6cb8d0d9cdbb4271c7325c448344d531a9))
* **grid:** #WIK-17850 fix potential null references ([3ebfc3e](https://github.com/worktile/ai-table/commit/3ebfc3e4c620e933c33802881a04cbc54f1850da))
* **grid:** should not paste empty option and  fix array access out of bounds error ([#405](https://github.com/worktile/ai-table/issues/405)) ([d8f9eb2](https://github.com/worktile/ai-table/commit/d8f9eb205e7df801feb4bc2a5c9ed77417f61703))
* **grid:** show blank when first create table ([#409](https://github.com/worktile/ai-table/issues/409)) ([b394418](https://github.com/worktile/ai-table/commit/b3944189d765a45d572a5a534d4817e36be09e18))


### Features

* **grid:** the field name manually entered by the user should not be overwritten after modifying the field type ([#406](https://github.com/worktile/ai-table/issues/406)) ([9d9e868](https://github.com/worktile/ai-table/commit/9d9e868dc14ae456593d13fb08849c0fe0f492f5))



## [0.0.64](https://github.com/worktile/ai-table/compare/0.0.63...0.0.64) (2025-04-25)


### Bug Fixes

* **grid:** should not cancel user's selection rows when click table row head ([#402](https://github.com/worktile/ai-table/issues/402)) ([a6ccb3f](https://github.com/worktile/ai-table/commit/a6ccb3f99887da776c8c41405faa8e47b5fc02c0))



## [0.0.63](https://github.com/worktile/ai-table/compare/0.0.62...0.0.63) (2025-04-25)


### Bug Fixes

* #WIK-17809 数据异常 AITableText ([#399](https://github.com/worktile/ai-table/issues/399)) ([4053b6c](https://github.com/worktile/ai-table/commit/4053b6c49063f3f5e0b79b55475d3a7dbf85de9f)), closes [#WIK-17809](https://github.com/worktile/ai-table/issues/WIK-17809)
* **field:** add existence check for fields in addField function ([#400](https://github.com/worktile/ai-table/issues/400)) ([43c2972](https://github.com/worktile/ai-table/commit/43c29723ba992e0b9c432b38777e14fdbfa15c6d))



## [0.0.62](https://github.com/worktile/ai-table/compare/0.0.61...0.0.62) (2025-04-24)


### Bug Fixes

* **grid:** should not close editor panel when click panel ([#397](https://github.com/worktile/ai-table/issues/397)) ([caa40f6](https://github.com/worktile/ai-table/commit/caa40f6f35c81e553eb5e2318f6ccc78638e073d))


### Features

* #WIK-17779 【Utils】确定 field-model 复用方案（isValid + cellFullText） ([#389](https://github.com/worktile/ai-table/issues/389)) ([d4b6f29](https://github.com/worktile/ai-table/commit/d4b6f29c0da1790a5548c60ea0e5d8ed036d8387)), closes [#WIK-17779](https://github.com/worktile/ai-table/issues/WIK-17779)



## [0.0.61](https://github.com/worktile/ai-table/compare/0.0.60...0.0.61) (2025-04-24)


### Bug Fixes

* **demo:** #WIK-17817 fixed the edit column menu not being displayed ([#395](https://github.com/worktile/ai-table/issues/395)) ([30ad5de](https://github.com/worktile/ai-table/commit/30ad5de89568699d79e430e0e0d6dc8be2855a67))
* **grid:** #WIK-17724 show more menus Keep column titles hovered ([#390](https://github.com/worktile/ai-table/issues/390)) ([a12129c](https://github.com/worktile/ai-table/commit/a12129c53a0e0f2cdc890f37af42ccbc84fc8acf)), closes [#WIK-17724](https://github.com/worktile/ai-table/issues/WIK-17724)
* **grid:** calculate scrolling maxwidth Add field Add button width ([#391](https://github.com/worktile/ai-table/issues/391)) ([f3bebb3](https://github.com/worktile/ai-table/commit/f3bebb30837159eb3fd03919a7198661368c79f2))
* **grid:** fix active cell border ([#393](https://github.com/worktile/ai-table/issues/393)) ([47f5660](https://github.com/worktile/ai-table/commit/47f56606f969b8ae06601f5ec6caafdc1f922503))
* **grid:** fix scrollMaxWidth to make sure it's not less than the container width ([#394](https://github.com/worktile/ai-table/issues/394)) ([6c82d89](https://github.com/worktile/ai-table/commit/6c82d8927c07a710a96eeab0fe57c09ac5a3d8fd))
* **state:** #WIK-17815 new field should remove position ([#392](https://github.com/worktile/ai-table/issues/392)) ([9788968](https://github.com/worktile/ai-table/commit/97889686808b5d9e16d18625bf9d8bbba0c81f2b)), closes [#WIK-17815](https://github.com/worktile/ai-table/issues/WIK-17815)



## [0.0.60](https://github.com/worktile/ai-table/compare/0.0.59...0.0.60) (2025-04-23)


### Bug Fixes

* #WIK-17804 附件很多的时候拉宽后，换行 ([#386](https://github.com/worktile/ai-table/issues/386)) ([7130f80](https://github.com/worktile/ai-table/commit/7130f80f73987970d55d515692a25ed1b190ef0a)), closes [#WIK-17804](https://github.com/worktile/ai-table/issues/WIK-17804)
* **grid:** #WIK-17730 mouse movement of non-table areas should set the default point ([#385](https://github.com/worktile/ai-table/issues/385)) ([68ecefb](https://github.com/worktile/ai-table/commit/68ecefbd7f27030ea556be6111cce84093830d35)), closes [#WIK-17730](https://github.com/worktile/ai-table/issues/WIK-17730)
* **grid:** #WIK-17775 fixed calculating the maximum width of the table ([#387](https://github.com/worktile/ai-table/issues/387)) ([dbf73e1](https://github.com/worktile/ai-table/commit/dbf73e12108c7a9a7e8dc17665851d6029121a51))



## [0.0.59](https://github.com/worktile/ai-table/compare/0.0.58...0.0.59) (2025-04-23)


### Bug Fixes

* **grid:** render the number of stars according to the column width dynamically for rate ([#383](https://github.com/worktile/ai-table/issues/383)) ([a72daae](https://github.com/worktile/ai-table/commit/a72daaea4442ef3330aa3fcfaf63caf36c9c4fc0))



## [0.0.58](https://github.com/worktile/ai-table/compare/0.0.57...0.0.58) (2025-04-22)


### Bug Fixes

* **drag:** #WIK-17762 scrolling and drag position calculation problem ([#376](https://github.com/worktile/ai-table/issues/376)) ([5bdf70e](https://github.com/worktile/ai-table/commit/5bdf70e6707b40db6f2fc89da16d030e2e596e4b)), closes [#WIK-17762](https://github.com/worktile/ai-table/issues/WIK-17762)
* **grid:** #WIK-17771 readonly and disable drag hides drag icons ([#380](https://github.com/worktile/ai-table/issues/380)) ([db80570](https://github.com/worktile/ai-table/commit/db8057062c58154a7775b5ba6b86c02a9cf33def)), closes [#WIK-17771](https://github.com/worktile/ai-table/issues/WIK-17771)
* **grid:** filter out invalid attachment value when pasting ([#381](https://github.com/worktile/ai-table/issues/381)) ([884afde](https://github.com/worktile/ai-table/commit/884afde5a490fc5710b8209be837919f43d41b4d))
* **state:** #WIK-17768 addRecords aiTable.gridData() records ([#377](https://github.com/worktile/ai-table/issues/377)) ([93a80d9](https://github.com/worktile/ai-table/commit/93a80d9122f53d9a4825cc192b9edff0edd59652)), closes [#WIK-17768](https://github.com/worktile/ai-table/issues/WIK-17768)



## [0.0.57](https://github.com/worktile/ai-table/compare/0.0.56...0.0.57) (2025-04-22)


### Features

* #WIK-17761 【AiTable】筛选条件下，新增数据交互 ([0658091](https://github.com/worktile/ai-table/commit/065809151f97d8ec567d62a57dfbfb2a6dd78ae2)), closes [#WIK-17761](https://github.com/worktile/ai-table/issues/WIK-17761)
* #WIK-17761 【AiTable】筛选条件下，新增数据交互 ([9682ebc](https://github.com/worktile/ai-table/commit/9682ebce1fed85a08168ef1761f1b30a313ca359)), closes [#WIK-17761](https://github.com/worktile/ai-table/issues/WIK-17761)
* **grid:** remove progerss editor dom, use canvas technology to draw progress and support edit ([#368](https://github.com/worktile/ai-table/issues/368)) ([b80eb9d](https://github.com/worktile/ai-table/commit/b80eb9d66da9edfd8873aaead78c469e9d8cf7f4))
* **grid:** support copy attachment and paste to attachment cell ([#374](https://github.com/worktile/ai-table/issues/374)) ([9ca9521](https://github.com/worktile/ai-table/commit/9ca9521f3727e1405b314a77bd6285a8af4e1490))



## [0.0.56](https://github.com/worktile/ai-table/compare/0.0.55...0.0.56) (2025-04-21)


### Bug Fixes

* **grid:** should render stars when rate cellValue is null ([#362](https://github.com/worktile/ai-table/issues/362)) ([a7d4aeb](https://github.com/worktile/ai-table/commit/a7d4aebad03d4aa5075d429412449869d8ccc10d))


### Features

* #WIK-17748 cell-drawer 时，各个字段类型的canvas渲染兼容 null ([#363](https://github.com/worktile/ai-table/issues/363)) ([f5d9f84](https://github.com/worktile/ai-table/commit/f5d9f84ea0edffcb2e4429d0444aa372cd4279ed)), closes [#WIK-17748](https://github.com/worktile/ai-table/issues/WIK-17748)
* **drag:** #WIK-17630 support row drag sorting ([#365](https://github.com/worktile/ai-table/issues/365)) ([96d39a7](https://github.com/worktile/ai-table/commit/96d39a705a6deff8c86c70ac49d02311825fa616)), closes [#WIK-17630](https://github.com/worktile/ai-table/issues/WIK-17630)
* **drag:** #WIK-17753 support parameter control to disable row drag ([#367](https://github.com/worktile/ai-table/issues/367)) ([8e90dce](https://github.com/worktile/ai-table/commit/8e90dcea1f2582a18323351be2a381aba84b3796)), closes [#WIK-17753](https://github.com/worktile/ai-table/issues/WIK-17753)
* **grid:** #WIK-17752 adjust the width of the ordinal number column and add drag icon rendering ([#364](https://github.com/worktile/ai-table/issues/364)) ([fd68a9b](https://github.com/worktile/ai-table/commit/fd68a9b806a9bd3f7a8efe3f86d3f58396ca1e94)), closes [#WIK-17752](https://github.com/worktile/ai-table/issues/WIK-17752)



## [0.0.55](https://github.com/worktile/ai-table/compare/0.0.54...0.0.55) (2025-04-18)


### Features

* **grid:** support edit rate field value on canvas when has editing permission ([fd8fc14](https://github.com/worktile/ai-table/commit/fd8fc149494fa9df21115079d1071535c9635fe4))
* **grid:** use canvas technology to draw the rate component ([af38fda](https://github.com/worktile/ai-table/commit/af38fda676406a85c5132c17757caac11cc383e5))



## [0.0.54](https://github.com/worktile/ai-table/compare/0.0.53...0.0.54) (2025-04-18)


### Bug Fixes

* fixed object id can not insert yjs ([#357](https://github.com/worktile/ai-table/issues/357)) ([b0bff93](https://github.com/worktile/ai-table/commit/b0bff93f608d019511b1a4f0ae035acf9c540062))



## [0.0.53](https://github.com/worktile/ai-table/compare/0.0.52...0.0.53) (2025-04-18)


### Bug Fixes

* #WIK-17677 🔗字段赋值后，点击 ai-table 意外区域后面的 icon 无法取消（ai-table 区域可以） ([#351](https://github.com/worktile/ai-table/issues/351)) ([f65db5b](https://github.com/worktile/ai-table/commit/f65db5b8355fe34864ee3df9b6006284a0e560ad)), closes [#WIK-17677](https://github.com/worktile/ai-table/issues/WIK-17677)
* #WIK-17701 附件图标修改 ([#352](https://github.com/worktile/ai-table/issues/352)) ([c89c0bd](https://github.com/worktile/ai-table/commit/c89c0bdb1262c974638191316809d0b62f9cdeb5)), closes [#WIK-17701](https://github.com/worktile/ai-table/issues/WIK-17701)
* #WIK-17717 初始化的单选字段编辑列添加数据项后点击确定，实际数据项未被保存 ([#353](https://github.com/worktile/ai-table/issues/353)) ([4e533f6](https://github.com/worktile/ai-table/commit/4e533f6876fb6e6ebf61f7b524380fffbc0e6af3)), closes [#WIK-17717](https://github.com/worktile/ai-table/issues/WIK-17717)


### Features

* #WIK-17571 基于 yjs 方案实现撤销、重做 ([#350](https://github.com/worktile/ai-table/issues/350)) ([1f3d9ea](https://github.com/worktile/ai-table/commit/1f3d9ea0c7a5a72465cadb20a168bc6510e0186e)), closes [#WIK-17571](https://github.com/worktile/ai-table/issues/WIK-17571)



## [0.0.52](https://github.com/worktile/ai-table/compare/0.0.51...0.0.52) (2025-04-16)


### Features

* utils build use tsc ([#348](https://github.com/worktile/ai-table/issues/348)) ([0cc19d5](https://github.com/worktile/ai-table/commit/0cc19d5cb4825fbabd083f35ee6078c00c830538))



## [0.0.51](https://github.com/worktile/ai-table/compare/0.0.50...0.0.51) (2025-04-15)


### Bug Fixes

* #WIK-17644 选中单元格（附件或者多行文本），在触发滚动条时，hover渲染的元素没有跟着滚动 ([#343](https://github.com/worktile/ai-table/issues/343)) ([c37292f](https://github.com/worktile/ai-table/commit/c37292f16951b15f23d16c4afde51998795595ef)), closes [#WIK-17644](https://github.com/worktile/ai-table/issues/WIK-17644)
* **grid:** #WIK-17643 mouse leaves canvas without clearing the point status ([#342](https://github.com/worktile/ai-table/issues/342)) ([2900b6f](https://github.com/worktile/ai-table/commit/2900b6f680680b94b15fd9f4ba5a83fac05fa7b2)), closes [#WIK-17643](https://github.com/worktile/ai-table/issues/WIK-17643)
* **state:** #WIK-17637 calculated field location should contain the location of index 0 ([#341](https://github.com/worktile/ai-table/issues/341)) ([470ac96](https://github.com/worktile/ai-table/commit/470ac96dc741fa32887c9ad7679004a208898950)), closes [#WIK-17637](https://github.com/worktile/ai-table/issues/WIK-17637)


### Features

* #WIK-17679 所有可以为 null 字段，都设置一个 null 的值验证所有逻辑可以不报错 ([#346](https://github.com/worktile/ai-table/issues/346)) ([9eaf7c1](https://github.com/worktile/ai-table/commit/9eaf7c1c0613eca93a3312be361f054074333bee)), closes [#WIK-17679](https://github.com/worktile/ai-table/issues/WIK-17679)
* ai table types add key ([#345](https://github.com/worktile/ai-table/issues/345)) ([6aa2e67](https://github.com/worktile/ai-table/commit/6aa2e67aa023b9467fee727c6c74921d0b0f0e83))
* **field-model:** verify field value before update field or insert r… ([#344](https://github.com/worktile/ai-table/issues/344)) ([54b7c5e](https://github.com/worktile/ai-table/commit/54b7c5e775c20031acacbab6b2990cc9d495423d))



## [0.0.50](https://github.com/worktile/ai-table/compare/0.0.49...0.0.50) (2025-04-10)


### Bug Fixes

* #WIK-17629 【AiTable】readonly时，禁止双击编辑 ([#335](https://github.com/worktile/ai-table/issues/335)) ([caf16a8](https://github.com/worktile/ai-table/commit/caf16a8f134f01054b0d66c7b7be809df0d2f9b7)), closes [#WIK-17629](https://github.com/worktile/ai-table/issues/WIK-17629)
* **field-menu:** show field menu only field has value #WIK-17634 ([#336](https://github.com/worktile/ai-table/issues/336)) ([edb32d4](https://github.com/worktile/ai-table/commit/edb32d46ca80a9cafa0b6aca8ee75149202c9f7e)), closes [#WIK-17634](https://github.com/worktile/ai-table/issues/WIK-17634)


### Features

* #WIK-17567 aitable-多行文本筛选排序 ([#337](https://github.com/worktile/ai-table/issues/337)) ([6f0e9a6](https://github.com/worktile/ai-table/commit/6f0e9a66da4b5fea653df1138f14eda25b0d9e8a)), closes [#WIK-17567](https://github.com/worktile/ai-table/issues/WIK-17567)
* **grid:** support copy and paste rich text ([#338](https://github.com/worktile/ai-table/issues/338)) ([1385f95](https://github.com/worktile/ai-table/commit/1385f95dd2afa55212a1367c77d0972c28223e8e))



## [0.0.49](https://github.com/worktile/ai-table/compare/0.0.48...0.0.49) (2025-04-09)


### Bug Fixes

* **drag:** #WIK-17618 fixed the error of dragging columns and column widths ([#332](https://github.com/worktile/ai-table/issues/332)) ([b977744](https://github.com/worktile/ai-table/commit/b97774439b8f9af98e61f0d4788f2b411ac660a6))
* **drag:** #WIK-17622 mouse should not be in col-resize style in read-only mode ([#330](https://github.com/worktile/ai-table/issues/330)) ([bb1929a](https://github.com/worktile/ai-table/commit/bb1929a33c19575c6e325eca5dda28b789096abd)), closes [#WIK-17622](https://github.com/worktile/ai-table/issues/WIK-17622)
* **grid:** the page render is error when fields is [] ([#327](https://github.com/worktile/ai-table/issues/327)) ([006aeab](https://github.com/worktile/ai-table/commit/006aeabfeff8c12bf27d7e965fb36d2470b306f7))


### Features

* #WIK-17533 【aitable】支持 readonly 下也需要抛出事件 ([#329](https://github.com/worktile/ai-table/issues/329)) ([9f60d96](https://github.com/worktile/ai-table/commit/9f60d96ccf6f2056adb06d5594419778bbb4cd81)), closes [#WIK-17533](https://github.com/worktile/ai-table/issues/WIK-17533)
* add type Id ([dbeb9f0](https://github.com/worktile/ai-table/commit/dbeb9f0d085c2545741f0b22e8cc839cebbc7b84))
* add utils package ([17dbfe3](https://github.com/worktile/ai-table/commit/17dbfe3c3b3f01fa0cf608ebc8d3c13bbee62654))
* add utils package ([b9df1fc](https://github.com/worktile/ai-table/commit/b9df1fc3f42f2bcd6a5ad5129aebfb21606633d9))



## [0.0.48](https://github.com/worktile/ai-table/compare/0.0.47...0.0.48) (2025-04-09)


### Bug Fixes

* #WIK-17613 【AiTable】链接 字段编辑后，文本渲染有问题 ([#325](https://github.com/worktile/ai-table/issues/325)) ([bc5a47c](https://github.com/worktile/ai-table/commit/bc5a47c6fcd094c3480067dfb1f31d0070af21a7)), closes [#WIK-17613](https://github.com/worktile/ai-table/issues/WIK-17613)
* **drag:** #WIK-17601 fixed the width drag and the content cannot be selected ([#324](https://github.com/worktile/ai-table/issues/324)) ([aa67514](https://github.com/worktile/ai-table/commit/aa67514b77568fb07b61270bd6e14ccc57842cdd))


### Features

* #WIK-17568 ai-table 渲染：文字 + 编辑图标 ([#316](https://github.com/worktile/ai-table/issues/316)) ([ec2ff2f](https://github.com/worktile/ai-table/commit/ec2ff2fe2822ed3655f3c19430e586a4626d3c4e)), closes [#WIK-17568](https://github.com/worktile/ai-table/issues/WIK-17568)



## [0.0.47](https://github.com/worktile/ai-table/compare/0.0.46...0.0.47) (2025-04-08)


### Features

* **grid:** support paste pure link value to link cell ([#322](https://github.com/worktile/ai-table/issues/322)) ([2feab9c](https://github.com/worktile/ai-table/commit/2feab9cead1cf10f489542755ece7299483c0c33))



## [0.0.46](https://github.com/worktile/ai-table/compare/0.0.45...0.0.46) (2025-04-07)


### Bug Fixes

* **grid:** append option when pasting, the correct bg_color should be set ([#319](https://github.com/worktile/ai-table/issues/319)) ([8b67bd7](https://github.com/worktile/ai-table/commit/8b67bd77669ba25a9a1a0c3d1957ef32696dd314))


### Features

* **drag:** #WIK-17534 support column drag and drop adjustment width ([#318](https://github.com/worktile/ai-table/issues/318)) ([c2aa429](https://github.com/worktile/ai-table/commit/c2aa4292a0c2ff3413fa4e1b784d96fd397397e3)), closes [#WIK-17534](https://github.com/worktile/ai-table/issues/WIK-17534)
* **grid:** when readonly, copy or paste is prohibited ([#317](https://github.com/worktile/ai-table/issues/317)) ([d7b0494](https://github.com/worktile/ai-table/commit/d7b04949d7d82850a74bf714f7046fcb636c63f6))



## [0.0.45](https://github.com/worktile/ai-table/compare/0.0.44...0.0.45) (2025-04-03)


### Bug Fixes

* fix i18n issues ([#314](https://github.com/worktile/ai-table/issues/314)) ([85472f1](https://github.com/worktile/ai-table/commit/85472f1e02cc3cc39fa7ed31248dbc339cf4dcef))
* **grid:** resolve conflict between quick paste cell and quick paste editor ([#312](https://github.com/worktile/ai-table/issues/312)) ([70eb42b](https://github.com/worktile/ai-table/commit/70eb42b15dd43e05c02735ff98f96b589857e0d0))
* **state:** optimized the location of the new field for collaboration ([#308](https://github.com/worktile/ai-table/issues/308)) ([d7f1da1](https://github.com/worktile/ai-table/commit/d7f1da1843043f91adddc343570e76a89bf5d797))


### Features

* **drag:** #WIK-17586 optimize the drag component ([#313](https://github.com/worktile/ai-table/issues/313)) ([8ba7c01](https://github.com/worktile/ai-table/commit/8ba7c015b05482380372e8d9b369795798f3c6fc)), closes [#WIK-17586](https://github.com/worktile/ai-table/issues/WIK-17586)
* **grid:** unify the naming conventions for add view and add field ([#309](https://github.com/worktile/ai-table/issues/309)) ([8159531](https://github.com/worktile/ai-table/commit/815953199d8db31c4e00c0844e92a7fcded57718))
* **i18n:**  support i18n #WIK-17582 ([#306](https://github.com/worktile/ai-table/issues/306)) ([465ffa5](https://github.com/worktile/ai-table/commit/465ffa5e54e4843d022da60bff0b3d5ba6f3ec1f)), closes [#WIK-17582](https://github.com/worktile/ai-table/issues/WIK-17582)
* **i18n:** support i1n8 ([#311](https://github.com/worktile/ai-table/issues/311)) ([699e1a6](https://github.com/worktile/ai-table/commit/699e1a6e004d7b9b0e6c22c6524881711e4f3b5b))



## [0.0.44](https://github.com/worktile/ai-table/compare/0.0.43...0.0.44) (2025-04-02)


### Bug Fixes

* **state:** #WIK-17560 collaborate to create multiple data scrambles at the same time ([#304](https://github.com/worktile/ai-table/issues/304)) ([fa6e125](https://github.com/worktile/ai-table/commit/fa6e125d18cf88df48ef397a6f0d5df32dacd4db)), closes [#WIK-17560](https://github.com/worktile/ai-table/issues/WIK-17560)


### Features

* #WIK-17459 附件hover 交互 ([#277](https://github.com/worktile/ai-table/issues/277)) ([8f79178](https://github.com/worktile/ai-table/commit/8f79178d67f4e067813e669cab37479ca66eb4b3)), closes [#WIK-17459](https://github.com/worktile/ai-table/issues/WIK-17459)
* **grid:** if the value copied from other attributes such as text, select, link, member, etc. conforms to the date format, it can be pasted into the date cell ([#302](https://github.com/worktile/ai-table/issues/302)) ([25b80cc](https://github.com/worktile/ai-table/commit/25b80cc693a4d03dbe761fbad2a3c80728948d10))
* **grid:** support customize field menu name based on field type ([#305](https://github.com/worktile/ai-table/issues/305)) ([c0cd93b](https://github.com/worktile/ai-table/commit/c0cd93b26c5c16444354061655e6987846dbfa67))
* **grid:** support pasting text with % into progress cell ([#301](https://github.com/worktile/ai-table/issues/301)) ([6bba86e](https://github.com/worktile/ai-table/commit/6bba86e4c8e2f93d8b0862fd145ea55b8f9222c2))
* **state:** unify the naming conventions for copied view and copied field ([#303](https://github.com/worktile/ai-table/issues/303)) ([f41eccb](https://github.com/worktile/ai-table/commit/f41eccb54357a779380664537a43a0ccfb15bd61))



## [0.0.43](https://github.com/worktile/ai-table/compare/0.0.42...0.0.43) (2025-03-28)


### Bug Fixes

* **drag:** #WIK-17508 Fixed new columns, copy columns, read-only mode drag ([#298](https://github.com/worktile/ai-table/issues/298)) ([642bfb7](https://github.com/worktile/ai-table/commit/642bfb74009804418eaebcaf6948cb569f9c68a5))
* **grid:** support paste from excel ([#296](https://github.com/worktile/ai-table/issues/296)) ([223277b](https://github.com/worktile/ai-table/commit/223277bd0d45971957213f6fe23c37de72b7fbee))
* **link:** correct notify format #WIK-17464 ([#297](https://github.com/worktile/ai-table/issues/297)) ([89ecf2a](https://github.com/worktile/ai-table/commit/89ecf2ae559be31660cf73079dbd2ca5c82e8332)), closes [#WIK-17464](https://github.com/worktile/ai-table/issues/WIK-17464)


### Features

* **grid:** support recognize multiple formats for date ([#295](https://github.com/worktile/ai-table/issues/295)) ([45d39ad](https://github.com/worktile/ai-table/commit/45d39ad9050ab3feaeb3c7dcbae2e0621d44ad6a))



## [0.0.42](https://github.com/worktile/ai-table/compare/0.0.41...0.0.42) (2025-03-28)


### Bug Fixes

* **drag:** #WIK-17515 fixed calculations that moved to the first and last column positions ([#290](https://github.com/worktile/ai-table/issues/290)) ([297b1e4](https://github.com/worktile/ai-table/commit/297b1e4baae4d5cd4d2a1e525e9e9ef403c380df))
* **grid:** cellValue may be null when copy empty cell ([#293](https://github.com/worktile/ai-table/issues/293)) ([88a486e](https://github.com/worktile/ai-table/commit/88a486ef478b0932b95837e33ee76e1f7513927f))


### Features

* **grid:** support read from clipboard when visit http adress ([#292](https://github.com/worktile/ai-table/issues/292)) ([c2668f5](https://github.com/worktile/ai-table/commit/c2668f5565836a639b66ecef9b1886b9a59413a9))
* **state:** #WIK-17516 drag fields support collaboration ([#291](https://github.com/worktile/ai-table/issues/291)) ([1481415](https://github.com/worktile/ai-table/commit/1481415ff376de1d5e764c17454fbe6856685c91)), closes [#WIK-17516](https://github.com/worktile/ai-table/issues/WIK-17516)



## [0.0.41](https://github.com/worktile/ai-table/compare/0.0.40...0.0.41) (2025-03-27)


### Bug Fixes

* #WIK-17450 【aitable】增加筛选条件后，新增数据报错 ([#271](https://github.com/worktile/ai-table/issues/271)) ([6223b29](https://github.com/worktile/ai-table/commit/6223b29d79988b4d889c553dfdab2a82ba323513)), closes [#WIK-17450](https://github.com/worktile/ai-table/issues/WIK-17450)
* **select-editor:** update select value by ngModelChange #WIK-17463 ([#278](https://github.com/worktile/ai-table/issues/278)) ([f4fa058](https://github.com/worktile/ai-table/commit/f4fa05836c9d361d44c2a23079d5d65b12ea3e2e)), closes [#WIK-17463](https://github.com/worktile/ai-table/issues/WIK-17463)


### Features

* #WIK-17458 定义附件数据结构，canvas 绘制 ([#273](https://github.com/worktile/ai-table/issues/273)) ([b290de6](https://github.com/worktile/ai-table/commit/b290de672240beba5d5bdf62863d14319f699398)), closes [#WIK-17458](https://github.com/worktile/ai-table/issues/WIK-17458)
* #WIK-17491 【前端】附件canvas以image的方式绘制svg文件图标 ([#280](https://github.com/worktile/ai-table/issues/280)) ([8886e60](https://github.com/worktile/ai-table/commit/8886e60fd99047d2aeab36b96422ee7e98cf4b86)), closes [#WIK-17491](https://github.com/worktile/ai-table/issues/WIK-17491)
* #WIK-17510 【aitable】附件dbclick进入编辑模式 ([59f103a](https://github.com/worktile/ai-table/commit/59f103a18f1203f0390a167b30f1374a94de1ab0)), closes [#WIK-17510](https://github.com/worktile/ai-table/issues/WIK-17510) [#WIK-17510](https://github.com/worktile/ai-table/issues/WIK-17510)
* apply imageMapOnload ([#272](https://github.com/worktile/ai-table/issues/272)) ([f5b430f](https://github.com/worktile/ai-table/commit/f5b430fa590833539e93bff8c6ebb0292dd35023))
* **drag:** #WIK-17443 support column drag and drop to adjust position ([#282](https://github.com/worktile/ai-table/issues/282)) ([48ecc4e](https://github.com/worktile/ai-table/commit/48ecc4e116c0d9763f0f5cfad24e78179d173819)), closes [#WIK-17443](https://github.com/worktile/ai-table/issues/WIK-17443)
* **grid:** append records or fields if there are not enough rows or columns when pasting ([#287](https://github.com/worktile/ai-table/issues/287)) ([e482274](https://github.com/worktile/ai-table/commit/e48227422eb50dae25dfaa8308870075b94c60b3))
* **grid:** encapsulate the toFieldValue function ([#274](https://github.com/worktile/ai-table/issues/274)) ([580b0ea](https://github.com/worktile/ai-table/commit/580b0ea62bddddae5f6e780c955c9ea52bfa837e))
* **grid:** optimize copy and paste logic ([#275](https://github.com/worktile/ai-table/issues/275)) ([558b496](https://github.com/worktile/ai-table/commit/558b496272f8c35f6cb97a37da41e46052ebad52))
* **grid:** show tips when copied success or pasted failure ([#288](https://github.com/worktile/ai-table/issues/288)) ([02e8892](https://github.com/worktile/ai-table/commit/02e88925c51b857353c92f59f4886e37506a9195))
* **grid:** support copy to clipbpard and paste to ai-table #WIK-16631 ([#270](https://github.com/worktile/ai-table/issues/270)) ([9f79a85](https://github.com/worktile/ai-table/commit/9f79a8510f83bae797543c95356a263eb54445e7)), closes [#WIK-16631](https://github.com/worktile/ai-table/issues/WIK-16631) [#WIK-16631](https://github.com/worktile/ai-table/issues/WIK-16631) [#WIK-16631](https://github.com/worktile/ai-table/issues/WIK-16631)
* **grid:** support paste link field and dont support paste attachment ([#279](https://github.com/worktile/ai-table/issues/279)) ([3ceb020](https://github.com/worktile/ai-table/commit/3ceb0209583cf149abc97e5b5afd22b6e936ba3e))
* **grid:** support paste to rate and progress ([#284](https://github.com/worktile/ai-table/issues/284)) ([3e27787](https://github.com/worktile/ai-table/commit/3e27787412405b43d7ec605bbf13e45acf95e05f))
* **grid:** support paste to select field ([#283](https://github.com/worktile/ai-table/issues/283)) ([ec07992](https://github.com/worktile/ai-table/commit/ec07992c22313dfe2b13ac31af2e2686c3120edf))



## [0.0.40](https://github.com/worktile/ai-table/compare/0.0.39...0.0.40) (2025-03-14)


### Bug Fixes

* #WIK-17411 【aitable】链接类型的字段，在切换cell时，之前active的cell框没有消失 ([#267](https://github.com/worktile/ai-table/issues/267)) ([679c12a](https://github.com/worktile/ai-table/commit/679c12ad3ae9551effda789e2c856c4cf66eef74)), closes [#WIK-17411](https://github.com/worktile/ai-table/issues/WIK-17411)


### Features

* #WIK-17410 有筛选条件时，新增数据插入位置为所有数据的最后一行 ([#268](https://github.com/worktile/ai-table/issues/268)) ([f512b4f](https://github.com/worktile/ai-table/commit/f512b4f2fc420350d12c0a28eec2659e6296aa46)), closes [#WIK-17410](https://github.com/worktile/ai-table/issues/WIK-17410)
* **default-values:** #WIK-16623 支持根据筛选创建默认值 ([#266](https://github.com/worktile/ai-table/issues/266)) ([4f8e5f7](https://github.com/worktile/ai-table/commit/4f8e5f76ec790437597e96ad428ec2dc5ae5c64d)), closes [#WIK-16623](https://github.com/worktile/ai-table/issues/WIK-16623)



## [0.0.39](https://github.com/worktile/ai-table/compare/0.0.38...0.0.39) (2025-03-10)


### Bug Fixes

* #WIK-17288 【aitable】文本框被内容撑高后，将内容减少，文本框未跟随变矮 ([#264](https://github.com/worktile/ai-table/issues/264)) ([68d5c20](https://github.com/worktile/ai-table/commit/68d5c2044d98e34e73a7061cdd0f89821f6ca2d4)), closes [#WIK-17288](https://github.com/worktile/ai-table/issues/WIK-17288)
* **grid:** invalid single-select and multi-select values ​​should not be rendered ([#263](https://github.com/worktile/ai-table/issues/263)) ([391f2d0](https://github.com/worktile/ai-table/commit/391f2d076ca3a129dc687f754a320bd7cbf22a7a))


### Features

* **grid:** merge single and multiple member field, and disable editing field type ([#262](https://github.com/worktile/ai-table/issues/262)) ([bfbff67](https://github.com/worktile/ai-table/commit/bfbff67db2a56dba2a3d872e4106b01178372b67))



## [0.0.38](https://github.com/worktile/ai-table/compare/0.0.37...0.0.38) (2025-03-05)


### Bug Fixes

* #WIK-17323 【ai-table】链接 hover 要有下划线 ([#258](https://github.com/worktile/ai-table/issues/258)) ([215e92d](https://github.com/worktile/ai-table/commit/215e92d0888a1a8c781275cfbaefbafb4cfa6c95)), closes [#WIK-17323](https://github.com/worktile/ai-table/issues/WIK-17323)


### Features

* **state:** support add field by copy ([#259](https://github.com/worktile/ai-table/issues/259)) ([776f974](https://github.com/worktile/ai-table/commit/776f974f77c5635d4ff2e88024e0410f3744d8e7))



## [0.0.37](https://github.com/worktile/ai-table/compare/0.0.36...0.0.37) (2025-02-21)


### Bug Fixes

* **grid:** only operate selected data  which is visible ([#256](https://github.com/worktile/ai-table/issues/256)) ([6f280b1](https://github.com/worktile/ai-table/commit/6f280b1fa558d5e158fe9b94fccf0b8f86fb5f04))
* **grid:** should not hover deleted record ([#254](https://github.com/worktile/ai-table/issues/254)) ([684b952](https://github.com/worktile/ai-table/commit/684b9520b5d2d546c7316c4b8a8d9f72e62d8beb))


### Features

* #WIK-17283 【aitable】link只在文本区域触发事件 ([#253](https://github.com/worktile/ai-table/issues/253)) ([8603ce1](https://github.com/worktile/ai-table/commit/8603ce13442894118e9a8e1b3b4a3ab4b78d7e3d)), closes [#WIK-17283](https://github.com/worktile/ai-table/issues/WIK-17283)
* **grid:** change date picker placeholder ([#251](https://github.com/worktile/ai-table/issues/251)) ([0aa4d3d](https://github.com/worktile/ai-table/commit/0aa4d3d0852ae7067beb5d4dd25570358573c17c))
* **grid:** change default width for field options ([#252](https://github.com/worktile/ai-table/issues/252)) ([cbe671f](https://github.com/worktile/ai-table/commit/cbe671f332114ddf44ec0be2065a2c36e1dfda49))



## [0.0.36](https://github.com/worktile/ai-table/compare/0.0.35...0.0.36) (2025-02-19)


### Bug Fixes

* #WIK-17280 【AITable】hover事件，获取的 target偶尔有问题 ([#249](https://github.com/worktile/ai-table/issues/249)) ([17b89e0](https://github.com/worktile/ai-table/commit/17b89e0e779ffd472b31b47aacf7fd5dd429af9a)), closes [#WIK-17280](https://github.com/worktile/ai-table/issues/WIK-17280)


### Features

* **cell-drawer:** support render member display name #WIK-17248 ([#247](https://github.com/worktile/ai-table/issues/247)) ([7e38059](https://github.com/worktile/ai-table/commit/7e38059e8281f0ba2522b97c125cb2086958b5d7)), closes [#WIK-17248](https://github.com/worktile/ai-table/issues/WIK-17248)
* **cell:** #WIK-17098 【aitable】链接单元格已有数据时，直接点击文字跳转新窗口打开链接、双击单元格空白处和后方的按钮为编辑 ([#248](https://github.com/worktile/ai-table/issues/248)) ([c2596ae](https://github.com/worktile/ai-table/commit/c2596aea84f626c439223933bea2a9b963ee229c)), closes [#WIK-17098](https://github.com/worktile/ai-table/issues/WIK-17098)



## [0.0.35](https://github.com/worktile/ai-table/compare/0.0.34...0.0.35) (2025-02-13)


### Bug Fixes

* **selection:** #WIK-16979 当表格没有数据时，头部 checkbox 不应该处于勾选状态，且，不应该怎么点击都不切换状态 ([#244](https://github.com/worktile/ai-table/issues/244)) ([49c1a71](https://github.com/worktile/ai-table/commit/49c1a71f82021fa0889393b92a3d9a16b1ec6e56)), closes [#WIK-16979](https://github.com/worktile/ai-table/issues/WIK-16979)



## [0.0.34](https://github.com/worktile/ai-table/compare/0.0.33...0.0.34) (2025-02-12)


### Bug Fixes

* #WIK-17103 【AITable】不可编辑表格表头更多菜单点击显示空的弹窗 ([#243](https://github.com/worktile/ai-table/issues/243)) ([6f1f07e](https://github.com/worktile/ai-table/commit/6f1f07e5ce7203063c3a7d3067b0b204b0d26bf6)), closes [#WIK-17103](https://github.com/worktile/ai-table/issues/WIK-17103)
* **text:** should not prevent default action when edit text, because long text need scrolling #WIK-17096 ([#241](https://github.com/worktile/ai-table/issues/241)) ([5a597dd](https://github.com/worktile/ai-table/commit/5a597dd9fbe6f6a7176e3cde755973f13167f6fe)), closes [#WIK-17096](https://github.com/worktile/ai-table/issues/WIK-17096)


### Features

* **cell-drawer:** support render empty data for progress and rate fi… ([#240](https://github.com/worktile/ai-table/issues/240)) ([86f3083](https://github.com/worktile/ai-table/commit/86f30831a4f5dffadbb0537706c9d5a3c97a5aad))
* **layout-drawer:** support render blank when table only has one field #WIK-17197 ([#242](https://github.com/worktile/ai-table/issues/242)) ([aa94e11](https://github.com/worktile/ai-table/commit/aa94e113d618c6f48982ac6235d5fe6318966269)), closes [#WIK-17197](https://github.com/worktile/ai-table/issues/WIK-17197)



## [0.0.33](https://github.com/worktile/ai-table/compare/0.0.32...0.0.33) (2025-02-06)


### Bug Fixes

* **editor:** closeCellEditor invoking will prevent blur event in cell editor component #WIK-17119 ([#238](https://github.com/worktile/ai-table/issues/238)) ([5a50043](https://github.com/worktile/ai-table/commit/5a50043025adcf77e08f9f5cb4a947125c431026)), closes [#WIK-17119](https://github.com/worktile/ai-table/issues/WIK-17119)



## [0.0.32](https://github.com/worktile/ai-table/compare/0.0.31...0.0.32) (2025-02-06)


### Bug Fixes

* **cell-drawer:** member can not display when cell is active #WIK-17077 ([#234](https://github.com/worktile/ai-table/issues/234)) ([8890936](https://github.com/worktile/ai-table/commit/8890936cb86b386c3a239b818a47f25f79d9c87b)), closes [#WIK-17077](https://github.com/worktile/ai-table/issues/WIK-17077)
* **drawer:** set font attribute in wrapText #WIK-17044 ([#233](https://github.com/worktile/ai-table/issues/233)) ([a75d0bc](https://github.com/worktile/ai-table/commit/a75d0bc87d492c06ba2502060e6dc9b02c7046a4)), closes [#WIK-17044](https://github.com/worktile/ai-table/issues/WIK-17044)
* **state:** transform undefined as null to avoid yjs error for system field #WIK-17191 ([#235](https://github.com/worktile/ai-table/issues/235)) ([52067eb](https://github.com/worktile/ai-table/commit/52067eb295446a228181af53c8b0a4eba73cda9a)), closes [#WIK-17191](https://github.com/worktile/ai-table/issues/WIK-17191)
* **translate:** fix get custom field value issue when value is 0 #WIK-17102 ([#236](https://github.com/worktile/ai-table/issues/236)) ([2223888](https://github.com/worktile/ai-table/commit/2223888bad93f03274b3bceed526da1b6f7631ae)), closes [#WIK-17102](https://github.com/worktile/ai-table/issues/WIK-17102)
* **value-editing:** correct editing component position when column is frozen column #WIK-17023 ([#231](https://github.com/worktile/ai-table/issues/231)) ([b944172](https://github.com/worktile/ai-table/commit/b944172183d2f54877056f4d8b65cca150a24fe5)), closes [#WIK-17023](https://github.com/worktile/ai-table/issues/WIK-17023)


### Features

* **grid:** move reference to context and remove from table instance and frozenColumnCount to context ([#230](https://github.com/worktile/ai-table/issues/230)) ([ccf9e91](https://github.com/worktile/ai-table/commit/ccf9e91b57c18865e7eadd520689b8f50dcbd061))



## [0.0.31](https://github.com/worktile/ai-table/compare/0.0.30...0.0.31) (2025-01-09)


### Features

* **state:** support copy the view with the specified viewId ([#228](https://github.com/worktile/ai-table/issues/228)) ([71d8222](https://github.com/worktile/ai-table/commit/71d8222a69ba15aa132dcb0600086b45258ecda2))



## [0.0.30](https://github.com/worktile/ai-table/compare/0.0.29...0.0.30) (2025-01-07)


### Features

* **grid:** support sort by specified attribute value for field which is object type ([#223](https://github.com/worktile/ai-table/issues/223)) ([14308c4](https://github.com/worktile/ai-table/commit/14308c4c98faaabfc896e7415756a11f5c73315c))



## [0.0.29](https://github.com/worktile/ai-table/compare/0.0.28...0.0.29) (2025-01-06)


### Features

* **grid:** support drag select cells and support right click selected areas to delete records ([#220](https://github.com/worktile/ai-table/issues/220)) ([fc1295e](https://github.com/worktile/ai-table/commit/fc1295ef9826bd03b497a470f038e649668d66d6))



## [0.0.28](https://github.com/worktile/ai-table/compare/0.0.27...0.0.28) (2024-12-27)


### Bug Fixes

* **field-render:** fix date editing error #WIK-17072 ([#217](https://github.com/worktile/ai-table/issues/217)) ([381235a](https://github.com/worktile/ai-table/commit/381235a65d47b6500cc043a19dccf455e3956402)), closes [#WIK-17072](https://github.com/worktile/ai-table/issues/WIK-17072)



## [0.0.27](https://github.com/worktile/ai-table/compare/0.0.26...0.0.27) (2024-12-26)


### Features

* **state:** member field sort by display_name_pinyin default ([#215](https://github.com/worktile/ai-table/issues/215)) ([ab38639](https://github.com/worktile/ai-table/commit/ab386395f51aa1a2b3f550a32d4cd10d0ad88fda))



## [0.0.26](https://github.com/worktile/ai-table/compare/0.0.25...0.0.26) (2024-12-26)


### Features

* **state:** support filter and sort by member, created_by, updated_by ([#213](https://github.com/worktile/ai-table/issues/213)) ([950068a](https://github.com/worktile/ai-table/commit/950068ad9b196faaae0edff43d8ec4ea1613eced))



## [0.0.25](https://github.com/worktile/ai-table/compare/0.0.24...0.0.25) (2024-12-25)


### Features

* **grid:** add references param for cell editor and fix aiTableGridEventService init params error ([#211](https://github.com/worktile/ai-table/issues/211)) ([fd1d642](https://github.com/worktile/ai-table/commit/fd1d642812908c0818e549e8068d7276211d167a))



## [0.0.24](https://github.com/worktile/ai-table/compare/0.0.23...0.0.24) (2024-12-24)


### Features

* **grid:** support clear matchedCells when keywords is null and search by progress ([#209](https://github.com/worktile/ai-table/issues/209)) ([5428652](https://github.com/worktile/ai-table/commit/5428652ea1ec32e978574102afc67670da6402b1))



## [0.0.23](https://github.com/worktile/ai-table/compare/0.0.22...0.0.23) (2024-12-24)


### Bug Fixes

* **app:** fix keywords attribute ([#206](https://github.com/worktile/ai-table/issues/206)) ([e89e92c](https://github.com/worktile/ai-table/commit/e89e92c31b7a015c6ac11ae629cd8316f2693f75))
* **state:** when the value of the field is 0, it should not be considered empty ([#202](https://github.com/worktile/ai-table/issues/202)) ([e6e9dd0](https://github.com/worktile/ai-table/commit/e6e9dd057ce7ef767a558edeb86b4ede3fa51729))


### Features

* **grid:** support highlight the cell which match the keywords ([#205](https://github.com/worktile/ai-table/issues/205)) ([38bdb14](https://github.com/worktile/ai-table/commit/38bdb147b8142907d672680cab8390a501a52db0))



## [0.0.22](https://github.com/worktile/ai-table/compare/0.0.21...0.0.22) (2024-12-18)


### Bug Fixes

* **app:** use 10-bit timestamp ([#196](https://github.com/worktile/ai-table/issues/196)) ([5c33e88](https://github.com/worktile/ai-table/commit/5c33e882e765afb5dd1ee357b33af8cba9809317))
* **grid:**  the default value of a numeric field should not display 0 ([#198](https://github.com/worktile/ai-table/issues/198)) ([0574af9](https://github.com/worktile/ai-table/commit/0574af939554189f5be5d1216217e122e87973d6))
* **grid:** should create correct default name and show correct type when add multiple member ([#197](https://github.com/worktile/ai-table/issues/197)) ([9863899](https://github.com/worktile/ai-table/commit/9863899658c2179d4164757e4af8248fd25bd68f))
* **grid:** should show icon in front of action button ([#199](https://github.com/worktile/ai-table/issues/199)) ([e1c418e](https://github.com/worktile/ai-table/commit/e1c418e66457e0b8964f6e64f56768641ef06ec3))
* **state:** the in and nin filter logic of rate fied does not take effect ([#193](https://github.com/worktile/ai-table/issues/193)) ([2f0a8e0](https://github.com/worktile/ai-table/commit/2f0a8e0eec01c0fe5a3470be9b5d11c67b3da81d))


### Features

* **state:** support filter and sort by link field ([#195](https://github.com/worktile/ai-table/issues/195)) ([fe6ef2e](https://github.com/worktile/ai-table/commit/fe6ef2e61349540e1e32e4ee0380c36155e504d4))
* **state:** support filter by system, such as created_at, updated_at ([#194](https://github.com/worktile/ai-table/issues/194)) ([70d3f07](https://github.com/worktile/ai-table/commit/70d3f074d3f7bcbeec7133234cc0ca37ecd328ea))



## [0.0.21](https://github.com/worktile/ai-table/compare/0.0.20...0.0.21) (2024-12-13)


### Bug Fixes

* **field-property-editor:** add max-height and add overflow-y: auto for field-property-editor-panel #WIK-16855 ([#180](https://github.com/worktile/ai-table/issues/180)) ([d6571ff](https://github.com/worktile/ai-table/commit/d6571ffbdd2a25e3e87012bd876d9f37e7e230fe)), closes [#WIK-16855](https://github.com/worktile/ai-table/issues/WIK-16855)
* **file-menu:** assign insideClosable when open FieldMenu component #WIK-16898 ([#179](https://github.com/worktile/ai-table/issues/179)) ([ae9f2c8](https://github.com/worktile/ai-table/commit/ae9f2c8c1489cb5d18a9561a299f78b42bc7a263)), closes [#WIK-16898](https://github.com/worktile/ai-table/issues/WIK-16898)
* **grid:** do not use the last field's style to draw field blanks #WIK-16973 ([#185](https://github.com/worktile/ai-table/issues/185)) ([5531991](https://github.com/worktile/ai-table/commit/5531991cf51c8472a70f077f8c4aad07ad943249)), closes [#WIK-16973](https://github.com/worktile/ai-table/issues/WIK-16973)
* **grid:** fix error when table is no data and click add record button #WIK-16981 ([#189](https://github.com/worktile/ai-table/issues/189)) ([9cf8886](https://github.com/worktile/ai-table/commit/9cf8886901eb0c03e55d2c325547800ebebf8c8d)), closes [#WIK-16981](https://github.com/worktile/ai-table/issues/WIK-16981)


### Features

* **file:** distinguish single member field and multiple member field ([#181](https://github.com/worktile/ai-table/issues/181)) ([a095ccf](https://github.com/worktile/ai-table/commit/a095ccfe4aa7beda6daaa0eb4a19d366fb20f729))
* **grid:** activate type in the secondary menu of current field #WIK-16975 ([#184](https://github.com/worktile/ai-table/issues/184)) ([92d71a9](https://github.com/worktile/ai-table/commit/92d71a9afc49a4f7c68e87d2c01784ab3731d82a)), closes [#WIK-16975](https://github.com/worktile/ai-table/issues/WIK-16975)
* **grid:** support activate status when a single cell contextmenu is opened #WIK-16969 ([#188](https://github.com/worktile/ai-table/issues/188)) ([40a3ec3](https://github.com/worktile/ai-table/commit/40a3ec32d4324db914dd3d71f599336bd4565280)), closes [#WIK-16969](https://github.com/worktile/ai-table/issues/WIK-16969)
* **grid:** support open context menu and support delete records #WIK-16846 ([#182](https://github.com/worktile/ai-table/issues/182)) ([36b34c5](https://github.com/worktile/ai-table/commit/36b34c571f0002b969805684aef90c71f02480ef)), closes [#WIK-16846](https://github.com/worktile/ai-table/issues/WIK-16846)
* **grid:** support the active style of the row where the active cell is located #WIK-16965 ([#187](https://github.com/worktile/ai-table/issues/187)) ([ea23b96](https://github.com/worktile/ai-table/commit/ea23b9603190674384044bf6070893a5f27cea61)), closes [#WIK-16965](https://github.com/worktile/ai-table/issues/WIK-16965)



## [0.0.20](https://github.com/worktile/ai-table/compare/0.0.19...0.0.20) (2024-12-06)


### Bug Fixes

* **grid:** #WIK-16750  the remove icon  should be red on hover ([#177](https://github.com/worktile/ai-table/issues/177)) ([9a4113a](https://github.com/worktile/ai-table/commit/9a4113a29c8b77730e0913162f45738d277775a6)), closes [#WIK-16750](https://github.com/worktile/ai-table/issues/WIK-16750)



## [0.0.19](https://github.com/worktile/ai-table/compare/0.0.18...0.0.19) (2024-12-02)


### Features

* **core:** support short_id for record and view #WIK-16765 ([#175](https://github.com/worktile/ai-table/issues/175)) ([86a2473](https://github.com/worktile/ai-table/commit/86a24735f2757f9348198855208c400b71237bc5)), closes [#WIK-16765](https://github.com/worktile/ai-table/issues/WIK-16765)
* **icon:** modify more icon #WIK-16865 ([#174](https://github.com/worktile/ai-table/issues/174)) ([844fae2](https://github.com/worktile/ai-table/commit/844fae2ea75c5651d13426af79b9044207148294)), closes [#WIK-16865](https://github.com/worktile/ai-table/issues/WIK-16865)



## [0.0.18](https://github.com/worktile/ai-table/compare/0.0.17...0.0.18) (2024-11-28)


### Bug Fixes

* **field-edit:** fix edit field component unexpected close #WIK-16866 ([#172](https://github.com/worktile/ai-table/issues/172)) ([1082c19](https://github.com/worktile/ai-table/commit/1082c190d8edf9adc431f02799ba051a6321807c)), closes [#WIK-16866](https://github.com/worktile/ai-table/issues/WIK-16866)
* **grid:** fixed blank rendering of column headers for the last column in read-only mode #WIK-16864 ([#171](https://github.com/worktile/ai-table/issues/171)) ([477fef3](https://github.com/worktile/ai-table/commit/477fef3d429048c26c2fa0c91b8a88f6c60ec85b)), closes [#WIK-16864](https://github.com/worktile/ai-table/issues/WIK-16864)


### Features

* **config:**  support readonly mode #WIK-16851 ([#166](https://github.com/worktile/ai-table/issues/166)) ([c14926d](https://github.com/worktile/ai-table/commit/c14926dab393dd65ffd49c7e1790d57cf9bd02d0)), closes [#WIK-16851](https://github.com/worktile/ai-table/issues/WIK-16851)



## [0.0.17](https://github.com/worktile/ai-table/compare/0.0.16...0.0.17) (2024-11-27)


### Bug Fixes

* **field-head:** correct field more icon style and action #WIK-16740 ([08b0901](https://github.com/worktile/ai-table/commit/08b09016ff42b65c40afc06031376214821d3b43)), closes [#WIK-16740](https://github.com/worktile/ai-table/issues/WIK-16740)
* **field:** correct editFieldPosition #WIK-16748 ([5f46b69](https://github.com/worktile/ai-table/commit/5f46b6911f5ba6e6b90fc3825a5829e50e8b32c1)), closes [#WIK-16748](https://github.com/worktile/ai-table/issues/WIK-16748)
* **renderer:** support full width add blank #WIK-16745 ([90cc20b](https://github.com/worktile/ai-table/commit/90cc20bf08f9a9a109ced0c3956bb5a2dca59d6a)), closes [#WIK-16745](https://github.com/worktile/ai-table/issues/WIK-16745)
* **state:** #WIK-16805 new row coordination error ([2e21b9b](https://github.com/worktile/ai-table/commit/2e21b9b22c6aa8c7d9c42b41ca8e89f5b39e15b6)), closes [#WIK-16805](https://github.com/worktile/ai-table/issues/WIK-16805)


### Features

* **field:** support hover style for add field blank #WIK-16857 ([68a4248](https://github.com/worktile/ai-table/commit/68a424895a3b331008efc070f6997edd462f7e3a)), closes [#WIK-16857](https://github.com/worktile/ai-table/issues/WIK-16857)



## [0.0.16](https://github.com/worktile/ai-table/compare/0.0.15...0.0.16) (2024-11-25)


### Bug Fixes

* **actions:** fix select cell editor updated invalid value #WIK-16707 ([1350aa0](https://github.com/worktile/ai-table/commit/1350aa056210f40ff54ea4217ab25bad452da167)), closes [#WIK-16707](https://github.com/worktile/ai-table/issues/WIK-16707)


### Features

* **state:** support custom sharedType fieldName ([071392d](https://github.com/worktile/ai-table/commit/071392d15e0a8a1485070e23dc7d4c0e8a20f075))



## [0.0.15](https://github.com/worktile/ai-table/compare/0.0.14...0.0.15) (2024-10-22)


### Bug Fixes

* **editor:** fix date editor unexpected close #WIK-16685 ([70863d1](https://github.com/worktile/ai-table/commit/70863d12d32084a21235609e081d6155a91364de)), closes [#WIK-16685](https://github.com/worktile/ai-table/issues/WIK-16685)
* **shared:** build customFieldValues by fields array #WIK-16693 ([e12e485](https://github.com/worktile/ai-table/commit/e12e48528d8734a05d8a928f983e1f8f90f2c792)), closes [#WIK-16693](https://github.com/worktile/ai-table/issues/WIK-16693)


### Features

* **field:** improve system field data query logic #WIK-16680 ([0635a42](https://github.com/worktile/ai-table/commit/0635a422cc361faf2c33a62a0b9e6a26bb2ed58a)), closes [#WIK-16680](https://github.com/worktile/ai-table/issues/WIK-16680)
* **operation:** support update system field value operation and yjs translate #WIK-16689 ([b20503d](https://github.com/worktile/ai-table/commit/b20503db35f82ee0bee69b07c36796ff25454021)), closes [#WIK-16689](https://github.com/worktile/ai-table/issues/WIK-16689)
* **state:** support update updatedInfo when add field and remove field #WIK-16696 ([92b8a97](https://github.com/worktile/ai-table/commit/92b8a97fc46a6e094a5cc670f69614feed552d65)), closes [#WIK-16696](https://github.com/worktile/ai-table/issues/WIK-16696)



## [0.0.14](https://github.com/worktile/ai-table/compare/0.0.13...0.0.14) (2024-10-16)


### Features

* improve rating and progress editor and field default value ([4d364a8](https://github.com/worktile/ai-table/commit/4d364a87ed37d589772f561aaa8af47e87c46596))



## [0.0.13](https://github.com/worktile/ai-table/compare/0.0.12...0.0.13) (2024-10-15)


### Bug Fixes

* adjust  drawable index ([#122](https://github.com/worktile/ai-table/issues/122)) ([d3776f8](https://github.com/worktile/ai-table/commit/d3776f8f79fce550c4de9c90b0530d5bbddac00a))
* align progress editor and rating editor ([9d27ddf](https://github.com/worktile/ai-table/commit/9d27ddffe297018b14480c4a414e04b8a87d0ccc))
* cellValue to transformValue ([#126](https://github.com/worktile/ai-table/issues/126)) ([3fb4efd](https://github.com/worktile/ai-table/commit/3fb4efd96ee2db42bfc14ad2c62cb16628fff1dc))
* correct link editor style ([3378946](https://github.com/worktile/ai-table/commit/3378946e73815ae3a55ecfdd402bb6ed367034f4))
* correct number editor align ([14ca50c](https://github.com/worktile/ai-table/commit/14ca50c8dde5f036c8320ad5cd402b9063590f18))
* correct origin position when scrolling ([6257cbe](https://github.com/worktile/ai-table/commit/6257cbe1af604dc5992624b99d7f66e9edc08d08))
* **edit:** fix edit style and position ([#117](https://github.com/worktile/ai-table/issues/117)) ([de2ec7a](https://github.com/worktile/ai-table/commit/de2ec7aa42462456c64cba2aaa41e1f213cd67dd))
* fix hover checkbox change color ([#132](https://github.com/worktile/ai-table/issues/132)) ([86feb13](https://github.com/worktile/ai-table/commit/86feb1398317bcf382f31a5974d512ea2009b17e))
* fix link editor error ([#131](https://github.com/worktile/ai-table/issues/131)) ([72cf6ed](https://github.com/worktile/ai-table/commit/72cf6edf0b43cae1ebda7dbc3221924a27c7854b))
* fix tag display when multiple select ([#125](https://github.com/worktile/ai-table/issues/125)) ([a6c6d39](https://github.com/worktile/ai-table/commit/a6c6d391e81061cbb3c77cf88cd0cfafa09e49a0))
* fix type error ([#123](https://github.com/worktile/ai-table/issues/123)) ([802cdc0](https://github.com/worktile/ai-table/commit/802cdc00949a5109eec7746c626a9b3010593476))
* **grid:** end the opened edit when clicking on the switch cell #WIK-16660 ([1be6f3f](https://github.com/worktile/ai-table/commit/1be6f3f250e30ef82e08b308a444a811f2a1b680)), closes [#WIK-16660](https://github.com/worktile/ai-table/issues/WIK-16660)
* **grid:** fix dom render error #WIK-16537 ([#105](https://github.com/worktile/ai-table/issues/105)) ([92927be](https://github.com/worktile/ai-table/commit/92927bee338d5369aa1c64e4e14d5835805a884b)), closes [#WIK-16537](https://github.com/worktile/ai-table/issues/WIK-16537)
* **grid:** fix the position and error of the add column popup window ([#142](https://github.com/worktile/ai-table/issues/142)) ([d58a5e4](https://github.com/worktile/ai-table/commit/d58a5e47af9294773b111e749375c1ce5f5b81d4))
* **grid:** fix the style and color error of the selected option #WIK-16677 ([83bd54d](https://github.com/worktile/ai-table/commit/83bd54df0601dd123a4cb328d4b9352823e411c7)), closes [#WIK-16677](https://github.com/worktile/ai-table/issues/WIK-16677)
* **grid:** fix the style and color error of the selected option #WIK-16677 ([3e637c7](https://github.com/worktile/ai-table/commit/3e637c712ef1b84c3292c25013363e55d7470154)), closes [#WIK-16677](https://github.com/worktile/ai-table/issues/WIK-16677)
* **grid:** restore code in origin develop #WIK-16519 ([#119](https://github.com/worktile/ai-table/issues/119)) ([0667869](https://github.com/worktile/ai-table/commit/066786911635a99a4cfa158cb90b545e53c13898)), closes [#WIK-16519](https://github.com/worktile/ai-table/issues/WIK-16519)
* link icon ([#146](https://github.com/worktile/ai-table/issues/146)) ([9b94203](https://github.com/worktile/ai-table/commit/9b9420300728d5a8375c173245e463ef1bf80f66))
* **number-editor:** fix number editor style ([00acc0a](https://github.com/worktile/ai-table/commit/00acc0a2a31f67a61f7f3342d02c82d6cb9d4ff7))
* **select:** fix draw dot ([#115](https://github.com/worktile/ai-table/issues/115)) ([ea348f7](https://github.com/worktile/ai-table/commit/ea348f7997857e07352334ebe78572dad0908887))
* 增加单选数据 ([#109](https://github.com/worktile/ai-table/issues/109)) ([c5f42c9](https://github.com/worktile/ai-table/commit/c5f42c96a76fd710563fb7b5d89d69baf294f81f))


### Features

* add build linear row and coordinate ([#74](https://github.com/worktile/ai-table/issues/74)) ([f309bb6](https://github.com/worktile/ai-table/commit/f309bb631f581c8627547d44e5227f607bf0869a))
* add field and add record and selection and hover #WIK-16306 ([#88](https://github.com/worktile/ai-table/issues/88)) ([60d835b](https://github.com/worktile/ai-table/commit/60d835b9bb2f0d2c4d630c87c5e5e9bb01b2a314)), closes [#WIK-16306](https://github.com/worktile/ai-table/issues/WIK-16306)
* add grid renderer ([ecfad4e](https://github.com/worktile/ai-table/commit/ecfad4e9bbb32c90ba42c915a0b0c7c8e34a4f02))
* **addField:** add field column ([#86](https://github.com/worktile/ai-table/issues/86)) ([7f78625](https://github.com/worktile/ai-table/commit/7f786253c139b21dc78c4b25523eb38c122e6569))
* **editor:** remove 2px border of editor and refactor position logic ([#145](https://github.com/worktile/ai-table/issues/145)) ([af9a1ce](https://github.com/worktile/ai-table/commit/af9a1ce9ad23a8de02e951b4c9ad8568eb6d57de))
* **editor:** set different editor style by the editor has border or not ([f8b362e](https://github.com/worktile/ai-table/commit/f8b362e5f24593d91ec421c57b51a03057dc7b40))
* **head:** create heads ([#82](https://github.com/worktile/ai-table/issues/82)) ([569e90a](https://github.com/worktile/ai-table/commit/569e90ae63e645ad23f9749e281cd55170a4f2a3))
* **icon-renderer:** modified check/checked icon #WIK-16614 ([7e1a019](https://github.com/worktile/ai-table/commit/7e1a0192adcdcf6b7dc649b96ef3dedbaf29cdde)), closes [#WIK-16614](https://github.com/worktile/ai-table/issues/WIK-16614)
* **renderer:** correct text icon ([eb5c71e](https://github.com/worktile/ai-table/commit/eb5c71e15a2803f9e861703bb06b497b032c7c86))
* **renderer:** support link ([#129](https://github.com/worktile/ai-table/issues/129)) ([caeb600](https://github.com/worktile/ai-table/commit/caeb600a404b1429ac0d3539247543c743cd27d2))
* **scrolling:** support scroll action when cell is editing #WIK-16633 ([#130](https://github.com/worktile/ai-table/issues/130)) ([4eaf3e7](https://github.com/worktile/ai-table/commit/4eaf3e7519ce9a6c4ed407287b86fcc75570bdc9)), closes [#WIK-16633](https://github.com/worktile/ai-table/issues/WIK-16633)
* **single-select:**  support different type select ([#108](https://github.com/worktile/ai-table/issues/108)) ([1a33675](https://github.com/worktile/ai-table/commit/1a33675a8ae19aaf9ef907fb0391d406bd58f594))
* support multiple select ([#120](https://github.com/worktile/ai-table/issues/120)) ([f102df3](https://github.com/worktile/ai-table/commit/f102df353cd006f29a1844ad95d42bd82f6c247d))



## [0.0.12](https://github.com/worktile/ai-table/compare/0.0.11...0.0.12) (2024-09-18)

### Features

-   **state:** support sort records when is_keep_sort is true #WIK-16424 ([#100](https://github.com/worktile/ai-table/issues/100)) ([587b575](https://github.com/worktile/ai-table/commit/587b575caa94d5695ba06df25107e8dbd8242751)), closes [#WIK-16424](https://github.com/worktile/ai-table/issues/WIK-16424)

## [0.0.11](https://github.com/worktile/ai-table/compare/0.0.10...0.0.11) (2024-09-12)

### Bug Fixes

-   bump ngx-tethys and adjust popover input value #WIK-16493 ([#98](https://github.com/worktile/ai-table/issues/98)) ([718de81](https://github.com/worktile/ai-table/commit/718de813759a05e22e0944e0b3fa421f201622f7)), closes [#WIK-16493](https://github.com/worktile/ai-table/issues/WIK-16493)

## [0.0.10](https://github.com/worktile/ai-table/compare/0.0.9...0.0.10) (2024-09-11)

### Bug Fixes

-   adjust date render and exec field menu function #WIK-16486 ([#94](https://github.com/worktile/ai-table/issues/94)) ([cc59fca](https://github.com/worktile/ai-table/commit/cc59fca7cf394a170dc1f299459fba63ca97be12)), closes [#WIK-16486](https://github.com/worktile/ai-table/issues/WIK-16486)

### Features

-   **core:** add aiBuildRenderDataFn input and update single select type value to array #WIK-16086 ([#92](https://github.com/worktile/ai-table/issues/92)) ([3177bf3](https://github.com/worktile/ai-table/commit/3177bf35bf7408714d94e7d2824cd209521775e0)), closes [#WIK-16086](https://github.com/worktile/ai-table/issues/WIK-16086)
-   **state:** support add and remove record position ([#84](https://github.com/worktile/ai-table/issues/84)) ([d57428a](https://github.com/worktile/ai-table/commit/d57428aabb2a4050b1dc99e18c47891be172a7e7))
-   **state:** support filter records function#WIK-16463 ([#95](https://github.com/worktile/ai-table/issues/95)) ([83f750b](https://github.com/worktile/ai-table/commit/83f750b312d4fa3faedf206b48f212c587c85021)), closes [function#WIK-16463](https://github.com/function/issues/WIK-16463)

## [0.0.9](https://github.com/worktile/ai-table/compare/0.0.8...0.0.9) (2024-08-27)

### Bug Fixes

-   **grid:** fix select type error when type is multiple ([#77](https://github.com/worktile/ai-table/issues/77)) ([10be512](https://github.com/worktile/ai-table/commit/10be5124166a5da8d359cf6d51ccb074ae5fa8c2))
-   **grid:** optimize pipe #WIK-16303 ([#76](https://github.com/worktile/ai-table/issues/76)) ([4e219e7](https://github.com/worktile/ai-table/commit/4e219e7b3f9f19ab496bac9d8fcc0623849cc608)), closes [#WIK-16303](https://github.com/worktile/ai-table/issues/WIK-16303)

## [0.0.8](https://github.com/worktile/ai-table/compare/0.0.7...0.0.8) (2024-08-22)

## [0.0.7](https://github.com/worktile/ai-table/compare/0.0.6...0.0.7) (2024-08-21)

### Bug Fixes

-   close edit component and add space to default field name #WIK-16285 ([#49](https://github.com/worktile/ai-table/issues/49)) ([13abbb4](https://github.com/worktile/ai-table/commit/13abbb441c7206811707614a51ef7ecd009e9dd3)), closes [#WIK-16285](https://github.com/worktile/ai-table/issues/WIK-16285)
-   fix autofill position #WIK-16275 ([#50](https://github.com/worktile/ai-table/issues/50)) ([8b9e427](https://github.com/worktile/ai-table/commit/8b9e427d13f3408674cc286331d040da92b110a1)), closes [#WIK-16275](https://github.com/worktile/ai-table/issues/WIK-16275)

### Features

-   add shared package and move view handle to shared #WIK-16315 ([#52](https://github.com/worktile/ai-table/issues/52)) ([8ab9e22](https://github.com/worktile/ai-table/commit/8ab9e227b7901cb3bf3835bd9b29050e221f51f3)), closes [#WIK-16315](https://github.com/worktile/ai-table/issues/WIK-16315)
-   refactor add_record and add_field #WIK-16330 ([#56](https://github.com/worktile/ai-table/issues/56)) ([92359ff](https://github.com/worktile/ai-table/commit/92359ff04bd71f97586ee4eb8f8ed73b19b3b7f0)), closes [#WIK-16330](https://github.com/worktile/ai-table/issues/WIK-16330)
-   refactor idCreator #WIK-16347 ([#60](https://github.com/worktile/ai-table/issues/60)) ([88a8259](https://github.com/worktile/ai-table/commit/88a82598e3e22081a67c6505c819ef8805c645ea)), closes [#WIK-16347](https://github.com/worktile/ai-table/issues/WIK-16347)
-   refactor update field value action #WIK-16327 ([#54](https://github.com/worktile/ai-table/issues/54)) ([bd3a7c4](https://github.com/worktile/ai-table/commit/bd3a7c46d71a26afab49c1db76e2cab500e59051)), closes [#WIK-16327](https://github.com/worktile/ai-table/issues/WIK-16327)
-   support add view and remove view #WIK-16293 ([#62](https://github.com/worktile/ai-table/issues/62)) ([0585ed7](https://github.com/worktile/ai-table/commit/0585ed737dcbc12bb99565c8454a3706a10b1df1)), closes [#WIK-16293](https://github.com/worktile/ai-table/issues/WIK-16293)
-   support remove shared #WIK-16331 ([#58](https://github.com/worktile/ai-table/issues/58)) ([9cac388](https://github.com/worktile/ai-table/commit/9cac388d0eded4154dbd1eb6a53de4a215c94b28)), closes [#WIK-16331](https://github.com/worktile/ai-table/issues/WIK-16331)
-   support set field shared #WIK-16344 ([#59](https://github.com/worktile/ai-table/issues/59)) ([a3377e4](https://github.com/worktile/ai-table/commit/a3377e4cf727ca450efb16da885c68c01595e006)), closes [#WIK-16344](https://github.com/worktile/ai-table/issues/WIK-16344)

## [0.0.6](https://github.com/worktile/ai-table/compare/0.0.4...0.0.6) (2024-08-08)

### Bug Fixes

-   click action not select col ([012f651](https://github.com/worktile/ai-table/commit/012f651a318096aae636940153469858da330094))
-   **grid:** fix the layout jitter caused by the style when the edit component pops up #WIK-16177 ([#35](https://github.com/worktile/ai-table/issues/35)) ([d79a0c7](https://github.com/worktile/ai-table/commit/d79a0c7babdb2ce25a1edec427fb1c68568e4291)), closes [#WIK-16177](https://github.com/worktile/ai-table/issues/WIK-16177)
-   set member default value to [] ([#45](https://github.com/worktile/ai-table/issues/45)) ([3c61df7](https://github.com/worktile/ai-table/commit/3c61df7d99e7ed17f460303da983cea960e1e8c4))

### Features

-   add createdAt and updatedAt field type #WIK-16252 ([#41](https://github.com/worktile/ai-table/issues/41)) ([254e468](https://github.com/worktile/ai-table/commit/254e468a9fbc9230e517bced09eae351d5d3eadc)), closes [#WIK-16252](https://github.com/worktile/ai-table/issues/WIK-16252)
-   build action before apply yjs #WIK-16236 ([#39](https://github.com/worktile/ai-table/issues/39)) ([0d954f2](https://github.com/worktile/ai-table/commit/0d954f253a313053db6ae45e7b3e3be4fb6862f1)), closes [#WIK-16236](https://github.com/worktile/ai-table/issues/WIK-16236)
-   **grid:** add clear selection condition ([#37](https://github.com/worktile/ai-table/issues/37)) ([5a196bc](https://github.com/worktile/ai-table/commit/5a196bca3911a5c90d013e25631a7d1fbfbc34c0))
-   **grid:** hover editing component supports selection #WIK-16107 ([#36](https://github.com/worktile/ai-table/issues/36)) ([17f01d5](https://github.com/worktile/ai-table/commit/17f01d5b3a81ed11377cc51888e50e22020406a4)), closes [#WIK-16107](https://github.com/worktile/ai-table/issues/WIK-16107)
-   **positions:** build data by positions and active views #WIK-16218 ([#29](https://github.com/worktile/ai-table/issues/29)) ([8896808](https://github.com/worktile/ai-table/commit/88968087cbf6979544e9c7c3a3f7d7dbfeb6c8fa)), closes [#WIK-16218](https://github.com/worktile/ai-table/issues/WIK-16218)
-   render member #WIK-16256 ([#42](https://github.com/worktile/ai-table/issues/42)) ([7e7bb52](https://github.com/worktile/ai-table/commit/7e7bb52f7afea5cb5be682647194d00f377ba9c1)), closes [#WIK-16256](https://github.com/worktile/ai-table/issues/WIK-16256)
-   support views share #WIK-16187 ([#22](https://github.com/worktile/ai-table/issues/22)) ([93e28ab](https://github.com/worktile/ai-table/commit/93e28abf7154e9cff0d7404af7b033ce81841396)), closes [#WIK-16187](https://github.com/worktile/ai-table/issues/WIK-16187)

## [0.0.5](https://github.com/worktile/ai-table/compare/0.0.4...0.0.5) (2024-08-08)

### Bug Fixes

-   click action not select col ([012f651](https://github.com/worktile/ai-table/commit/012f651a318096aae636940153469858da330094))
-   **grid:** fix the layout jitter caused by the style when the edit component pops up #WIK-16177 ([#35](https://github.com/worktile/ai-table/issues/35)) ([d79a0c7](https://github.com/worktile/ai-table/commit/d79a0c7babdb2ce25a1edec427fb1c68568e4291)), closes [#WIK-16177](https://github.com/worktile/ai-table/issues/WIK-16177)

### Features

-   add createdAt and updatedAt field type #WIK-16252 ([#41](https://github.com/worktile/ai-table/issues/41)) ([254e468](https://github.com/worktile/ai-table/commit/254e468a9fbc9230e517bced09eae351d5d3eadc)), closes [#WIK-16252](https://github.com/worktile/ai-table/issues/WIK-16252)
-   build action before apply yjs #WIK-16236 ([#39](https://github.com/worktile/ai-table/issues/39)) ([0d954f2](https://github.com/worktile/ai-table/commit/0d954f253a313053db6ae45e7b3e3be4fb6862f1)), closes [#WIK-16236](https://github.com/worktile/ai-table/issues/WIK-16236)
-   **grid:** add clear selection condition ([#37](https://github.com/worktile/ai-table/issues/37)) ([5a196bc](https://github.com/worktile/ai-table/commit/5a196bca3911a5c90d013e25631a7d1fbfbc34c0))
-   **grid:** hover editing component supports selection #WIK-16107 ([#36](https://github.com/worktile/ai-table/issues/36)) ([17f01d5](https://github.com/worktile/ai-table/commit/17f01d5b3a81ed11377cc51888e50e22020406a4)), closes [#WIK-16107](https://github.com/worktile/ai-table/issues/WIK-16107)
-   **positions:** build data by positions and active views #WIK-16218 ([#29](https://github.com/worktile/ai-table/issues/29)) ([8896808](https://github.com/worktile/ai-table/commit/88968087cbf6979544e9c7c3a3f7d7dbfeb6c8fa)), closes [#WIK-16218](https://github.com/worktile/ai-table/issues/WIK-16218)
-   render member #WIK-16256 ([#42](https://github.com/worktile/ai-table/issues/42)) ([7e7bb52](https://github.com/worktile/ai-table/commit/7e7bb52f7afea5cb5be682647194d00f377ba9c1)), closes [#WIK-16256](https://github.com/worktile/ai-table/issues/WIK-16256)
-   support views share #WIK-16187 ([#22](https://github.com/worktile/ai-table/issues/22)) ([93e28ab](https://github.com/worktile/ai-table/commit/93e28abf7154e9cff0d7404af7b033ce81841396)), closes [#WIK-16187](https://github.com/worktile/ai-table/issues/WIK-16187)

## [0.0.4](https://github.com/worktile/ai-table/compare/0.0.3...0.0.4) (2024-08-02)

### Features

-   **action:** add AIPlugin ([#18](https://github.com/worktile/ai-table/issues/18)) ([024fa5f](https://github.com/worktile/ai-table/commit/024fa5fa8502febddef9b0b8ac1cc4802dc30451))
-   add shared demo ([#15](https://github.com/worktile/ai-table/issues/15)) ([488a8e1](https://github.com/worktile/ai-table/commit/488a8e182daa5d0d8709153b87e3256c4c7239b5))
-   apply icon and width #WIK-16166 ([cf46f10](https://github.com/worktile/ai-table/commit/cf46f102e5471ca19ed873e4daf0642cb4066ec3)), closes [#WIK-16166](https://github.com/worktile/ai-table/issues/WIK-16166)
-   **core:** add set_field action #WIK-16194 ([#20](https://github.com/worktile/ai-table/issues/20)) ([6b34150](https://github.com/worktile/ai-table/commit/6b34150b78058da8b8f1b9e60e97524b6165abee)), closes [#WIK-16194](https://github.com/worktile/ai-table/issues/WIK-16194)
-   **core:** support move_record and move_field #WIK-16196 ([#24](https://github.com/worktile/ai-table/issues/24)) ([3ebf3fc](https://github.com/worktile/ai-table/commit/3ebf3fc7801fb7780cc118388f5418ae8992a483)), closes [#WIK-16196](https://github.com/worktile/ai-table/issues/WIK-16196)
-   **core:** support remove_field and remove_record #WIK-16192 ([#19](https://github.com/worktile/ai-table/issues/19)) ([2bc106e](https://github.com/worktile/ai-table/commit/2bc106ebbae3305e17ec2592ab3422c3042a46b4)), closes [#WIK-16192](https://github.com/worktile/ai-table/issues/WIK-16192)
-   **demo:** add shared demo #WIK-16223 ([#27](https://github.com/worktile/ai-table/issues/27)) ([009a234](https://github.com/worktile/ai-table/commit/009a2348d9336fb111605b04c9ac18087a53725c)), closes [#WIK-16223](https://github.com/worktile/ai-table/issues/WIK-16223)
-   **demo:** add ws server ([#23](https://github.com/worktile/ai-table/issues/23)) ([bd7bf6b](https://github.com/worktile/ai-table/commit/bd7bf6b1db525954dd5e35f4f83343066382640d))
-   **selection:** add selection feature #WIK-16060 ([#12](https://github.com/worktile/ai-table/issues/12)) ([0392723](https://github.com/worktile/ai-table/commit/039272385a3b32f6d0a874e863a9a1d87301f8c0)), closes [#WIK-16060](https://github.com/worktile/ai-table/issues/WIK-16060)
-   **types:** adjust field type and record value #WIK-16187 ([#21](https://github.com/worktile/ai-table/issues/21)) ([2938add](https://github.com/worktile/ai-table/commit/2938add3ebf4497b0367b6499bc8c163c395dc3b)), closes [#WIK-16187](https://github.com/worktile/ai-table/issues/WIK-16187)

## [0.0.3](https://github.com/worktile/ai-table/compare/0.0.2...0.0.3) (2024-07-22)

### Features

-   support add and extend field #WIK-16038 ([#10](https://github.com/worktile/ai-table/issues/10)) ([74edbbb](https://github.com/worktile/ai-table/commit/74edbbbca3f387454bb22f436eaef0f67367b5e1)), closes [#WIK-16038](https://github.com/worktile/ai-table/issues/WIK-16038)

## 0.0.2 (2024-07-16)

## 0.0.1 (2024-07-15)

### Features

-   **grid:** move event listener to AITableGridEventService #WIK-15924 ([#3](https://github.com/worktile/v-table/issues/3)) ([b15621f](https://github.com/worktile/v-table/commit/b15621f1815fe80569aaf4feae95c510618bef19)), closes [#WIK-15924](https://github.com/worktile/v-table/issues/WIK-15924)
-   **grid:** support dateTime editor #WIK-16048 ([#4](https://github.com/worktile/v-table/issues/4)) ([090cd8a](https://github.com/worktile/v-table/commit/090cd8ae4eeb8dda20e4991108ed2bc6684501bd)), closes [#WIK-16048](https://github.com/worktile/v-table/issues/WIK-16048)
-   **grid:** support display rating and link field #WIK-16072 ([#5](https://github.com/worktile/v-table/issues/5)) ([eaf0172](https://github.com/worktile/v-table/commit/eaf017222ba62edfdbd3774b63c3a245eafa0681)), closes [#WIK-16072](https://github.com/worktile/v-table/issues/WIK-16072)
-   **grid:** support number editor #WIK-16029 ([#2](https://github.com/worktile/v-table/issues/2)) ([b9fbfbc](https://github.com/worktile/v-table/commit/b9fbfbcf698f48e6a2e18f123dd24b78d21ff51c)), closes [#WIK-16029](https://github.com/worktile/v-table/issues/WIK-16029)
-   init ai table ([#1](https://github.com/worktile/v-table/issues/1)) ([224c0dd](https://github.com/worktile/v-table/commit/224c0dd6cba2bf3fc9f419a27b1d3b043af46955))
