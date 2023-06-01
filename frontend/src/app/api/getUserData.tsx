"use client"
import {useMutation} from "react-query";
import {islog} from "@/app/auth/auth.api";
import Api from "@/app/api/api";

export default function GetUserData() {
    Api.init();
    const data = useMutation(islog, {
        onSuccess: () => {
            // console.log(data);
        }
    })
    return data;
}
