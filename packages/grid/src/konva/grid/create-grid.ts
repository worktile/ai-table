import Konva from 'konva';
import { GRID_ADD_FIELD_BUTTON_WIDTH, GRID_ROW_HEAD_WIDTH } from '../constants/grid';
import { AITableUseGrid } from '../interface/view';
import { createGridContent } from './create-grid-content';

export const createGrid = (config: AITableUseGrid) => {
    const {
        context,
        instance,
        scrollState,
        rowStartIndex,
        rowStopIndex,
        columnStartIndex,
        columnStopIndex,
        offsetX = 0,
        linearRows
    } = config;

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
        linearRows,
        rowStartIndex,
        rowStopIndex,
        columnStartIndex,
        columnStopIndex,
        scrollState
    });

    const { scrollTop, scrollLeft } = scrollState;
    const { frozenColumnWidth, containerWidth, containerHeight, rowInitSize } = instance;
    const frozenAreaWidth = GRID_ROW_HEAD_WIDTH + frozenColumnWidth;
    const lastColumnWidth = instance.getColumnWidth(columnStopIndex);
    const lastColumnOffset = instance.getColumnOffset(columnStopIndex);
    const addFieldBtnWidth = GRID_ADD_FIELD_BUTTON_WIDTH;
    const cellGroupClipWidth = Math.min(
        containerWidth - frozenAreaWidth,
        addFieldBtnWidth + lastColumnOffset + lastColumnWidth - scrollLeft - frozenAreaWidth
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
    const gridContent = new Konva.Group({
        offsetY: scrollTop
    });
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
    if (addFieldBtn) {
        gridCommonHeadContainer.add(addFieldBtn);
    }
    gridCommonCellContainer.add(gridCommonRowContainer);
    gridCommonCellContainer.add(gridCommonRowContainer);
    gridCommonCellContainer.add(gridCommonHeadContainer);
    gridContent.add(frozenCells);
    gridView.add(gridContent);

    gridView.add(...frozenFieldHead);
    gridView.add(gridCommonCellContainer);

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

    attachContainer.add(attachChildContainer);
    attachChildContainer.add(...placeHolderCells);

    if (activedCell) {
        attachChildContainer.add(activedCell);
    }
    if (activeCellBorder) {
        attachChildContainer.add(activeCellBorder);
    }

    gridView.add(attachContainer);
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
     *                      { ...fieldHeads }
     *                  </gridCommonHeadContainer>
     *              </gridCommonCellContainer>
     *          </gridView>
     *      </gridContainer>
     *  </grid>
     * </layer>
     */
    return layer;
};
