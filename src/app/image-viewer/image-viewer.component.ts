import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageViewerComponent implements AfterViewInit {
  images = [
    'assets/img/photo1.jpg',
    'assets/img/photo2.jpg',
    'assets/img/photo3.jpg'
  ];
  currentIndex = 0;

  // 單一狀態（所有圖片共用同一份）
  state = {
    scale: 1,
    scrollLeft: 0,
    scrollTop: 0
  };

  @ViewChild('imgContainer') imgContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('image') image!: ElementRef<HTMLImageElement>;
  @ViewChild('previewContainer') previewContainer!: ElementRef<HTMLDivElement>;

  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private scrollLeft = 0;
  private scrollTop = 0;
  private isPreviewDragging = false;
  private previewStartX = 0;
  private previewStartY = 0;
  private previewInitialScrollLeft = 0;
  private previewInitialScrollTop = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.applyState();
  }

  @HostListener('document:mousemove', ['$event'])
  onGlobalMouseMove(event: MouseEvent) {
    if (this.isPreviewDragging) {
      this.onPreviewMouseMove(event);
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onGlobalMouseUp(event: MouseEvent) {
    if (this.isPreviewDragging) {
      this.onPreviewMouseUp();
    }
  }

  @HostListener('document:mouseleave', ['$event'])
  onGlobalMouseLeave(event: MouseEvent) {
    if (this.isPreviewDragging) {
      this.onPreviewMouseUp();
    }
  }

  // 切換圖片（繼承上一張的狀態）
  nextImage() {
    this.saveState();
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    setTimeout(() => this.applyState());
  }

  prevImage() {
    this.saveState();
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    setTimeout(() => this.applyState());
  }

  // 透過縮圖選擇圖片
  selectImage(index: number) {
    this.saveState();
    this.currentIndex = index;
    setTimeout(() => this.applyState());
  }

  // 縮放
  zoomIn() {
    this.saveState();
    this.state.scale = Math.min(this.state.scale * 1.2, 5);
    this.applyState();
  }

  zoomOut() {
    this.saveState();
    this.state.scale = Math.max(this.state.scale / 1.2, 1);
    this.applyState();
  }

  // === 滑鼠拖拉 ===
  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.pageX - this.imgContainer.nativeElement.offsetLeft;
    this.startY = event.pageY - this.imgContainer.nativeElement.offsetTop;
    this.scrollLeft = this.imgContainer.nativeElement.scrollLeft;
    this.scrollTop = this.imgContainer.nativeElement.scrollTop;
  }

  onMouseLeave() {
    this.isDragging = false;
  }

  onMouseUp() {
    this.isDragging = false;
    this.saveState();
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = event.pageX - this.imgContainer.nativeElement.offsetLeft;
    const y = event.pageY - this.imgContainer.nativeElement.offsetTop;
    const walkX = x - this.startX;
    const walkY = y - this.startY;
    this.imgContainer.nativeElement.scrollLeft = this.scrollLeft - walkX;
    this.imgContainer.nativeElement.scrollTop = this.scrollTop - walkY;

    // 實時更新預覽
    this.updatePreview();
  }

  // === 滾輪縮放 ===
  onMouseWheel(event: WheelEvent) {
    event.preventDefault();

    const container = this.imgContainer.nativeElement;
    const img = this.image.nativeElement;

    // 滑鼠相對於容器的位置
    const mouseXInContainer = event.clientX - container.getBoundingClientRect().left;
    const mouseYInContainer = event.clientY - container.getBoundingClientRect().top;

    // 滑鼠相對於圖片的位置（考慮捲軸偏移）
    const mouseXInImage = mouseXInContainer + container.scrollLeft;
    const mouseYInImage = mouseYInContainer + container.scrollTop;

    // 保存舊的縮放比例
    const oldScale = this.state.scale;

    // 更新縮放
    if (event.deltaY < 0) {
      this.state.scale = Math.min(this.state.scale * 1.2, 5);
    } else {
      this.state.scale = Math.max(this.state.scale / 1.2, 1);
    }

    // 計算縮放後的新捲軸位置，使滑鼠位置保持不變
    const newScrollLeft = (mouseXInImage * this.state.scale) / oldScale - mouseXInContainer;
    const newScrollTop = (mouseYInImage * this.state.scale) / oldScale - mouseYInContainer;

    this.state.scrollLeft = Math.max(0, newScrollLeft);
    this.state.scrollTop = Math.max(0, newScrollTop);

    this.applyState();
  }

  // === 預覽框拖拉 ===
  onPreviewMouseDown(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    this.isPreviewDragging = true;
    this.isDragging = false;  // 確保主圖拖拉被禁用
    this.previewStartX = event.clientX;
    this.previewStartY = event.clientY;

    // 保存當前捲軸位置
    const container = this.imgContainer.nativeElement;
    this.previewInitialScrollLeft = container.scrollLeft;
    this.previewInitialScrollTop = container.scrollTop;
  }

  onPreviewMouseLeave() {
    // 不在此處停止拖拉，讓 document mouseup 來處理
  }

  onPreviewMouseUp() {
    if (this.isPreviewDragging) {
      this.isPreviewDragging = false;
      this.saveState();
    }
  }

  onPreviewMouseMove(event: MouseEvent) {
    if (!this.isPreviewDragging) return;

    event.preventDefault();
    event.stopPropagation();

    const container = this.imgContainer.nativeElement;
    const img = this.image.nativeElement;
    const preview = this.previewContainer.nativeElement;
    const previewImg = preview.querySelector('img') as HTMLImageElement;

    if (!previewImg) return;

    // 計算滑鼠移動距離
    const moveX = event.clientX - this.previewStartX;
    const moveY = event.clientY - this.previewStartY;

    // 計算預覽框中的縮放比例
    const scaleX = previewImg.offsetWidth / img.scrollWidth;
    const scaleY = previewImg.offsetHeight / img.scrollHeight;

    // 根據預覽框的移動距離轉換為主圖的捲軸位置
    const newScrollLeft = this.previewInitialScrollLeft + (moveX / scaleX);
    const newScrollTop = this.previewInitialScrollTop + (moveY / scaleY);

    // 限制捲軸範圍 - 確保不會超出邊界
    const maxScrollLeft = Math.max(0, img.scrollWidth - container.clientWidth);
    const maxScrollTop = Math.max(0, img.scrollHeight - container.clientHeight);

    container.scrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft));
    container.scrollTop = Math.max(0, Math.min(newScrollTop, maxScrollTop));
  }
  private saveState() {
    const container = this.imgContainer.nativeElement;
    this.state.scrollLeft = container.scrollLeft;
    this.state.scrollTop = container.scrollTop;
  }

  private applyState() {
    const img = this.image.nativeElement;
    const container = this.imgContainer.nativeElement;

    img.style.width = `${this.state.scale * 100}%`;
    img.style.height = 'auto';

    container.scrollLeft = this.state.scrollLeft;
    container.scrollTop = this.state.scrollTop;

    // 更新預覽框顯示
    setTimeout(() => this.updatePreview());
  }

  // === 預覽框相關方法 ===
  private updatePreview() {
    // 空方法，預覽框預設都顯示
    this.cdr.markForCheck();
  }

  getPreviewViewportStyle(): string {
    if (!this.imgContainer || !this.previewContainer) {
      return '';
    }

    const container = this.imgContainer.nativeElement;
    const img = this.image.nativeElement;
    const preview = this.previewContainer.nativeElement;
    const previewImg = preview.querySelector('img') as HTMLImageElement;

    if (!previewImg) {
      return '';
    }

    // 計算縮放比例
    const scaleX = previewImg.offsetWidth / img.scrollWidth;
    const scaleY = previewImg.offsetHeight / img.scrollHeight;

    // 計算可見區域在全圖中的相對位置
    const viewportLeft = container.scrollLeft * scaleX;
    const viewportTop = container.scrollTop * scaleY;
    const viewportWidth = container.clientWidth * scaleX;
    const viewportHeight = container.clientHeight * scaleY;

    return `
      left: ${viewportLeft}px;
      top: ${viewportTop}px;
      width: ${viewportWidth}px;
      height: ${viewportHeight}px;
    `;
  }
}
