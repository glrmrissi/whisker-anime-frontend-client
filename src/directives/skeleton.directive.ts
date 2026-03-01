import { Directive, input, TemplateRef, ViewContainerRef, effect } from '@angular/core';

@Directive({
  selector: '[appSkeleton]',
  standalone: true
})
export class SkeletonDirective {
  isLoading = input<boolean>(false, { alias: 'appSkeleton' });
  
  elseTemplate = input<TemplateRef<any> | undefined>(undefined, { alias: 'appSkeletonElse' });

  constructor(
    private templateRef: TemplateRef<any>, 
    private viewContainer: ViewContainerRef
  ) {
    effect(() => {
      this.viewContainer.clear();
      
      if (this.isLoading()) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else if (this.elseTemplate()) {
        this.viewContainer.createEmbeddedView(this.elseTemplate()!);
      }
    });
  }
}