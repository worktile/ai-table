import Konva from 'konva';
import { GRID_ADD_FIELD_BUTTON_WIDTH, GRID_ROW_HEAD_WIDTH } from '../constants/grid';
import { AITableUseGrid } from '../interface/view';
import { createGridContent } from './create-grid-content';

export const createGrid = (config: AITableUseGrid) => {
    const { context, instance, scrollState, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex, offsetX = 0 } = config;
    const { scrollTop, scrollLeft } = scrollState;
    const { frozenColumnWidth, containerWidth, containerHeight } = instance;
    const frozenAreaWidth = GRID_ROW_HEAD_WIDTH + frozenColumnWidth;
    const lastColumnWidth = instance.getColumnWidth(columnStopIndex);
    const lastColumnOffset = instance.getColumnOffset(columnStopIndex);
    const addFieldBtnWidth = GRID_ADD_FIELD_BUTTON_WIDTH;
    const cellGroupClipWidth = Math.min(
        containerWidth - frozenAreaWidth,
        addFieldBtnWidth + lastColumnOffset + lastColumnWidth - frozenAreaWidth
    );

    const { fieldHeads, frozenFieldHead, frozenCells, cells, addFieldBtn } = createGridContent({
        context,
        instance,
        rowStartIndex,
        rowStopIndex,
        columnStartIndex,
        columnStopIndex,
        scrollState
    });

    const layer = new Konva.Layer();
    const grid = new Konva.Group();
    const gridContainer = new Konva.Group({
        clipX: offsetX,
        clipY: 0,
        clipWidth: containerWidth - offsetX,
        clipHeight: containerHeight
    });
    const gridView = new Konva.Group({ x: offsetX });
    const gridContent = new Konva.Group({ offsetY: scrollTop });
    const gridCommonCellContainer = new Konva.Group({
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

    gridCommonRowContainer.add(cells);
    gridCommonHeadContainer.add(...fieldHeads);
    gridCommonHeadContainer.add(addFieldBtn!);
    gridCommonCellContainer.add(gridCommonRowContainer);
    gridCommonCellContainer.add(gridCommonRowContainer);
    gridCommonCellContainer.add(gridCommonHeadContainer);
    gridContent.add(frozenCells);
    gridView.add(gridContent);

    const frozenFieldHeads = frozenFieldHead();
    gridView.add(...frozenFieldHeads);
    gridView.add(gridCommonCellContainer);
    gridContainer.add(gridView);
    grid.add(gridContainer);
    layer.add(grid);

    /**
     * <layer>
     *  <grid>
     *      <gridContainer>
     *          <gridView>
     *              <gridContent>
     *                  <frozenCells>
     *              </gridContent>
     *              { ...frozenFieldHeads }
     *              <gridCommonCellContainer>
     *                  <gridCommonRowContainer>
     *                      <cells>
     *                  </gridCommonRowContainer>
     *                  <gridCommonHeadContainer>
     *                      { ... fieldHeads }
     *                  </gridCommonHeadContainer>
     *              </gridCommonCellContainer>
     *          </gridView>
     *      </gridContainer>
     *  </grid>
     * </layer>
     */

    return layer;
};
