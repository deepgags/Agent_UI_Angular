import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "blobToUrl",
	standalone: true,
	pure: false,
})
export class BlobToUrlPipe implements PipeTransform {
	private objectUrls = new Map<Blob, string>();

	transform(value: Blob | string | null | undefined): string | null {
		if (typeof value === "string") {
			return value;
		}

		if (!value) {
			return null;
		}

		if (value instanceof Blob) {
			if (this.objectUrls.has(value)) {
				return this.objectUrls.get(value)!;
			}

			const objectUrl = URL.createObjectURL(value);
			this.objectUrls.set(value, objectUrl);
			return objectUrl;
		}

		return null;
	}

	ngOnDestroy() {
		this.objectUrls.forEach((url) => {
			URL.revokeObjectURL(url);
		});
		this.objectUrls.clear();
	}
}
