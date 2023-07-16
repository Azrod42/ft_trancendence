import {Module} from "@nestjs/common";
import {MyGateway} from "./gateway";
import {UserService} from "../user/user.service"; // import UserService
import {UserModule} from "../user/user.module"; // import UserModule

@Module({
    imports: [UserModule], // include UserModule in imports array
    providers: [MyGateway, UserService] // include UserService in providers array
})
export class GatewayModule {

}
