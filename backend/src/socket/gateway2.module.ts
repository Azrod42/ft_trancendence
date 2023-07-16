import {Module} from '@nestjs/common'
import {MyGateway2} from './gateway'


@Module({
    providers:[MyGateway2],
})
export class GatewayModule2{};