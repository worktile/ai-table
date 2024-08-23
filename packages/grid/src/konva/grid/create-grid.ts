import { AIGrid } from '@ai-table/grid';
import Konva from 'konva';
import { GRID_ADD_FIELD_BUTTON_WIDTH, GRID_ROW_HEAD_WIDTH } from '../constants/grid';
import { AITableUseGrid } from '../interface/view';
import { createGridContent } from './create-grid-content';

export const createGrid = (config: AITableUseGrid) => {
    const { context, instance, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex, offsetX = 0 } = config;
    const { aiTable, scrollState } = context;

    const {
        fieldHeads,
        frozenFieldHead,
        frozenCells,
        cells,
        addFieldBtn,
        activedCell,
        activeCellBorder,
        frozenActivedCell,
        frozenActiveCellBorder,
        fillHandler,
        frozenFillHandler,
        placeHolderCells,
        frozenPlaceHolderCells,
        draggingOutline,
        toggleEditing
    } = createGridContent({
        context,
        instance,
        rowStartIndex,
        rowStopIndex,
        columnStartIndex,
        columnStopIndex
    });

    const colors = AIGrid.getThemeColors(aiTable);
    const { scrollTop, scrollLeft } = scrollState;
    const { frozenColumnWidth, containerWidth, containerHeight, rowInitSize } = instance;
    const frozenAreaWidth = GRID_ROW_HEAD_WIDTH + frozenColumnWidth;
    const lastColumnWidth = instance.getColumnWidth(columnStopIndex);
    const lastColumnOffset = instance.getColumnOffset(columnStopIndex);
    const addFieldBtnWidth = GRID_ADD_FIELD_BUTTON_WIDTH;
    const cellGroupClipWidth = Math.min(
        containerWidth - frozenAreaWidth,
        addFieldBtnWidth + lastColumnOffset + lastColumnWidth - scrollLeft! - frozenAreaWidth
    );

    const layer = new Konva.Layer();
    const grid = new Konva.Group();
    const gridContainer = new Konva.Group({
        clipX: offsetX,
        clipY: 0,
        clipWidth: containerWidth - offsetX,
        clipHeight: containerHeight
    });
    const gridView = new Konva.Group({
        x: offsetX
    });
    const frozenContainer = new Konva.Group({
        offsetY: scrollTop
    });
    const gridCommonContainer = new Konva.Group({
        clipX: frozenAreaWidth + 1,
        clipY: 0,
        clipWidth: cellGroupClipWidth,
        clipHeight: containerHeight
    });
    const gridCommonRowContainer = new Konva.Group({
        offsetX: scrollLeft,
        offsetY: scrollTop
    });
    const gridCommonHeadContainer = new Konva.Group({
        offsetX: scrollLeft
    });
    const contextBg = new Konva.Rect({
        width: 8,
        height: 8,
        fill: colors.lowestBg,
        listening: false
    });
    const attachContainer = new Konva.Group({
        clipX: frozenAreaWidth - 1,
        clipY: rowInitSize - 1,
        clipWidth: containerWidth - frozenAreaWidth,
        clipHeight: containerHeight - rowInitSize
    });
    const attachChildContainer = new Konva.Group({
        offsetX: scrollLeft,
        offsetY: scrollTop
    });
    const frozenAttachContainer = new Konva.Group({
        clipX: 0,
        clipY: rowInitSize - 1,
        clipWidth: frozenAreaWidth + 4,
        clipHeight: containerHeight - rowInitSize
    });
    const frozenAttachChildContainer = new Konva.Group({
        offsetY: scrollTop
    });

    // 冻结列(首列)
    frozenContainer.add(frozenCells);
    // frozenContainer.add(...otherRows);
    // frozenContainer.add(...hoverRowHeadOperation);
    // frozenContainer.add(...frozenGroupStats);
    // 冻结列单元格填充
    frozenContainer.add(...frozenPlaceHolderCells);
    // frozenContainer.add(frozenCollaboratorBorders);
    frozenActivedCell && frozenContainer.add(...frozenActivedCell);
    // frozenContainer.add(frozenDateAlarms);
    // frozenContainer.add(frozenDateAddAlarm);

    gridView.add(frozenContainer);
    gridView.add(contextBg);
    gridView.add(...frozenFieldHead);
    // gridView.add(...frozenOpacityLines);
    gridView.add(gridCommonContainer);
    gridCommonContainer.add(gridCommonRowContainer);
    gridCommonContainer.add(gridCommonHeadContainer);

    // 属性列 head 父级 group

    // 单元格父级 group
    gridCommonRowContainer.add(cells);

    gridCommonHeadContainer.add(...fieldHeads);
    // gridCommonHeadContainer.add(...opacityLines);
    // 添加属性列
    if (addFieldBtn) {
        gridCommonHeadContainer.add(addFieldBtn);
    }

    gridContainer.add(gridView);
    grid.add(gridContainer);
    layer.add(grid);

    /**
     * <layer>
     *    <grid>
     *      <gridContainer>
     *          <gridView>
     *              <frozenContainer>
     *                  { ...frozenFieldHeads }
     *                  <frozenCells />
     *                 <...frozenPlaceHolderCells />
     *              </frozenContainer>
     *
     *              <gridCommonContainer>
     *                  <gridCommonRowContainer>
     *                      <cells />
     *                  </gridCommonRowContainer>
     *                  <gridCommonHeadContainer>
     *                      { ...fieldHeads }
     *                  </gridCommonHeadContainer>
     *              </gridCommonContainer>
     *              <attachContainer>
     *                  <attachChildContainer>
     *                      { ...placeHolderCells }
     *                      { activedCell }
     *                      { activeCellBorder }
     *                  </attachChildContainer>
     *              </attachChildContainer>
     *          </gridView>
     *      </gridContainer>
     *    </grid>
     * </layer>
     */
    return layer;
};
