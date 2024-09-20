import Konva from 'konva';
import Node = Konva.Node;

export default function updatePicture(node: Node) {
    const drawingNode = node.getLayer() || node.getStage();
    if (drawingNode) {
        drawingNode.batchDraw();
    }
}
