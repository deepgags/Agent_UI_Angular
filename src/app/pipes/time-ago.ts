import { Pipe, PipeTransform } from "@angular/core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

@Pipe({
	name: "timeAgo",
})
export class TimeAgo implements PipeTransform {
	transform(value: any): any {
		return dayjs(value).fromNow();
	}
}
