import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyTooltipDirective } from 'ngx-tethys/tooltip';

@Component({
    selector: 'rate-display',
    template: `
        <div class="thy-rate-container thy-rate-container--disabled">
            @for (rate of rates(); track rate; let idx = $index) {
                <div class="thy-rate-star" [ngClass]="rateStyles()[idx] || ''">
                    <div class="thy-rate-item-left">
                        <thy-icon thyIconName="star-fill"></thy-icon>
                    </div>
                    <div class="thy-rate-item-all">
                        <thy-icon thyIconName="star-fill"></thy-icon>
                    </div>
                </div>
            }
        </div>
    `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgClass, ThyTooltipDirective, ThyIcon],
    host: {
        class: 'rate-display thy-rate'
    }
})
export class RateDisplayComponent {
    /**
     * 自定义评分的总数
     */
    thyCount = input<number>(5);

    currentValue = input<number>(0);

    rates = computed(() => {
        return Array(this.thyCount())
            .fill(0)
            .map((_, i) => {
                return i;
            });
    });

    rateStyles = computed(() => {
        const rateStyle = 'thy-rate-star';
        return this.rates().map((i) => {
            const value = i + 1;
            const hasHalf = !Number.isInteger(this.currentValue());
            return {
                [`${rateStyle}--full`]: value < this.currentValue() || (value === this.currentValue() && !hasHalf),
                [`${rateStyle}--half`]: hasHalf && value === this.currentValue(),
                [`${rateStyle}--active`]: hasHalf && value === this.currentValue(),
                [`${rateStyle}--zero`]: value > this.currentValue()
            };
        });
    });
}
