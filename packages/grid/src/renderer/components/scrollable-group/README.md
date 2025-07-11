# AITableScrollableGroup 可滚动组件

这是一个基于 Konva.js 的可滚动组件，可以将任何 ko-group 转换为可滚动的容器，支持横向和竖向滚动条。

## 功能特性

- ✅ 支持横向和竖向滚动
- ✅ 自定义滚动条样式
- ✅ 拖拽滚动条滑块
- ✅ 点击滚动条轨道跳转
- ✅ 鼠标滚轮滚动
- ✅ 自动显示/隐藏滚动条（1秒后自动隐藏）
- ✅ 鼠标悬停时显示滚动条
- ✅ 内容裁剪
- ✅ 响应式滚动条大小
- ✅ 可单独控制横向/竖向滚动条显示
- ✅ 编程控制滚动位置
- ❌ 通过指令将普通的group改编成滚动的group

## 使用方法

### 基本用法

```typescript
import { AITableScrollableGroup, ScrollableGroupConfig } from './scrollable-group';

@Component({
    selector: 'my-component',
    template: `
        <ai-table-scrollable-group [config]="scrollConfig()">
            <!-- 你的内容 -->
            <ko-group>
                <ko-rect [config]="rectConfig()"></ko-rect>
                <ko-text [config]="textConfig()"></ko-text>
            </ko-group>
        </ai-table-scrollable-group>
    `,
    imports: [AITableScrollableGroup, KoContainer, KoShape]
})
export class MyComponent {
    scrollConfig = computed<ScrollableGroupConfig>(() => ({
        width: 400,
        height: 300,
        contentWidth: 800,
        contentHeight: 600,
        scrollbarSize: 12,
        scrollbarColor: '#666666',
        scrollbarTrackColor: '#f0f0f0',
        verticalScrollbar: true,
        horizontalScrollbar: true
    }));
}
```

### 配置选项

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `width` | `number` | ✅ | - | 容器宽度 |
| `height` | `number` | ✅ | - | 容器高度 |
| `contentWidth` | `number` | ✅ | - | 内容宽度 |
| `contentHeight` | `number` | ✅ | - | 内容高度 |
| `scrollbarSize` | `number` | ❌ | `12` | 滚动条大小 |
| `scrollbarColor` | `string` | ❌ | `#c0c0c0` | 滚动条滑块颜色 |
| `scrollbarTrackColor` | `string` | ❌ | `#f0f0f0` | 滚动条轨道颜色 |
| `verticalScrollbar` | `boolean` | ❌ | `true` | 是否显示竖向滚动条 |
| `horizontalScrollbar` | `boolean` | ❌ | `true` | 是否显示横向滚动条 |
| `x` | `number` | ❌ | `0` | 容器X坐标 |
| `y` | `number` | ❌ | `0` | 容器Y坐标 |

### 滚动条显示逻辑

- **竖向滚动条**：当 `verticalScrollbar` 为 `true` 且 `contentHeight > height` 时显示
- **横向滚动条**：当 `horizontalScrollbar` 为 `true` 且 `contentWidth > width` 时显示
- **滚动条位置**：竖向滚动条在右侧，横向滚动条在底部
- **滚动条大小**：当同时显示两个滚动条时，会调整滚动条大小避免重叠
- **自动隐藏**：滚动条在1秒后自动隐藏，鼠标悬停时重新显示

### 交互功能

#### 鼠标滚轮滚动
- 支持鼠标滚轮进行横向和竖向滚动
- 滚动时会自动显示滚动条

#### 滚动条拖拽
- 可以直接拖拽滚动条滑块进行滚动
- 拖拽时会实时更新内容位置

#### 滚动条轨道点击
- 点击滚动条轨道可以快速跳转到对应位置
- 点击位置会考虑滑块大小进行居中定位

#### 滚动条显示控制
- 滚动条会在1秒后自动隐藏
- 鼠标悬停在滚动条区域时会重新显示
- 可以通过配置单独控制横向/竖向滚动条的显示

### 编程控制滚动

组件提供了以下方法来控制滚动：

```typescript
// 滚动到指定位置
scrollTo(x: number, y: number);

// 滚动到顶部
scrollToTop();

// 滚动到底部
scrollToBottom();

// 滚动到左侧
scrollToLeft();

// 滚动到右侧
scrollToRight();

// 按增量滚动
scrollByDelta({ deltaX?: number, deltaY?: number });
```

### 样式自定义

你可以通过配置来自定义滚动条的外观：

```typescript
scrollConfig = computed<ScrollableGroupConfig>(() => ({
    width: 400,
    height: 300,
    contentWidth: 800,
    contentHeight: 600,
    scrollbarSize: 16,                    // 更粗的滚动条
    scrollbarColor: '#2196f3',           // 蓝色滑块
    scrollbarTrackColor: '#e3f2fd',      // 浅蓝色轨道
    verticalScrollbar: true,             // 显示竖向滚动条
    horizontalScrollbar: true            // 显示横向滚动条
}));
```

### 高级配置

#### 单独控制滚动条显示

```typescript
scrollConfig = computed<ScrollableGroupConfig>(() => ({
    width: 400,
    height: 300,
    contentWidth: 800,
    contentHeight: 600,
    verticalScrollbar: true,    // 只显示竖向滚动条
    horizontalScrollbar: false  // 隐藏横向滚动条
}));
```

#### 自定义滚动条样式

```typescript
scrollConfig = computed<ScrollableGroupConfig>(() => ({
    width: 400,
    height: 300,
    contentWidth: 800,
    contentHeight: 600,
    scrollbarSize: 20,                    // 更粗的滚动条
    scrollbarColor: '#ff5722',           // 橙色滑块
    scrollbarTrackColor: '#fff3e0'       // 浅橙色轨道
}));
```

## 注意事项

1. **内容裁剪**：组件会自动裁剪超出容器范围的内容
2. **事件处理**：滚动条拖拽使用原生DOM事件，确保在组件销毁时正确清理
3. **性能优化**：使用Angular的信号系统进行响应式更新
4. **兼容性**：基于Konva.js，确保你的项目已经正确配置了Konva
5. **滚动条显示**：滚动条会在1秒后自动隐藏，鼠标悬停时重新显示
6. **最小滑块大小**：滚动条滑块最小尺寸为20px，确保可用性

## 示例

查看 `scrollable-group.example.ts` 文件获取完整的使用示例。

### 示例代码

```typescript
@Component({
    selector: 'ai-table-scrollable-example',
    template: `
        <ai-table-scrollable-group [config]="scrollConfig()">
            <ko-group>
                <ko-rect [config]="contentRectConfig()"></ko-rect>
                <ko-text [config]="textConfig()"></ko-text>
                @for (circle of circles(); track $index) {
                    <ko-circle [config]="circle"></ko-circle>
                }
            </ko-group>
        </ai-table-scrollable-group>
    `,
    imports: [AITableScrollableGroup, KoContainer, KoShape]
})
export class AITableScrollableExample {
    scrollConfig = computed<ScrollableGroupConfig>(() => ({
        width: 400,
        height: 300,
        contentWidth: 800,
        contentHeight: 600,
        scrollbarSize: 12,
        scrollbarColor: '#666666',
        scrollbarTrackColor: '#f0f0f0',
        x: 50,
        y: 50
    }));
}
``` 
