import {Module} from "@nestjs/common";
import {MyGateway} from "./gateway";
import {MessageBody, SubscribeMessage} from "@nestjs/websockets";

@Module({
    providers: [MyGateway]
})
export class GatewayModule {

}