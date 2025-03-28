# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

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
