import { Overlay } from "@angular/cdk/overlay";

export function thyPopoverScrollStrategyFactory(overlay: Overlay) {
    return () => overlay.scrollStrategies.close();
}
