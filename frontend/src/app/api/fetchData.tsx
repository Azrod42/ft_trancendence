import {isUserLog} from "@/app/(common)/checkLog";

export async function getMyData() {
    return await isUserLog();
}