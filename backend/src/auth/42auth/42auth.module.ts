import { Module } from "@nestjs/common";
import {Auth42Service } from "./42auth.service";
@Module({
    providers: [Auth42Service],
    exports: [Auth42Service],
})
export class Auth42Module {}