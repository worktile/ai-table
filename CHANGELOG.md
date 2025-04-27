# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

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
