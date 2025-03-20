import { ConnectedPosition, FlexibleConnectedPositionStrategy, Overlay, OverlayRef, ScrollDispatcher, ViewportRuler } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { AfterViewInit, Component, ContentChild, OnDestroy, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShDropdownContentDirective } from './sh-dropdown-content.directive';
import { ShDropdownTriggerDirective } from './sh-dropdown-trigger.directive';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'sh-dropdown',
  template: `<ng-content></ng-content>
    
            <ng-template #animationWrapper>
              <div [@dropdownAnimation]="animationState"
                  (@dropdownAnimation.done)="onAnimationDone($event)">

                  <div class="dropdown-content">
                    <ng-container *ngTemplateOutlet="content?.templateRef || null"></ng-container>
                  </div>
              </div>
            </ng-template>`,
  animations: [
    trigger('dropdownAnimation', [
      state('void', style({
        transformOrigin: 'top center',
        opacity: 0,
        transform: 'scaleY(0)'
      })),
      state('visible', style({
        transformOrigin: 'top center',
        opacity: 1,
        transform: 'scaleY(1)'
      })),
      transition('void => visible', animate('220ms ease-in')),
      transition('visible => void', animate('220ms ease-out'))
    ])
  ]
})
export class ShDropdownComponent implements AfterViewInit, OnDestroy {
  @ContentChild(ShDropdownTriggerDirective) trigger!: ShDropdownTriggerDirective;
  @ContentChild(ShDropdownContentDirective) content!: ShDropdownContentDirective;

  private overlayRef!: OverlayRef;
  private subscriptions: Subscription[] = [];

  // Thêm các state animation
  animationState: 'void' | 'visible' = 'void';
  private isAnimating = false;

  @ViewChild('animationWrapper') animationWrapper!: TemplateRef<any>;

  constructor(
    private overlay: Overlay,
    private viewportRuler: ViewportRuler,
    private scrollDispatcher: ScrollDispatcher,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngAfterViewInit(): void {
    this.createOverlay();
    this.setupListeners();
  }

  private createOverlay(): void {
    const positionStrategy = this.getPositionStrategy();

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop'
    });
  }

  private getPositionStrategy(): FlexibleConnectedPositionStrategy {
    return this.overlay.position()
      .flexibleConnectedTo(this.trigger.elementRef)
      .withPositions(this.getPositions())
      .withPush(true);
  }

  private getPositions(): ConnectedPosition[] {
    return [
      { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
      { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' }
    ];
  }

  private setupListeners(): void {
    // Trigger click
    this.trigger.elementRef.nativeElement.addEventListener('click', () => this.toggle());

    // Backdrop click
    this.overlayRef.backdropClick().subscribe(() => this.close());

    // Window events
    this.subscriptions.push(
      this.viewportRuler.change().subscribe(() => this.updatePosition()),
      this.scrollDispatcher.scrolled().subscribe(() => this.updatePosition())
    );
  }

  private toggle(): void {
    this.overlayRef.hasAttached() ? this.close() : this.open();
  }

  private open(): void {
    if (!this.overlayRef.hasAttached()) {
      this.animationState = 'visible';
      const portal = new TemplatePortal(
        this.animationWrapper,
        this.viewContainerRef
      );
      this.overlayRef.attach(portal);
    }
  }

  private close(): void {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.animationState = 'void';
  }

  // Xử lý khi animation hoàn thành
  onAnimationDone(event: any): void {
    if (event.toState === 'void') {
      this.overlayRef.detach();
      this.isAnimating = false;
    }
  }

  private updatePosition(): void {
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.updatePosition();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.overlayRef.dispose();
  }
}