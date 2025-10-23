import { ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injector } from "@angular/core";

import { CustomInfoWindowComponent } from "./custom-info-window.component";

export class CustomOverlay extends google.maps.OverlayView {
	private content: { property: any; html: string };
	private componentRef: any;

	constructor(
		private position: google.maps.LatLng,
		content: { property: any; html: string },
		private componentFactoryResolver: ComponentFactoryResolver,
		private appRef: ApplicationRef,
		private injector: Injector
	) {
		super();
		this.content = content;
	}

	override onAdd() {
		const factory = this.componentFactoryResolver.resolveComponentFactory(CustomInfoWindowComponent);
		this.componentRef = factory.create(this.injector);
		this.componentRef.instance.infoContent = this.content;
		this.componentRef.instance.closeInfoWindow.subscribe(() => {
			this.close();
		});
		this.appRef.attachView(this.componentRef.hostView);

		const div = document.createElement("div");
		div.style.position = "absolute";
		div.appendChild((this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement);
		this.getPanes()?.floatPane.appendChild(div);
	}

	override draw() {
		const overlayProjection = this.getProjection();
		const sw = overlayProjection.fromLatLngToDivPixel(this.position);
		const div = this.getPanes()?.floatPane.children[0] as HTMLElement;

		if (div && sw) {
			const infoWindowWidth = div.offsetWidth;
			const infoWindowHeight = div.offsetHeight;

			const mapWidth = div.parentElement?.parentElement?.offsetWidth || 0;
			const mapHeight = div.parentElement?.parentElement?.offsetHeight || 0;

			let left = sw.x - infoWindowWidth / 2;
			let top = sw.y - infoWindowHeight - 30; // 30px for the arrow

			if (left < 0) {
				left = 0;
			}

			if (left + infoWindowWidth > mapWidth) {
				left = mapWidth - infoWindowWidth;
			}

			if (top < 0) {
				top = sw.y + 10; // Position below the marker
			}

			div.style.left = left + "px";
			div.style.top = top + "px";
		}
	}

	override onRemove() {
		if (this.componentRef) {
			this.appRef.detachView(this.componentRef.hostView);
			this.componentRef.destroy();
		}
	}

	close() {
		this.setMap(null);
	}
}
